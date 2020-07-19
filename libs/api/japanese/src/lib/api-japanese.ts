import { ApiClient, Stage } from '@myin/api/shared';
import { Radical } from './api-radical';
import { Page, PageRequest, Query } from '@myin/utils/shared';

const API_URL = 'https://dkvrwmxe6l.execute-api.eu-central-1.amazonaws.com/';

export class JapaneseApiClient {
    private client: ApiClient;

    constructor(stage: Stage, tokenFn: () => string) {
        this.client = new ApiClient({ baseURL: API_URL, stage, tokenFn });
    }

    updateRadical(radical: Radical): Promise<void> {
        return this.client.post('/radical', radical);
    }

    getRadicals(req: PageRequest): Promise<Page<Radical>> {
        return this.client.get(`/radical?${Query.create(req)}`);
    }
}
