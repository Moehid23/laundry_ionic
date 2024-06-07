import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage implements OnInit {
  images = [
    '../../assets/1.jpg',
    'https://ionicframework.com/docs/img/demos/card-media.png',
    'https://ionicframework.com/docs/img/demos/card-media.png'
  ];
  currentIndex = 0;
  userName: string = ''; // Inisialisasi userName dengan string kosong
  services: any[] = []; // Tambahkan properti untuk menyimpan data dari API

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
    // Ambil nama pengguna dari LocalStorage saat halaman dimuat
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName !== null) {
      this.userName = storedUserName;
    }
  }

  loadData() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      this.http.get<any>('http://127.0.0.1:8000/api/services', { headers })
        .subscribe(
          (response) => {
            console.log('Data:', response);
            this.services = response.data; // Asumsikan response.data adalah array layanan
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
            localStorage.clear(); // Hapus semua data dari LocalStorage saat logout
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });

    await alert.present();
  }
}
