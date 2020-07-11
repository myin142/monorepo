import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadicalsComponent } from './radicals.component';
import { RadicalTableComponent } from './radical-table/radical-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [RadicalsComponent, RadicalTableComponent],
    imports: [
        CommonModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        RouterModule.forChild([{ path: '', component: RadicalsComponent }]),
    ],
})
export class RadicalsModule {}
