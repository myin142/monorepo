import { RadicalService } from './../services/radical.service';
import { Component, OnInit } from '@angular/core';
import { Radical } from '@myin/japanese-api';
import { Page } from '@myin/utils/shared';

@Component({
    selector: 'myin-radicals',
    templateUrl: './radicals.component.html',
    styleUrls: ['./radicals.component.css'],
})
export class RadicalsComponent implements OnInit {
    radicals: Page<Radical>;

    constructor(private radicalService: RadicalService) {}

    ngOnInit(): void {
        this.radicalService.getRadicals().then((r) => {
            this.radicals = {
                content: r,
                page: 0,
                pageSize: 100,
            };
        });
    }
}
