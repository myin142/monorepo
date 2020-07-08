import { apiRequest } from './japanese-api';

// TODO: return value
export const createRadical = (radical: Radical): Promise<any> => {
    return apiRequest({ url: 'radical', method: 'POST', data: radical });
};

export const getRadicals = (): Promise<Radical> => {
    return apiRequest({ url: 'radical', method: 'GET' });
};

export interface Radical {
    radical: string;
    tags: string[];
}
