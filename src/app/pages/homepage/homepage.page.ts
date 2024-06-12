import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Import environment variable

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage implements OnInit {
  images = [
    '../../assets/1.jpg',
    '../../assets/2.jpg',
    '../../assets/3.jpg'
  ];
  currentIndex = 0;
  userName: string = '';
  services: any[] = [];

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.loadUserName();
    this.loadData();
  }

  loadUserName() {
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName !== null) {
      this.userName = storedUserName;
    }
  }

  loadData() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/services`; // Menggunakan URL dari environment variable

      this.http.get<any>(url, { headers })
        .subscribe(
          (response) => {
            console.log('Data:', response);
            this.services = response.data;
          },
          (error) => {
            console.error('Failed to fetch data', error);
          }
        );
    } else {
      console.error('Token not found in localStorage');
    }
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    console.log('Next image:', this.currentIndex);
  }

  previousImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    console.log('Previous image:', this.currentIndex);
  }

  async onDoorIconClick() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar Akun?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          handler: () => {
            console.log('Logout dibatalkan');
          }
        },
        {
          text: 'Ya',
          handler: () => {
            console.log('Logout dilakukan');
            localStorage.clear();
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });

    await alert.present();
  }

  navigateToRiwayat() {
    const customerId = localStorage.getItem('customer_id');
    if (customerId) {
      this.navCtrl.navigateForward(`/riwayat/${customerId}`);
    } else {
      console.error('Customer ID not found');
    }
  }
}
