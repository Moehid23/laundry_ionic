import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, ToastController } from '@ionic/angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  resiNumber: string = '';
  resiData: any[] = []; // Data untuk menyimpan informasi resi
  userName: string = ''; // Nama pengguna
  customerData: any = {}; // Data pelanggan
  latestResiData: any = null; // Data status resi terbaru

  images = [
    '../../assets/1.jpg',
    '../../assets/2.jpg',
    '../../assets/3.jpg'
  ];
  currentIndex = 0;

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) { }

  ionViewWillEnter() {
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

      this.http.get<any>(url, { headers }).subscribe(
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

  async checkResi() {
    if (!this.resiNumber.trim()) {
      this.presentToast('Masukkan nomor resi terlebih dahulu');
      return;
    }

    const token = localStorage.getItem('login_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/resi/${this.resiNumber}`;

      this.http.get<any>(url, { headers }).subscribe(
        (response) => {
          console.log('Resi Data:', response);
          this.resiData = response.data; // Asumsi respons API memiliki properti data
          this.latestResiData = this.getLatestResiData(response.data); // Ambil data status terbaru
        },
        (error) => {
          console.error('Failed to fetch resi data', error);
          this.presentToast('Nomor resi tidak ditemukan atau terjadi kesalahan');
        }
      );
    } else {
      console.error('Token not found in localStorage');
      this.presentToast('Anda perlu login untuk melanjutkan');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
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

  getLatestResiData(data: any[]): any {
    if (!data || data.length === 0) {
      return null;
    }

    // Sorting data berdasarkan changed_at dari yang terbaru
    data.sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime());

    // Mengembalikan data dengan transaksi_id paling baru
    return data[0];
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }
}
