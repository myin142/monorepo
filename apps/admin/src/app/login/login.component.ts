import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@myin/shared/authentication';

@Component({
    selector: 'myin-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    constructor(public auth: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.auth.handleAuthCallback(window.location.href);
        if (this.auth.isAuthenticated()) {
            this.router.navigate(['/']);
        }
    }
}
