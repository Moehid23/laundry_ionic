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
  userName: string = ''; // Nama pengguna
  customerData: any = {}; // Data pelanggan

  constructor(private http: HttpClient, private navCtrl: NavController) { }

  ngOnInit() {
    this.loadUserName(); // Memuat nama pengguna dari localStorage
    this.loadCustomerData(); // Memuat data pelanggan dari API
  }

  loadUserName() {
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName !== null) {
      this.userName = storedUserName;
    }
  }

  loadCustomerData() {
    const token = localStorage.getItem('login_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/customer`;

      this.http.get<any>(url, { headers })
        .subscribe(
          (response) => {
            console.log('Customer Data:', response);
            this.customerData = response.data; // Asumsi respons API memiliki properti data
            localStorage.setItem('customer_id', response.data.id); // Simpan customer ID di localStorage
          },
          (error) => {
            console.error('Failed to fetch customer data', error);
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
    this.navCtrl.navigateBack('/voucher');
  }

  navigateToHomePage() {
    this.navCtrl.navigateBack('/homepage');
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
