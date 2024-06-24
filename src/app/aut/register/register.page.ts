import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, NavController } from '@ionic/angular';
import { environment } from '../../../environments/environment'; // Sesuaikan jalur ini dengan struktur proyek Anda

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  nama: string = '';
  email: string = '';
  password: string = '';
  contact: string = '';

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private navController: NavController // Inject NavController
  ) { }

  async register() {
    if (!this.nama || !this.email || !this.password || !this.contact) {
      const alert = await this.alertController.create({
        header: 'Registration Gagal',
        message: 'Silahkan masukan dengan benar.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const data = {
      name: this.nama,
      contact: this.contact,
      email: this.email,
      password: this.password
    };

    const url = `${environment.apiUrl}/register`;

    this.http.post(url, data).subscribe(
      async (response) => {
        const alert = await this.alertController.create({
          header: 'Registrasi Berhasil',
          message: 'Registrasi anda berhasil silahkan login!',
          buttons: ['OK']
        });
        await alert.present();

        // Navigate to login page after registration success
        this.navController.navigateRoot('/login');
      },
      async (error) => {
        let message = 'There was an error during registration. Please try again.';
        if (error.status === 400 && error.error) {
          message = error.error.message || message;
        }

        const alert = await this.alertController.create({
          header: 'Registration Failed',
          message,
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

  togglePasswordVisibility(passwordInput: any) {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }
}
