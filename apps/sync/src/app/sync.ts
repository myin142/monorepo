import { DynamoDB } from 'aws-sdk';
import * as minimist from 'minimist';
import * as fs from 'fs';
import _ from 'lodash';
import { isKanji } from './japanese-utils';

let maxBatch = 25;
const options = { region: 'eu-central-1' };
const argv = minimist(process.argv.slice(2));
if (argv['endpoint']) {
    options['endpoint'] = argv.endpoint;
    maxBatch = 10;
}
const dynamo = new DynamoDB(options);
const KANJI_ATTRIBUTES_TABLE = 'KanjiAttributes';

export async function syncKanjiAttributes(file) {
    const buffer = fs.readFileSync(file);
    const counts = {
        total: 0,
        grades: {},
        jlpt: {},
        frequencyMax: 0,
    };

    const data = JSON.parse(buffer.toString())
        .filter(({ kanji }) => isKanji(kanji))
        .map(({ kanji, grade, frequency, jlpt }) => {
            const Update = {
                TableName: KANJI_ATTRIBUTES_TABLE,
                Key: { kanji: { S: kanji } },
            };
            const expressions = [];
            const attributes = {};

            if (grade != null) {
                expressions.push('grade = :g');
                attributes[':g'] = { N: `${grade}` };

                if (!counts.grades[grade]) counts.grades[grade] = 0;
                counts.grades[grade]++;
            }
            if (frequency != null) {
                expressions.push('frequency = :f');
                attributes[':f'] = { N: `${frequency}` };

                if (frequency > counts.frequencyMax) {
                    counts.frequencyMax = frequency;
                }
            }
            if (jlpt != null) {
                expressions.push('jlpt = :j');
                attributes[':j'] = { N: `${jlpt}` };

                if (!counts.jlpt[jlpt]) counts.jlpt[jlpt] = 0;
                counts.jlpt[jlpt]++;
            }

            counts.total++;
            if (expressions.length > 0) {
                const updateExp = `set ${expressions.join(',')}`;

                Update['UpdateExpression'] = updateExp;
                Update['ExpressionAttributeValues'] = attributes;
                return { Update };
            } else {
                return null;
            }
        })
        .filter((x) => !!x);

    console.log(counts);
    await dynamo
        .updateItem({
            Key: { kanji: { S: '@' } },
            TableName: KANJI_ATTRIBUTES_TABLE,
            UpdateExpression: `set counts = :counts`,
            ExpressionAttributeValues: {
                ':counts': { S: JSON.stringify(counts) },
            },
        })
        .promise();

    _.chunk(data, maxBatch).forEach(async (chunk) => {
        await dynamo
            .transactWriteItems({
                TransactItems: chunk,
            })
            .promise();
    });
}
