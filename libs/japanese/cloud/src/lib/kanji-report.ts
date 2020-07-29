/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { DynamoDB } from 'aws-sdk';
import { chunk } from 'lodash';
import { successAndBody, statusAndError, getSubjectFromToken } from '../../../../shared/lambda/src';
import { extractKanjis } from '../../../utils/src';
import { KanjiReportCounts, kanjiAttributes, kanjiReport } from '../../../interface/src';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// ^^^ Importing using tsconfig paths not working
// https://github.com/aws/jsii/issues/865

// TODO: share
const options = { region: 'eu-central-1' };
if (process.env.AWS_SAM_LOCAL) {
    options['endpoint'] = 'http://localhost:8000';
}
const dynamo = new DynamoDB(options);

export const getAllKanjiStats = async (): Promise<APIGatewayProxyResult> => {
    const response = await dynamo
        .getItem({
            TableName: kanjiAttributes.table,
            Key: { kanji: { S: '@' } },
        })
        .promise();

    return successAndBody(JSON.parse(response.Item.counts.S));
};

export const createKanjiReport = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    if (typeof event.body != 'string') return statusAndError(400, 'Invalid body type');

    const subject = getSubjectFromToken(event.headers.Authorization as string);
    if (!subject) return statusAndError(400, 'Invalid authorization header');

    const kanjis = extractKanjis(event.body);
    if (kanjis.length === 0) return statusAndError(400, 'No kanjis to create report');

    const counts: KanjiReportCounts = {
        total: kanjis.length,
        grades: {},
        jlpt: {},
        // TODO: distribution of frequency?
    };

    await Promise.all(
        chunk(kanjis, 100).map(async (chunk) => {
            const response = await dynamo
                .batchGetItem({
                    RequestItems: {
                        [kanjiAttributes.table]: {
                            Keys: chunk.map((k) => ({ kanji: { S: k } })),
                        },
                    },
                })
                .promise();

            response.Responses[kanjiAttributes.table].forEach((item) => {
                if (item.grade) {
                    const value = item.grade.N;
                    if (!counts.grades[value]) counts.grades[value] = 0;
                    counts.grades[value]++;
                }

                if (item.jlpt) {
                    const value = item.jlpt.N;
                    if (!counts.jlpt[value]) counts.jlpt[value] = 0;
                    counts.jlpt[value]++;
                }
            });
        })
    );

    await dynamo
        .putItem({
            TableName: kanjiReport.table,
            Item: {
                [kanjiReport.key]: { S: subject },
                [kanjiReport.sort]: { N: `${Date.now()}` },
                counts: { S: JSON.stringify(counts) },
            },
        })
        .promise();

    return successAndBody(counts);
};
