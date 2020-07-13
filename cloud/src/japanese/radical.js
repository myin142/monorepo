const { SSM, S3 } = require('aws-sdk');
const mongodb = require('mongodb');

const ssm = new SSM();
const s3 = new S3();

const RADICAL_TAG_COLLECTION = 'tags';
const RADICAL_DATABASE = 'radical';

let db
let initialized = false;

async function loadConnectionDetails() {
    const urlResponse = await ssm.getParameter({ Name: 'mongodb_url' }).promise();
    const userResponse = await ssm.getParameter({ Name: 'mongodb_user' }).promise();
    const passwordResponse = await ssm.getParameter({
        Name: 'mongodb_password',
        WithDecryption: true,
    }).promise();

    const url = urlResponse.Parameter.Value;
    const user = userResponse.Parameter.Value;
    const password = encodeURIComponent(passwordResponse.Parameter.Value);

    return { url, user, password };
}

async function initMongoDB() {
    if (initialized) return;

    try {
        const { password, url, user } = await loadConnectionDetails();
        const connUrl = `mongodb+srv://${user}:${password}@${url}/${RADICAL_DATABASE}?retryWrites=true&w=majority`;
        const client = new mongodb.MongoClient(connUrl, { useNewUrlParser: true });
        db = (await client.connect()).db(RADICAL_DATABASE);
        console.log('Connected successfully!')
        initialized = true;
    } catch (err) {
        console.log(err);
    }
}

function statusAndBody(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
        },
        body: JSON.stringify(body),
    };
}
function successAndBody(body) {
    return statusAndBody(200, body);
}
function statusAndError(statusCode, error) {
    return statusAndBody(statusCode, { error });
}

exports.syncRadicalHandler = async (query) => {
    console.log('Start Request');

    if (!query.Records || query.Records.length != 1) {
        console.log('Invalid', query.Records);
        return 'invalid event';
    }

    console.log('Get File');

    const { bucket, object } = query.Records[0].s3;
    const response = await s3.getObject({ Bucket: bucket.name, Key: object.key }).promise();

    const data = JSON.parse(response.Body.toString()).map(x => ({
        updateOne: {
            filter: { radical: x.radical },
            update: { $set: x },
            upsert: true,
        },
    }));

    await initMongoDB();
    await db.collection(RADICAL_TAG_COLLECTION)
        .bulkWrite(data);
    console.log('Sync success');

    await s3.deleteObject({ Bucket: bucket.name, Key: object.key }).promise();
    console.log('Sync File deleted');
};

exports.updateRadicalHandler = async (query) => {
    if (!query.body) return statusAndError(400, 'Empty body');

    const data = JSON.parse(query.body);
    const radical = data.radical;
    if (!radical) return statusAndError(400, 'Invalid body');

    delete data['_id'];

    await initMongoDB();
    await db.collection(RADICAL_TAG_COLLECTION)
        .update({ radical }, data, { upsert: true });

    return successAndBody({});
};

exports.getRadicalHandler = async (request) => {
    await initMongoDB();

    const queryParam = request.queryStringParameters || {};
    const page = parseInt(queryParam.page) || 0;
    const pageSize = parseInt(queryParam.pageSize) || 10;

    const query = {};

    const result = await db.collection(RADICAL_TAG_COLLECTION)
        .find(query)
        .skip(page * pageSize)
        .limit(pageSize)
        .toArray();

    const total = await db.collection(RADICAL_TAG_COLLECTION).countDocuments(query);

    return successAndBody({
        content: result,
        page,
        pageSize,
        total,
    });
};
