import { ApiClient, Stage } from '@myin/shared/api';
import { Radical } from './api-radical';
import { Page, PageRequest, Query } from '@myin/shared/utils';
import { AllKanjiStats, KanjiReport, KanjiRadical } from '@myin/japanese/interface';

const API_URL = 'https://312b71jv54.execute-api.eu-central-1.amazonaws.com';

export class JapaneseService {
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

    getKanjisForRadical(radical: string): Promise<KanjiRadical> {
        return this.client.get(`/radical/kanjis?radical=${radical}`);
    }

    getAllKanjiStats(): Promise<AllKanjiStats> {
        return this.client.get(`/kanji/attributes`);
    }

    createKanjiReport(file: File): Promise<KanjiReport> {
        return this.client.post(`/kanji/report`, file);
    }

    getKanjiReports(): Promise<KanjiReport[]> {
        return this.client.get(`/kanji/report`);
    }
}
