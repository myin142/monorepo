import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadicalsComponent } from './radicals.component';
import { RadicalTableComponent } from './radical-table/radical-table.component';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [RadicalsComponent, RadicalTableComponent],
    imports: [
        CommonModule,
        MatTableModule,
        RouterModule.forChild([{ path: '', component: RadicalsComponent }]),
    ],
})
export class RadicalsModule { }
