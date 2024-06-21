import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, ToastController, LoadingController } from '@ionic/angular'; // tambahkan LoadingController
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  resiNumber: string = '';
  resiData: any[] = [];
  userName: string = '';
  customerData: any = {};
  latestResiData: any = null;
  private storage: Storage | null = null;
  loading: any; // variabel untuk menyimpan objek loading

  images = [
    '../../assets/1.jpg',
    '../../assets/2.jpg',
    '../../assets/3.jpg'
  ];
  currentIndex = 0;

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingController: LoadingController // tambahkan LoadingController
  ) { }

  async ngOnInit() {
    await this.initStorage(); // Initialize Ionic Storage
    await this.presentLoading(); // tampilkan loading spinner saat memuat data
    this.loadUserName(); // Memuat nama pengguna dari localStorage
    await this.loadCustomerData(); // Memuat data pelanggan dari API
    await this.dismissLoading(); // tutup loading spinner setelah selesai memuat data
  }

  async initStorage() {
    this.storage = await new Storage().create();
  }

  loadUserName() {
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName !== null) {
      this.userName = storedUserName;
    }
  }

  async loadCustomerData() {
    try {
      const data = await this.storage?.get('customerData');
      if (data) {
        this.customerData = data;
        localStorage.setItem('customer_id', data.id);
      } else {
        await this.fetchCustomerData();
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
    }
  }

  // home.page.ts
  async fetchCustomerData() {
    try {
      const token = localStorage.getItem('access_token'); if (token) {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const url = `${environment.apiUrl}/customer`;

        const response = await this.http.get<any>(url, { headers }).toPromise();
        console.log('Customer Data:', response);
        this.customerData = response.data;
        localStorage.setItem('customer_id', response.data.id);
        await this.storage?.set('customerData', response.data);
      } else {
        console.error('Token not found');
      }
    } catch (error) {
      console.error('Failed to fetch customer data', error);
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

    await this.presentLoading(); // tampilkan loading spinner saat memuat data resi

    this.storage?.get(`resiData_${this.resiNumber}`).then(data => {
      if (data) {
        this.resiData = data;
        this.latestResiData = this.getLatestResiData(data);
        this.dismissLoading(); // tutup loading spinner setelah selesai memuat data resi
      } else {
        this.fetchResiData();
      }
    });
  }

  fetchResiData() {
    const token = localStorage.getItem('login_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/resi/${this.resiNumber}`;

      this.http.get<any>(url, { headers }).subscribe(
        (response) => {
          console.log('Resi Data:', response);
          this.resiData = response.data;
          this.latestResiData = this.getLatestResiData(response.data);
          this.storage?.set(`resiData_${this.resiNumber}`, response.data);
          this.dismissLoading(); // tutup loading spinner setelah selesai memuat data resi
        },
        (error) => {
          console.error('Failed to fetch resi data', error);
          this.presentToast('Nomor resi tidak ditemukan atau terjadi kesalahan');
          this.dismissLoading(); // tutup loading spinner jika terjadi error
        }
      );
    } else {
      console.error('Token not found in localStorage');
      this.presentToast('Anda perlu login untuk melanjutkan');
      this.dismissLoading(); // tutup loading spinner jika terjadi error
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...', // pesan yang akan ditampilkan pada loading spinner
      spinner: 'circles', // jenis spinner yang digunakan (bisa diganti dengan 'dots', 'lines', dll)
      translucent: true, // membuat background loading semi-transparan
      cssClass: 'custom-loading' // kustomisasi tambahan untuk loading spinner
    });
    await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
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

    data.sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime());

    return data[0];
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }

}
