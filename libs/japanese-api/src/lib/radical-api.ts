import { apiRequest } from './japanese-api';
import { Page, PageRequest, Query } from '@myin/utils/shared';

export const updateRadical = (radical: Radical): Promise<void> => {
    return apiRequest({ url: 'radical', method: 'POST', data: radical });
};

export const getRadicals = (req: PageRequest): Promise<Page<Radical>> => {
    return apiRequest({ url: `radical?${Query.create(req)}`, method: 'GET' });
};

export interface Radical {
    radical: string;
    stroke: number;
    tags: string[];
}
