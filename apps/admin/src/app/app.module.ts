import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(
            [
                {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'radicals',
                },
                {
                    path: 'radicals',
                    loadChildren: () =>
                        import('./radicals/radicals.module').then(
                            (m) => m.RadicalsModule
                        ),
                },
            ],
            { initialNavigation: 'enabled' }
        ),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
