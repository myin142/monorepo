import { DynamoDB } from 'aws-sdk';
import { BatchGetItemOutput, GetItemOutput } from 'aws-sdk/clients/dynamodb';
import { toAWSAttributeMapArray, toAWSAttributeMap } from '@myin/shared/lambda';
import { emptyGatewayEvent, mockAWSResponsePromise } from '@myin/shared/tests';
import { createKanjiReport, getAllKanjiStats, getKanjiReports } from './kanji-report';
import { kanjiAttributes, kanjiReport } from '@myin/japanese/interface';
import { APIGatewayProxyEvent } from 'aws-lambda';

jest.mock('aws-sdk');

describe('Kanji Report', () => {
    describe('Create Kanji Report', () => {
        let event: APIGatewayProxyEvent;
        const mockDateNum = 100;

        beforeEach(() => {
            DynamoDB.prototype.batchGetItem = jest.fn(() =>
                mockAWSResponsePromise({
                    Responses: { [kanjiAttributes.table]: [] },
                })
            );

            global.Date.now = jest.fn(() => mockDateNum);
            event = emptyGatewayEvent({ sub: 'USER' });
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

            event.body = '日本\n語';
            const { statusCode } = await createKanjiReport(event);
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
                            vocabulary: 2,
                        }),
                    })
                ),
            });
        });

        it('get items of kanjis', async () => {
            event.body = 'Japanese - 日本語';
            const { statusCode } = await createKanjiReport(event);

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

        it('return report', async () => {
            DynamoDB.prototype.batchGetItem = jest.fn(() =>
                mockAWSResponsePromise<BatchGetItemOutput>({
                    Responses: {
                        [kanjiAttributes.table]: toAWSAttributeMapArray([
                            { grade: 1, jlpt: 3, frequency: 100 },
                            { grade: 2, jlpt: 2, frequency: 10 },
                            { grade: 2, jlpt: 3, frequency: 5 },
                        ]),
                    },
                })
            );

            event.body = '日\n本語';
            const { statusCode, body } = await createKanjiReport(event);

            expect(statusCode).toEqual(200);
            expect(JSON.parse(body)).toEqual({
                user: 'USER',
                created: mockDateNum,
                counts: {
                    total: 3,
                    grades: { [1]: 1, [2]: 2 },
                    jlpt: { [2]: 1, [3]: 2 },
                    vocabulary: 2,
                },
            });
        });

        it('fail on missing body', async () => {
            event.body = null;
            const { statusCode } = await createKanjiReport(event);
            expect(statusCode).not.toEqual(200);
        });

        it('fail on empty kanjis', async () => {
            event.body = '';
            const { statusCode } = await createKanjiReport(event);
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

    describe('Get Kanji Reports', () => {
        let ev: APIGatewayProxyEvent;

        beforeEach(() => {
            ev = emptyGatewayEvent({ sub: 'USER' });
        });

        it('get reports of user', async () => {
            DynamoDB.prototype.query = jest.fn(() =>
                mockAWSResponsePromise({
                    Items: [
                        {
                            [kanjiReport.key]: { S: 'USER' },
                            [kanjiReport.sort]: { N: '123' },
                            counts: { S: '{}' },
                        },
                    ],
                })
            );

            const { statusCode, body } = await getKanjiReports(ev);
            expect(statusCode).toEqual(200);
            expect(body).toEqual(
                JSON.stringify([
                    {
                        [kanjiReport.key]: 'USER',
                        [kanjiReport.sort]: 123,
                        counts: {},
                    },
                ])
            );
        });
    });
});
