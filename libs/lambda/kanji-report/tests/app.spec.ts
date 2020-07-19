import { DynamoDB } from 'aws-sdk';
import { createKanjiReport, getAllKanjiStats } from '../src/app';
import { KANJI_ATTRIBUTES_TABLE } from '@myin/shared/cloud';
import { mockAWSResponsePromise } from '@myin/shared/test-utils';
import { BatchGetItemOutput, GetItemOutput } from 'aws-sdk/clients/dynamodb';
import { toAWSAttributeMapArray, toAWSAttributeMap } from '@myin/utils/aws';
import { KanjiReportCounts } from '@myin/api/japanese';

jest.mock('aws-sdk');

describe('Kanji Report', () => {
    describe('Create Kanji Report', () => {
        beforeEach(() => {
            DynamoDB.prototype.batchGetItem = jest.fn(() =>
                mockAWSResponsePromise({
                    Responses: { [KANJI_ATTRIBUTES_TABLE]: [] },
                })
            );
        });

        it('count kanjis', async () => {
            DynamoDB.prototype.batchGetItem = jest.fn(() =>
                mockAWSResponsePromise<BatchGetItemOutput>({
                    Responses: {
                        [KANJI_ATTRIBUTES_TABLE]: toAWSAttributeMapArray([
                            { grade: 1, jlpt: 3, frequency: 100 },
                            { grade: 2, jlpt: 3, frequency: 10 },
                            { grade: 2, jlpt: 3, frequency: 5 },
                            { grade: 1, jlpt: 4, frequency: 25 },
                        ]),
                    },
                })
            );

            const { statusCode, body } = await createKanjiReport({ body: '日' });
            expect(statusCode).toEqual(200);

            const { grades, jlpt, frequencies } = JSON.parse(body) as KanjiReportCounts;
            expect(grades).toEqual({ [1]: 2, [2]: 2 });
            expect(jlpt).toEqual({ [4]: 1, [3]: 3 });
            expect(frequencies).toEqual(expect.arrayContaining([5, 25, 10, 100]));
        });

        it('get items of kanjis', async () => {
            const { statusCode } = await createKanjiReport({
                body: 'Japanese - 日本語',
            });
            expect(statusCode).toEqual(200);
            expect(DynamoDB.prototype.batchGetItem).toHaveBeenCalledWith({
                RequestItems: {
                    [KANJI_ATTRIBUTES_TABLE]: expect.objectContaining({
                        Keys: toAWSAttributeMapArray([
                            { kanji: '日' },
                            { kanji: '本' },
                            { kanji: '語' },
                        ]),
                    }),
                },
            });
        });

        it('fail on missing body', async () => {
            const { statusCode } = await createKanjiReport({});
            expect(statusCode).not.toEqual(200);
        });

        it('fail on invalid body', async () => {
            const { statusCode } = await createKanjiReport({ body: {} });
            expect(statusCode).not.toEqual(200);
        });

        it('fail on too large body', async () => {
            const { statusCode } = await createKanjiReport({ body: ' '.repeat(10000000) });
            expect(statusCode).not.toEqual(200);
        });
    });

    it('get all kanji stats', async () => {
        DynamoDB.prototype.getItem = jest.fn(() =>
            mockAWSResponsePromise<GetItemOutput>({
                Item: toAWSAttributeMap({ kanji: '@' }),
            })
        );

        const { statusCode, body } = await getAllKanjiStats({});
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toEqual({ kanji: '@' });

        expect(DynamoDB.prototype.getItem).toHaveBeenCalledWith({
            TableName: KANJI_ATTRIBUTES_TABLE,
            Key: toAWSAttributeMap({ kanji: '@' }),
        });
    });
});
