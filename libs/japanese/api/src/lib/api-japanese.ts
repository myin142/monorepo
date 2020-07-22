import { ApiClient, Stage } from '@myin/shared/api';
import { Radical } from './api-radical';
import { Page, PageRequest, Query } from '@myin/shared/utils';
import { AllKanjiStats, KanjiReportCounts } from '@myin/japanese/interface';

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

    getAllKanjiStats(): Promise<AllKanjiStats> {
        return this.client.get(`/kanji/report`);
    }

    createKanjiReport(file: File): Promise<KanjiReportCounts> {
        return this.client.post(`/kanji/report`, file);
    }
}
