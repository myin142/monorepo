import { Component, Input, OnInit } from '@angular/core';
import { Radical } from '@myin/japanese-api';
import { Page } from '@myin/utils/shared';

@Component({
    selector: 'myin-radical-table',
    templateUrl: './radical-table.component.html',
    styleUrls: ['./radical-table.component.css'],
})
export class RadicalTableComponent implements OnInit {
    @Input() radicals: Page<Radical>;
    @Input() columns = ['radical', 'tags'];

    constructor() {}

    ngOnInit(): void {}

    getRadical({ radical }: Radical): string {
        return radical;
    }

    getTags({ tags }: Radical): string {
        return tags.join(', ');
    }
}
