import { Injectable } from '@angular/core';
import { getRadicals, Radical, updateRadical } from '@myin/japanese-api';
import { Page } from '@myin/utils/shared';

@Injectable({
    providedIn: 'root',
})
export class RadicalService {
    constructor() {}

    getRadicals(): Promise<Page<Radical>> {
        return getRadicals();
    }

    updateRadical(radical: Radical): Promise<void> {
        return updateRadical(radical);
    }
}
