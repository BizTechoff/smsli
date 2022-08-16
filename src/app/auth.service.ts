import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Remult } from 'remult';
import { terms } from './terms';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loadedFromStorage = false
    constructor(private remult: Remult, public router: Router) {
        const token = AuthService.fromStorage();
        if (token) {
            this.loadedFromStorage = true
            this.setAuthToken(token);
        }
    }

    setAuthToken(token: string | null, rememberOnThisDevice = false) {
        if (token) {
            this.remult.setUser(new JwtHelperService().decodeToken(token));
            sessionStorage.setItem(AUTH_TOKEN_KEY, token);
            if (rememberOnThisDevice) {
                localStorage.setItem(AUTH_TOKEN_KEY, token);
            }
            this.nivaigateToDefaultUserPage()

        }
        else {
            this.remult.setUser(undefined!);
            sessionStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_TOKEN_KEY);
        }
    }

    static fromStorage(): string {
        return sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY)!;
    }

    nivaigateToDefaultUserPage() {
        // this.router.navigateByUrl(terms.send)
        if (this.remult.user.isAdmin) {
            // this.router.navigateByUrl(terms.smsim)
        }
    }
}

const AUTH_TOKEN_KEY = "smsli-authToken";
