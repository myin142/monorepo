import axios from 'axios';
import mockAxios from 'axios-mock-adapter';
import { ApiClient } from '../lib/api-client';
import { Stage } from '../lib/api-shared';

describe('ApiClient', () => {
    const mock = new mockAxios(axios);
    const getFirstReq = (type: string) => mock.history[type][0];

    beforeEach(() => {
        mock.onAny().reply(200);
    });

    afterEach(() => {
        mock.reset();
    });

    describe('Default Requests', () => {
        it('use token as authorization header', async () => {
            const client = new ApiClient({ baseURL: '', tokenFn: () => 'TOKEN' });
            await client.get('/');

            expect(getFirstReq('get').headers.Authorization).toEqual('TOKEN');
        });

        it('not use token if not defined', async () => {
            const client = new ApiClient({ baseURL: '' });
            await client.get('/');

            expect(getFirstReq('get').headers.Authorization).toBeFalsy();
        });

        it('not use token if empty', async () => {
            const client = new ApiClient({ baseURL: '', tokenFn: () => '' });
            await client.get('/');

            expect(getFirstReq('get').headers.Authorization).toBeFalsy();
        });

        it('use base url with stage as suffix', async () => {
            const client = new ApiClient({ baseURL: 'http://example.com', stage: Stage.PROD });
            await client.get('/');

            expect(getFirstReq('get').baseURL).toEqual(`http://example.com/${Stage.PROD}`);
        });

        it('use local stage full url', async () => {
            const client = new ApiClient({
                baseURL: 'http://example.com',
                stage: Stage.LOCAL,
            });
            await client.get('/');

            expect(getFirstReq('get').baseURL).toEqual(Stage.LOCAL);
        });
    });

    describe('Request Types', () => {
        let client: ApiClient;

        beforeEach(() => {
            client = new ApiClient({ baseURL: '' });
        });

        it('get request', async () => {
            await client.get('/');
            expect(getFirstReq('get')).toBeTruthy();
        });

        it('post request', async () => {
            await client.post('/', { data: 'Data' });
            expect(getFirstReq('post')).toBeTruthy();
            expect(getFirstReq('post').data).toEqual(JSON.stringify({ data: 'Data' }));
        });
    });
});
