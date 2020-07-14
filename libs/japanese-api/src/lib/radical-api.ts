import { apiRequest, Stage } from './japanese-api';
import { Page, PageRequest, Query } from '@myin/utils/shared';

export const updateRadical = (
    radical: Radical,
    stage: Stage = Stage.LOCAL,
    token: string
): Promise<void> => {
    return apiRequest({ url: 'radical', method: 'POST', data: radical }, stage, token);
};

export const getRadicals = (
    req: PageRequest,
    stage: Stage = Stage.LOCAL,
    token: string
): Promise<Page<Radical>> => {
    return apiRequest({ url: `radical?${Query.create(req)}`, method: 'GET' }, stage, token);
};

export interface Radical {
    radical: string;
    stroke?: number;
    tags?: string[];
}
