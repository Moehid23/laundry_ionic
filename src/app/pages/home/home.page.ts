import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { environment } from '../../../environments/environment';

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

  constructor(private http: HttpClient, private navCtrl: NavController) { }

  ngOnInit() {
    this.loadUserName();
    this.loadData();
  }

  // Memuat nama pengguna dari localStorage
  loadUserName() {
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName !== null) {
      this.userName = storedUserName;
    }
  }

  // Memuat data layanan dari API
  loadData() {
    const token = localStorage.getItem('login_token');  // Pastikan nama token sesuai dengan yang disimpan saat login
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/services`;

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

  // Navigasi gambar ke gambar sebelumnya
  previousImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1;
    }
    console.log('Previous image:', this.currentIndex);
  }

  // Navigasi gambar ke gambar berikutnya
  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    console.log('Next image:', this.currentIndex);
  }

  // Navigasi ke halaman tarif
  navigateToTarif() {
    this.navCtrl.navigateBack('/tarif');
  }

  // Placeholder untuk navigasi ke halaman voucher
  navigateToVoucher() {
    // Redirect or navigate to the desired page for Voucher
    // Example: this.navCtrl.navigateForward('/voucher');
  }

  // Navigasi kembali ke halaman beranda
  navigateToHomePage() {
    this.navCtrl.navigateBack('/homepage');
  }
}
