import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js'; // Import CryptoJS

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
  passwordFieldType: string = 'password';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController
  ) { }

  async login() {
    if (!this.loginData.email || !this.loginData.password) {
      this.showToast('Email dan password harus diisi', 'danger');
      return;
    }

    const url = `${environment.apiUrl}/login`;
    this.http.post<any>(url, this.loginData)
      .subscribe(
        async (response) => {
          if (response && response.access_token && response.refresh_token) {
            // Encrypt tokens before storing
            const encryptedAccessToken = this.encryptToken(response.access_token);
            const encryptedRefreshToken = this.encryptToken(response.refresh_token);

            localStorage.setItem('access_token', encryptedAccessToken);
            localStorage.setItem('refresh_token', encryptedRefreshToken);

            await this.showToast('Login berhasil', 'success');
            this.router.navigateByUrl('/home');
          } else {
            await this.showToast('Login gagal. Format respons API tidak valid.', 'danger');
          }
        },
        async (error) => {
          await this.showToast('Login gagal. Periksa kembali email dan password Anda.', 'danger');
        }
      );
  }

  encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token.trim(), 'secret_key').toString();
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
