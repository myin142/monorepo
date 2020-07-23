import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { AuthService, auth } from '@myin/shared/authentication';

@NgModule({
    declarations: [AppComponent, LoginComponent],
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
                    path: 'login',
                    component: LoginComponent,
                },
                {
                    path: 'radicals',
                    loadChildren: () =>
                        import('./radicals/radicals.module').then((m) => m.RadicalsModule),
                    canActivate: [AuthGuard],
                },
            ],
            { initialNavigation: 'enabled' }
        ),
    ],
    providers: [{ provide: AuthService, useValue: auth }],
    bootstrap: [AppComponent],
})
export class AppModule {}
