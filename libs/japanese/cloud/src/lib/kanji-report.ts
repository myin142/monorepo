/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { DynamoDB } from 'aws-sdk';
import { chunk } from 'lodash';
import { successAndBody, statusAndError, ApiGatewayResponse } from '../../../../shared/aws/src';
import { extractKanjis } from '../../../utils/src';
import { KanjiReportCounts, kanjiAttributes } from '../../../interface/src';

// ^^^ Importing using tsconfig paths not working
// https://github.com/aws/jsii/issues/865

// TODO: share
const options = { region: 'eu-central-1' };
if (process.env.AWS_SAM_LOCAL) {
    options['endpoint'] = 'http://localhost:8000';
}
const dynamo = new DynamoDB(options);

export const getAllKanjiStats = async (event): Promise<ApiGatewayResponse> => {
    const response = await dynamo
        .getItem({
            TableName: kanjiAttributes.table,
            Key: { kanji: { S: '@' } },
        })
        .promise();

    return successAndBody(JSON.parse(response.Item.counts.S));
};

export const createKanjiReport = async (event): Promise<ApiGatewayResponse> => {
    if (typeof event.body != 'string') return statusAndError(400, 'Invalid body type');
    const kanjis = extractKanjis(event.body);

    const counts: KanjiReportCounts = {
        total: kanjis.length,
        grades: {},
        jlpt: {},
        frequencies: [],
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

                if (item.frequency) {
                    const value = parseInt(item.frequency.N);
                    counts.frequencies.push(value);
                }
            });
        })
    );

    return successAndBody(counts);
};
