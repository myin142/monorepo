const admin = require('firebase-admin');
const { SSM } = require('aws-sdk');

const ssm = new SSM();

let initialized = false;

async function loadFirebaseKey() {
    const keyResponse = await ssm
        .getParameter({
            Name: 'firebase_key',
            WithDecryption: true,
        })
        .promise();
    const emailResponse = await ssm
        .getParameter({
            Name: 'firebase_email',
        })
        .promise();

    const key = keyResponse.Parameter.Value.replace(/\\n/g, '\n');
    const email = emailResponse.Parameter.Value;

    return { key, email };
}

async function initialFirebaseSetup() {
    if (initialized) return;

    const firebase = await loadFirebaseKey();

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: 'japanese-64585',
            privateKey: firebase.key,
            clientEmail: firebase.email,
        }),
        databaseURL: 'https://japanese-64585.firebaseio.com',
    });
}

const RADICAL_COLLECTION = 'radicals';

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
    await initialFirebaseSetup();

    if (!query.body) return statusAndError(400, 'Empty body');

    const { radical, tags } = JSON.parse(query.body);
    if (!radical || !tags) return statusAndError(400, 'Invalid body');

    await admin
        .firestore()
        .collection(RADICAL_COLLECTION)
        .doc(radical)
        .set({ tags });

    return successAndBody({});
};

exports.getRadicalHandler = async (query, context) => {
    await initialFirebaseSetup();

    const result = await admin.firestore().collection(RADICAL_COLLECTION).get();

    return successAndBody(result.docs.map((x) => x.data()));
};
