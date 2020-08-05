/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
    successAndBody,
    statusAndError,
    getSubjectFromToken,
    dynamo,
    batchGet,
    fromAWSAttributeMapArray,
} from '../../../../shared/lambda/src';
import { extractKanjis } from '../../../utils/src';
import {
    KanjiReportCounts,
    kanjiAttributes,
    kanjiReport,
    KanjiAttribute,
    KanjiReport,
} from '../../../interface/src';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// ^^^ Importing using tsconfig paths not working
// https://github.com/aws/jsii/issues/865

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
    ev: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const kanjis = extractKanjis(ev.body);
    if (kanjis.length === 0) return statusAndError(400, 'No kanjis to create report');

    const subject = getSubjectFromToken(ev.headers.Authorization as string);
    const counts: KanjiReportCounts = {
        total: kanjis.length,
        grades: {},
        jlpt: {},
        vocabulary: ev.body.split('\n').length,
    };

    const items = await batchGet<KanjiAttribute>(
        kanjiAttributes.table,
        kanjis.map((k) => ({ kanji: k }))
    );

    items.forEach((i) => {
        if (i.grade) {
            if (!counts.grades[i.grade]) counts.grades[i.grade] = 0;
            counts.grades[i.grade]++;
        }
        if (i.jlpt) {
            if (!counts.jlpt[i.jlpt]) counts.jlpt[i.jlpt] = 0;
            counts.jlpt[i.jlpt]++;
        }
    });

    const created = Date.now();
    await dynamo
        .putItem({
            TableName: kanjiReport.table,
            Item: {
                [kanjiReport.key]: { S: subject },
                [kanjiReport.sort]: { N: `${created}` },
                counts: { S: JSON.stringify(counts) },
            },
        })
        .promise();

    const report: KanjiReport = {
        user: subject,
        created,
        counts,
    };
    return successAndBody(report);
};

export const getKanjiReports = async (ev: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const subject = getSubjectFromToken(ev.headers.Authorization as string);

    const result = await dynamo
        .query({
            TableName: kanjiReport.table,
            KeyConditionExpression: `#${kanjiReport.key} = :u`,
            ExpressionAttributeValues: {
                ':u': { S: subject },
            },
            ExpressionAttributeNames: {
                [`#${kanjiReport.key}`]: kanjiReport.key,
            },
        })
        .promise();

    const items = fromAWSAttributeMapArray<KanjiReport & { counts: string }>(result.Items);
    items.forEach((i) => (i.counts = JSON.parse(i.counts)));

    return successAndBody(items);
};
