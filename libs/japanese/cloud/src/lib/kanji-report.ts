/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
    successAndBody,
    statusAndError,
    getSubjectFromToken,
    dynamodb,
    batchGet,
    fromAWSAttributeMapArray,
    dynamoWrapper,
    initMongoDB,
    db, RADICAL_TAG_COLLECTION
} from '../../../../shared/lambda/src';
import { extractKanjis } from '../../../utils/src';
import {
    KanjiReportCounts,
    kanjiAttributes,
    kanjiReport,
    KanjiAttribute,
    KanjiReport,
    kanjiRadicals,
} from '../../../interface/src';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// ^^^ Importing using tsconfig paths not working
// https://github.com/aws/jsii/issues/865

// Kanji Reports
export const getAllKanjiStats = async (): Promise<APIGatewayProxyResult> => {
    const response = await dynamodb
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
    await dynamodb
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

    const result = await dynamodb
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

// Kanji Radicals
export const getKanjisForRadical = async (ev: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const radical = ev.queryStringParameters.radical;
    const result = await dynamoWrapper.query(kanjiRadicals.table, 'radical = :radical',
        { radical },
        'kanji, otherRadicals'
    );

    return successAndBody({ radical, kanjis: result });
};

export const updateRadical = async (query: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!query.body) return statusAndError(400, 'Empty body');

    const data = JSON.parse(query.body);
    const radical = data.radical;
    if (!radical) return statusAndError(400, 'Invalid body');

    delete data['_id'];

    await initMongoDB();
    await db.collection(RADICAL_TAG_COLLECTION)
        .updateOne({ radical }, data, { upsert: true });

    return successAndBody({});
}

async function queryRadicalTags(queryParam, projection) {
    const page = parseInt(queryParam.page);
    const pageSize = parseInt(queryParam.pageSize) || 10;
    const query = {};

    let result = db.collection(RADICAL_TAG_COLLECTION)
        .find(query)
        .project(projection)

    if (!isNaN(page)) {
        result = result.skip(page * pageSize).limit(pageSize);
    }

    const total = await db.collection(RADICAL_TAG_COLLECTION).countDocuments(query);

    return successAndBody({
        content: await result.toArray(),
        page,
        pageSize,
        total,
    });
}

export const getRadicals = async (request: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    await initMongoDB();
    const queryParam = request.queryStringParameters || {};
    return queryRadicalTags(queryParam, { _id: 0, stroke: 0 });
};
