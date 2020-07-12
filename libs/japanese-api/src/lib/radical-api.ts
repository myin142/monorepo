import { apiRequest } from './japanese-api';
import { Page } from '@myin/utils/shared';

export const updateRadical = (radical: Radical): Promise<void> => {
    return apiRequest({ url: 'radical', method: 'POST', data: radical });
};

export const getRadicals = (): Promise<Page<Radical>> => {
    return apiRequest({ url: 'radical', method: 'GET' });
};

export interface Radical {
    radical: string;
    tags: string[];
}
