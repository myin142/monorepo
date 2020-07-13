import { Injectable } from '@angular/core';
import { getRadicals, Radical, updateRadical } from '@myin/japanese-api';
import { Page, PageRequest } from '@myin/utils/shared';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class RadicalService {
    constructor() {}

    getRadicals(req?: PageRequest): Promise<Page<Radical>> {
        return getRadicals(req, environment.stage);
    }

    updateRadical(radical: Radical): Promise<void> {
        return updateRadical(radical, environment.stage);
    }
}
