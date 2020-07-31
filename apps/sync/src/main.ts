import { DynamoDB } from 'aws-sdk';
import { syncKanjiAttributes } from './app/sync';
import * as minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
let maxBatch = 25;
const options = { region: 'eu-central-1' };
if (argv['endpoint']) {
    options['endpoint'] = argv.endpoint;
    maxBatch = 10;
}
const dynamo = new DynamoDB(options);

const files = argv['_'];
if (files.length > 0) {
    syncKanjiAttributes(files[0], dynamo, maxBatch);
} else {
    console.log('Missing file');
}
