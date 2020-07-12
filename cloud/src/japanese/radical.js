const { SSM } = require('aws-sdk');
const mongodb = require('mongodb');

const ssm = new SSM();

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

exports.updateRadicalHandler = async (query, context) => {
    await initMongoDB();

    if (!query.body) return statusAndError(400, 'Empty body');

    const { radical, tags } = JSON.parse(query.body);
    if (!radical || !tags) return statusAndError(400, 'Invalid body');

    const updateRadical = { radical, tags };
    await db.collection(RADICAL_TAG_COLLECTION)
        .update(updateRadical, updateRadical, { upsert: true });

    return successAndBody({});
};

exports.getRadicalHandler = async (query, context) => {
    await initMongoDB();

    const { page = 1, pageSize = 10 } = query.queryStringParameters || {};

    const result = await db.collection(RADICAL_TAG_COLLECTION)
        .find({})
        .toArray();

    return successAndBody({
        content: result,
        page,
        pageSize,
    });
};
