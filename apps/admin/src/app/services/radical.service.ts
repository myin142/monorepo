import { Injectable } from '@angular/core';
import { Radical, JapaneseApiClient } from '@myin/japanese/api';
import { Page, PageRequest } from '@myin/shared/utils';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class RadicalService {
    private japaneseClient: JapaneseApiClient;

    constructor(private auth: AuthService) {
        this.japaneseClient = new JapaneseApiClient(environment.stage, () => this.auth.getToken());
    }

    getRadicals(req?: PageRequest): Promise<Page<Radical>> {
        return this.japaneseClient.getRadicals(req);
    }

    updateRadical(radical: Radical): Promise<void> {
        return this.japaneseClient.updateRadical(radical);
    }
}
