import { Injectable } from '@angular/core';
import { getRadicals, Radical } from '@myin/japanese-api';
import { Page } from '@myin/utils/shared';

@Injectable({
    providedIn: 'root',
})
export class RadicalService {
    constructor() {}

    getRadicals(): Promise<Radical[]> {
        return getRadicals();
    }
}
