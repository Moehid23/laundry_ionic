import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular'; // Import NavController

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  images = [
    '../../assets/1.jpg',
    '../../assets/2.jpg',
    '../../assets/3.jpg'
  ];
  currentIndex = 0;
  userName: string = '';
  services: any[] = [];

  constructor(private http: HttpClient, private navCtrl: NavController) { } // Inject NavController

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

      this.http.get<any>('https://fahrul.webframework.my.id/api/services', { headers })
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

  previousImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1;
    }
    console.log('Previous image:', this.currentIndex);
  }

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    console.log('Next image:', this.currentIndex);
  }

  navigateToTarif() {
    this.navCtrl.navigateBack('/tarif');
  }

  navigateToVoucher() {
    // Redirect or navigate to the desired page for Voucher
    // Example: this.navCtrl.navigateForward('/voucher');
  }

  navigateToHomePage() {
    this.navCtrl.navigateBack('/homepage'); // Menavigasi kembali ke halaman beranda
  }
}
