import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js'; // Import CryptoJS

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  resiNumber = '';
  resiData: any[] = [];
  userName = '';
  customerData: any = {};
  latestResiData: any = null;
  private storage: Storage | null = null;
  loading: any;
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
    private loadingController: LoadingController,
    private storageService: Storage
  ) { }

  ngOnInit() {
    this.initStorage().then(() => {
      this.loadUserName();
      this.loadCustomerData(); // Mengubah ke loadCustomerData untuk konsistensi
    }).finally(() => {
      this.dismissLoading();
    });
  }

  async initStorage() {
    try {
      this.storage = await this.storageService.create();
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  loadUserName() {
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName) {
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

  async fetchCustomerData() {
    try {
      let encryptedToken = localStorage.getItem('access_token');
      if (!encryptedToken) {
        console.error('Token not found in localStorage');
        this.navCtrl.navigateBack('/login');
        return;
      }

      // Decrypt token before using it
      let token = this.decryptToken(encryptedToken);

      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/customer`;

      const response = await this.http.get<any>(url, { headers }).toPromise();
      this.customerData = response.data;
      localStorage.setItem('customer_id', response.data.id);
      await this.storage?.set('customerData', response.data);
    } catch (error) {
      console.error('Failed to fetch customer data', error);
      this.presentToast('Failed to fetch customer data');
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const url = `${environment.apiUrl}/refresh`;
      const response = await this.http.post<any>(url, { refresh_token: refreshToken }).toPromise();

      if (response.access_token && response.refresh_token) {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        return response.access_token;
      } else {
        throw new Error('Invalid response from refresh endpoint');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.navCtrl.navigateBack('/login');
      return null;
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'circles',
      translucent: true,
      cssClass: 'custom-loading'
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
      message,
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

    return data.reduce((prev, current) => (new Date(prev.changed_at) > new Date(current.changed_at)) ? prev : current);
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleDateString();
  }

  decryptToken(encryptedToken: string): string {
    return CryptoJS.AES.decrypt(encryptedToken, 'secret_key').toString(CryptoJS.enc.Utf8);
  }

  previousImage() {
    this.currentIndex = (this.currentIndex + this.images.length - 1) % this.images.length;
    console.log('Previous image:', this.currentIndex);
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    console.log('Next image:', this.currentIndex);
  }

  async checkResi() {
    if (!this.resiNumber.trim()) {
      this.presentToast('Masukkan nomor resi terlebih dahulu');
      return;
    }

    await this.presentLoading();

    this.storage?.get(`resiData_${this.resiNumber}`).then(data => {
      if (data) {
        this.resiData = data;
        this.latestResiData = this.getLatestResiData(data);
      } else {
        this.fetchResiData();
      }
    }).finally(() => {
      this.dismissLoading();
    });
  }

  fetchResiData() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token not found in localStorage');
      this.presentToast('Anda perlu login untuk melanjutkan');
      this.dismissLoading();
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const url = `${environment.apiUrl}/resi/${this.resiNumber}`;

    this.http.get<any>(url, { headers }).subscribe(
      (response) => {
        this.resiData = response.data;
        this.latestResiData = this.getLatestResiData(response.data);
        this.storage?.set(`resiData_${this.resiNumber}`, response.data);
      },
      (error) => {
        console.error('Failed to fetch resi data', error);
        this.presentToast('Nomor resi tidak ditemukan atau terjadi kesalahan');
      },
      () => {
        this.dismissLoading();
      }
    );
  }
}
