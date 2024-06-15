import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { environment } from '../../../environments/environment';

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

  login() {
    if (!this.loginData.email || !this.loginData.password) {
      this.showToast('Email dan password harus diisi', 'danger');
      return;
    }

    const url = `${environment.apiUrl}/login`;
    this.http.post<any>(url, this.loginData)
      .subscribe(
        async (response) => {
          console.log('Login successful', response);

          // Periksa keberadaan token di dalam response.data
          if (response && response.data && response.data.token) {
            localStorage.setItem('access_token', response.data.token);
            localStorage.setItem('user_name', response.data.name); // Simpan nama pengguna jika diperlukan
            await this.showToast('Login berhasil', 'success');
            this.router.navigateByUrl('/home'); // Redirect ke halaman home setelah login berhasil
          } else {
            console.error('Invalid API response format', response);
            await this.showToast('Login gagal. Format respons API tidak valid.', 'danger');
          }
        },
        async (error) => {
          console.error('Login failed', error);
          await this.showToast('Login gagal. Periksa kembali email dan password Anda.', 'danger');
        }
      );
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

  registerWithGoogle() {
    console.log('Registering with Google');
    // Implementasi registrasi dengan Google jika diperlukan
  }
}
