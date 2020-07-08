import axios, { AxiosRequestConfig } from 'axios';

const API_URL = '';

export enum Stage {
    DEV = 'Dev',
    STAGE = 'Stage',
    LOCAL = 'http://localhost:3000',
}

export const apiUrl = (stage: Stage): string => {
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
    stage = Stage.LOCAL
): Promise<T> => {
    const response = await axios.request({
        ...req,
        baseURL: apiUrl(stage),
    });

    return response.data;
};
