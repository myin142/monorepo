import { Component, Input, OnInit } from '@angular/core';
import { Page } from '@myin/utils/shared';
import { Radical } from '@myin/japanese-api';

@Component({
    selector: 'myin-radical-table',
    templateUrl: './radical-table.component.html',
    styleUrls: ['./radical-table.component.css'],
})
export class RadicalTableComponent implements OnInit {
    @Input() radicals: Page<Radical[]>;
    @Input() columns = ['radical', 'tags'];

    constructor() { }

    ngOnInit(): void { }

    getRadical({ radical }: Radical): string {
        return radical;
    }

    getTags({ tags }: Radical): string {
        return tags.join(', ');
    }
}
