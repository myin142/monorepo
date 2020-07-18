import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Page, PageRequest } from '@myin/utils/shared';
import { Radical } from '@myin/api/japanese';
import { FormControl } from '@angular/forms';
import { RadicalService } from '../../services/radical.service';
import { PageEvent } from '@angular/material/paginator';

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

    updatePage({ pageIndex, pageSize }: PageEvent): void {
        const req: PageRequest = { page: pageIndex, pageSize };
        this.radicalService.getRadicals(req).then((r) => (this.radicals = r));
    }

    closeEdit(): void {
        this.editIndex = null;
        this.editTagControl.reset();
    }

    private tagsToArray(tags: string): string[] {
        return tags.split(',').map((x) => x.trim());
    }
}
