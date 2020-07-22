import { successAndBody, statusAndBody } from '../lib/api-gateway';

describe('ApiGateway', () => {
    describe('Status Body', () => {
        it('contain status code', () => {
            expect(statusAndBody(401, {})).toEqual(
                expect.objectContaining({
                    statusCode: 401,
                })
            );
        });

        it('contain body string', () => {
            expect(statusAndBody(200, { data: 'Data' })).toEqual(
                expect.objectContaining({
                    body: JSON.stringify({ data: 'Data' }),
                })
            );
        });

        it('success and body status 200', () => {
            expect(successAndBody({})).toEqual(
                expect.objectContaining({
                    statusCode: 200,
                })
            );
        });
    });
});
