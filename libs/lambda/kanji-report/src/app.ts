import { DynamoDB } from 'aws-sdk';
import { chunk } from 'lodash';
import { successAndBody, statusAndError } from '../../../utils/api-gateway/src/index';
import { extractKanjis } from '../../../utils/japanese/src/index';

// ^^^ Importing using tsconfig paths not working
// https://github.com/aws/jsii/issues/865

const options = { region: 'eu-central-1' };
if (process.env.AWS_SAM_LOCAL) {
    options['endpoint'] = 'http://localhost:8000';
}
const dynamo = new DynamoDB(options);

// TODO: share
const KANJI_ATTRIBUTES_TABLE = 'KanjiAttributes';
const MAX_KANJIS = 12723;

export const createKanjiReport = async (event, context) => {
    if (typeof event.body != 'string') return statusAndError(400, 'Invalid body type');
    if (event.body.length > MAX_KANJIS) return statusAndError(400, 'Invalid upload');

    const kanjis = extractKanjis(event.body);

    const counts = {
        total: kanjis.length,
        grades: {},
        jlpt: {},
        frequencies: [],
    };

    await Promise.all(
        chunk(kanjis, 100).map(async (chunk) => {
            const response = await dynamo
                .batchGetItem({
                    RequestItems: {
                        [KANJI_ATTRIBUTES_TABLE]: {
                            Keys: chunk.map((k) => ({ kanji: { S: k } })),
                        },
                    },
                })
                .promise();

            response.Responses[KANJI_ATTRIBUTES_TABLE].forEach((item) => {
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
        })
    );

    return successAndBody(counts);
};
