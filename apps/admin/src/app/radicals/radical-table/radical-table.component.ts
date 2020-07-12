import { Component, Input, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Page } from '@myin/utils/shared';
import { Radical } from '@myin/japanese-api';
import { FormControl } from '@angular/forms';
import { RadicalService } from '../../services/radical.service';

@Component({
    selector: 'myin-radical-table',
    templateUrl: './radical-table.component.html',
    styleUrls: ['./radical-table.component.css'],
})
export class RadicalTableComponent implements OnInit {
    @Input() radicals: Page<Radical>;
    @Input() columns = ['radical', 'tags', 'actions'];

    editIndex: number;
    editTagControl = new FormControl();

    constructor(private radicalService: RadicalService, private elemRef: ElementRef) {}

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
        this.elemRef.nativeElement.querySelector('input').focus();
    }

    async saveRadical(radical: Radical) {
        const tags = this.tagsToArray(this.editTagControl.value);
        await this.radicalService.updateRadical({
            ...radical,
            tags,
        });

        this.radicals.content[this.editIndex].tags = tags;
        this.closeEdit();
    }

    closeEdit(): void {
        this.editIndex = null;
        this.editTagControl.reset();
    }

    private tagsToArray(tags: string): string[] {
        return tags.split(',').map((x) => x.trim());
    }
}
