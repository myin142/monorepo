import { Component, Input, OnInit } from '@angular/core';
import { Page } from '@myin/utils/shared';
import { Radical } from '@myin/japanese-api';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'myin-radical-table',
    templateUrl: './radical-table.component.html',
    styleUrls: ['./radical-table.component.css'],
})
export class RadicalTableComponent implements OnInit {
    @Input() radicals: Page<Radical[]>;
    @Input() columns = ['radical', 'tags', 'actions'];

    editIndex: number;
    editTagControl = new FormControl();

    constructor() {}

    ngOnInit(): void {}

    getRadical({ radical }: Radical): string {
        return radical;
    }

    getTags({ tags }: Radical): string {
        return tags.join(', ');
    }

    editMode(radical: Radical, index: number): void {
        this.editTagControl.setValue(this.getTags(radical));
        this.editIndex = index;
    }
}
