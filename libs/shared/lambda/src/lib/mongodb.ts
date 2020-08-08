import { SSM } from 'aws-sdk';
import * as mongodb from 'mongodb';

const ssm = new SSM();

export const RADICAL_TAG_COLLECTION = 'tags';
export const RADICAL_DATABASE = 'radical';

export let db: mongodb.Db;
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

export async function initMongoDB() {
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
