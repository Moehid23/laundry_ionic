import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
    this.http.post<any>('https://fahrul.webframework.my.id/api/login', this.loginData)
      .subscribe(
        async (response) => {
          console.log('Login successful', response);
          localStorage.setItem('access_token', response.data.token);
          localStorage.setItem('user_name', response.data.user.name); // Simpan nama pengguna ke LocalStorage
          await this.showToast('Login berhasil!', 'success');
          this.router.navigateByUrl('/homepage');
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
      position: 'top' // Menentukan posisi toast di tengah layar
    });
    await toast.present();
  }

  togglePasswordVisibility() {
    console.log('Toggle password visibility');
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    console.log('New passwordFieldType:', this.passwordFieldType);
  }

  // Define the registerWithGoogle method
  registerWithGoogle() {
    // Add your code to handle Google registration here
    console.log('Registering with Google');
  }
}
