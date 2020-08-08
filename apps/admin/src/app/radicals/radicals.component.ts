import { RadicalService } from './../services/radical.service';
import { Component, OnInit } from '@angular/core';
import { Radical } from '@myin/japanese/api';
import { Page } from '@myin/shared/utils';

@Component({
    selector: 'myin-radicals',
    templateUrl: './radicals.component.html',
})
export class RadicalsComponent implements OnInit {
    radicals: Promise<Page<Radical>>;

    constructor(private radicalService: RadicalService) { }

    ngOnInit(): void {
        this.radicals = this.radicalService.getRadicals({ page: 0, pageSize: 10 });
    }
}
