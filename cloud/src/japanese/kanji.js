const { DynamoDB } = require('aws-sdk');
const _ = require('lodash');

const options = { region: 'eu-central-1' };
if (process.env.AWS_SAM_LOCAL) {
    options.endpoint = 'http://localhost:8000';
}
const dynamo = new DynamoDB(options);
console.log(options);

// TODO: share
const KANJI_ATTRIBUTES_TABLE = 'KanjiAttributes';

// TODO: share
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

exports.createKanjiReport = async (event) => {
    console.log(event);
    const kanjis = event.body.split('');

    const counts = {
        total: kanjis.length,
        grades: {},
        jlpt: {},
        frequencies: [],
    };

    await Promise.all(_.chunk(kanjis, 100).map(async chunk => {
        const response = await dynamo.batchGetItem({
            RequestItems: {
                [KANJI_ATTRIBUTES_TABLE]: {
                    Keys: chunk.map(k => ({ kanji: { S: k } })),
                },
            },
        }).promise();

        response.Responses[KANJI_ATTRIBUTES_TABLE].forEach(item => {
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
    }));

    return successAndBody(counts);
}
