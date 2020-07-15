import { Injectable } from '@angular/core';
import { getRadicals, Radical, updateRadical } from '@myin/japanese-api';
import { Page, PageRequest } from '@myin/utils/shared';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class RadicalService {
    constructor(private auth: AuthService) {}

    getRadicals(req?: PageRequest): Promise<Page<Radical>> {
        return getRadicals(req, environment.stage, this.auth.getToken());
    }

    updateRadical(radical: Radical): Promise<void> {
        return updateRadical(radical, environment.stage, this.auth.getToken());
    }
}
