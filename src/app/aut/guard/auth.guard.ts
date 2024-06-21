// src/app/aut/guard/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        // Implementasi logika pengecekan autentikasi disini
        const isLoggedIn = localStorage.getItem('access_token') !== null;

        if (isLoggedIn) {
            // Jika autentikasi valid, izinkan navigasi
            return true;
        } else {
            // Jika tidak autentikasi, redirect ke halaman login
            this.router.navigate(['/login']);
            return false;
        }
    }
}
