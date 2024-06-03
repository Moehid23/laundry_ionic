import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginData = {
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    this.http.post<any>('http://127.0.0.1:8000/api/login', this.loginData)
      .subscribe(
        (response) => {
          console.log('Login successful', response);
          localStorage.setItem('access_token', response.access_token);
          this.router.navigateByUrl('/homepage');
        },
        (error) => {
          console.error('Login failed', error);
          // Tampilkan pesan kesalahan kepada pengguna
        }
      );
  }
}
