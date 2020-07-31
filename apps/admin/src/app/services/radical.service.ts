import { Injectable } from '@angular/core';
import { Radical, JapaneseService } from '@myin/japanese/api';
import { Page, PageRequest } from '@myin/shared/utils';
import { environment } from '../../environments/environment';
import { AuthService } from '@myin/shared/authentication';

@Injectable({
    providedIn: 'root',
})
export class RadicalService {
    private japaneseClient: JapaneseService;

    constructor(private auth: AuthService) {
        this.japaneseClient = new JapaneseService(environment.stage, () => this.auth.getToken());
    }

    getRadicals(req?: PageRequest): Promise<Page<Radical>> {
        return this.japaneseClient.getRadicals(req);
    }

    updateRadical(radical: Radical): Promise<void> {
        return this.japaneseClient.updateRadical(radical);
    }
}
