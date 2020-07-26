import { DynamoDB } from 'aws-sdk';
import { BatchGetItemOutput, GetItemOutput } from 'aws-sdk/clients/dynamodb';
import {
    toAWSAttributeMapArray,
    toAWSAttributeMap,
    mockAWSResponsePromise,
} from '@myin/shared/aws';
import { createKanjiReport, getAllKanjiStats } from './kanji-report';
import { kanjiAttributes, kanjiReport } from '@myin/japanese/interface';
import { sign } from 'jsonwebtoken';

jest.mock('aws-sdk');

describe('Kanji Report', () => {
    describe('Create Kanji Report', () => {
        let headers: object;
        const mockDateNum = 100;

        beforeEach(() => {
            DynamoDB.prototype.batchGetItem = jest.fn(() =>
                mockAWSResponsePromise({
                    Responses: { [kanjiAttributes.table]: [] },
                })
            );

            global.Date.now = jest.fn(() => mockDateNum);
            headers = {
                Authorization: `Bearer ${sign({ sub: 'USER' }, 'SECRET')}`,
            };
        });

        it('save kanji counts', async () => {
            DynamoDB.prototype.putItem = jest.fn(() => mockAWSResponsePromise({}));
            DynamoDB.prototype.batchGetItem = jest.fn(() =>
                mockAWSResponsePromise<BatchGetItemOutput>({
                    Responses: {
                        [kanjiAttributes.table]: toAWSAttributeMapArray([
                            { grade: 1, jlpt: 3, frequency: 100 },
                            { grade: 2, jlpt: 3, frequency: 10 },
                            { grade: 2, jlpt: 3, frequency: 5 },
                            { grade: 1, jlpt: 4, frequency: 25 },
                        ]),
                    },
                })
            );

            const { statusCode } = await createKanjiReport({ body: '日本語', headers });
            expect(statusCode).toEqual(200);

            expect(DynamoDB.prototype.putItem).toHaveBeenCalledWith({
                TableName: kanjiReport.table,
                Item: expect.objectContaining(
                    toAWSAttributeMap({
                        [kanjiReport.key]: 'USER',
                        [kanjiReport.sort]: mockDateNum,
                        counts: JSON.stringify({
                            total: 3,
                            grades: { [1]: 2, [2]: 2 },
                            jlpt: { [4]: 1, [3]: 3 },
                        }),
                    })
                ),
            });
        });

        it('get items of kanjis', async () => {
            const { statusCode } = await createKanjiReport({
                body: 'Japanese - 日本語',
                headers,
            });
            expect(statusCode).toEqual(200);
            expect(DynamoDB.prototype.batchGetItem).toHaveBeenCalledWith({
                RequestItems: {
                    [kanjiAttributes.table]: expect.objectContaining({
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
            const { statusCode } = await createKanjiReport({ headers });
            expect(statusCode).not.toEqual(200);
        });

        it('fail on invalid body', async () => {
            const { statusCode } = await createKanjiReport({ body: {}, headers });
            expect(statusCode).not.toEqual(200);
        });

        it('fail on missing token', async () => {
            const { statusCode } = await createKanjiReport({ body: '一', headers: {} });
            expect(statusCode).not.toEqual(200);
        });

        it('fail on invalid token', async () => {
            const { statusCode } = await createKanjiReport({
                body: '一',
                headers: { Authorization: 'TOKEN' },
            });
            expect(statusCode).not.toEqual(200);
        });

        it('fail on empty kanjis', async () => {
            const { statusCode } = await createKanjiReport({ body: '', headers });
            expect(statusCode).not.toEqual(200);
        });
    });

    it('get all kanji stats', async () => {
        DynamoDB.prototype.getItem = jest.fn(() =>
            mockAWSResponsePromise<GetItemOutput>({
                Item: toAWSAttributeMap({ counts: '{"total": "200"}' }),
            })
        );

        const { statusCode, body } = await getAllKanjiStats();
        expect(statusCode).toEqual(200);
        expect(JSON.parse(body)).toEqual({ total: '200' });

        expect(DynamoDB.prototype.getItem).toHaveBeenCalledWith({
            TableName: kanjiAttributes.table,
            Key: toAWSAttributeMap({ kanji: '@' }),
        });
    });
});
