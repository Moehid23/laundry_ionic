import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage {
  images = [
    'https://ionicframework.com/docs/img/demos/card-media.png',
    'https://ionicframework.com/docs/img/demos/card-media.png',
    'https://ionicframework.com/docs/img/demos/card-media.png'
  ];
  currentIndex = 0;
  userName: string = ''; // Inisialisasi userName dengan string kosong

  constructor(private navCtrl: NavController, private alertController: AlertController) { }

  ionViewDidEnter() {
    // Ambil nama pengguna dari LocalStorage saat halaman dimuat
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName !== null) {
      this.userName = storedUserName;
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
      message: 'Apakah Anda yakin ingin keluar?',
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
