import { Stage, ApiSetup } from './api-shared';
import axios, { AxiosRequestConfig } from 'axios';
import { Path } from '@myin/shared/utils';

export class ApiClient {
    private tokenFn: () => string;
    private baseURL: string;

    constructor({ baseURL, stage = Stage.LOCAL, tokenFn }: ApiSetup) {
        this.baseURL = this.createApiUrl(baseURL, stage);
        this.tokenFn = tokenFn;
    }

    private createApiUrl(url: string, stage: Stage): string {
        stage = stage || Stage.LOCAL;

        if (stage.startsWith('http://')) {
            url = stage;
        } else {
            url = Path.join(url, stage);
        }

        return url;
    }

    async get<T>(url: string): Promise<T> {
        return this.request({ url, method: 'GET' });
    }

    async post<T, R>(url: string, data: T = null): Promise<R> {
        return this.request({ url, method: 'POST', data });
    }

    private async request<T>(req: AxiosRequestConfig): Promise<T> {
        req.baseURL = this.baseURL;

        // Interceptors too difficult to test
        if (this.tokenFn && this.tokenFn()) {
            if (!req.headers) req.headers = {};
            req.headers.Authorization = this.tokenFn();
        }

        const response = await axios.request(req);
        return response.data;
    }
}
