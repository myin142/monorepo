import { Injectable } from '@angular/core';
import { getRadicals, Radical, updateRadical } from '@myin/japanese-api';
import { Page, PageRequest } from '@myin/utils/shared';

@Injectable({
    providedIn: 'root',
})
export class RadicalService {
    constructor() {}

    getRadicals(req?: PageRequest): Promise<Page<Radical>> {
        return getRadicals(req);
    }

    updateRadical(radical: Radical): Promise<void> {
        return updateRadical(radical);
    }
}
