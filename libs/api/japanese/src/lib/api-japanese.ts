import axios, { AxiosRequestConfig } from 'axios';

const API_URL = 'https://dkvrwmxe6l.execute-api.eu-central-1.amazonaws.com/';

export enum Stage {
    PROD = 'Prod',
    STAGE = 'Stage',
    LOCAL = 'http://localhost:3000',
}

const apiUrl = (stage: Stage): string => {
    let url = API_URL;
    if (stage.startsWith('http://')) {
        url = stage;
    } else {
        url += stage;
    }

    return url;
};

export const apiRequest = async <T>(
    req: AxiosRequestConfig,
    stage = Stage.LOCAL,
    token?: string
): Promise<T> => {
    const request = {
        ...req,
        baseURL: apiUrl(stage),
    };

    // TODO: add token using interceptor
    if (token) {
        request.headers = {
            ...request.headers,
            Authorization: token,
        };
    }

    const response = await axios.request(request);

    return response.data;
};
