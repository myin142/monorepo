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

const GRAMMAR_COLLECTION = 'grammar';

exports.createGrammarHandler = async (query, context) => {
    await initialFirebaseSetup();
    const body = query.body;
    console.log(body);

    const result = await admin.firestore().collection(GRAMMAR_COLLECTION).get();

    return {
        statusCode: 200,
        body: JSON.stringify(result.docs.map(x => x.data())),
    };
};
