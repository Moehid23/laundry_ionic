import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
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
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    await this.initStorage();
    await this.presentLoading();
    this.loadUserName();
    await this.loadCustomerData();
    await this.dismissLoading();
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

  async fetchCustomerData() {
    try {
      let token = localStorage.getItem('access_token');
      if (!token) {
        token = await this.refreshToken();
      }

      if (token) {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const url = `${environment.apiUrl}/customer`;

        const response = await this.http.get<any>(url, { headers }).toPromise();
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

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return null;
    }

    const url = `${environment.apiUrl}/refresh`;
    try {
      const response = await this.http.post<any>(url, { refresh_token: refreshToken }).toPromise();
      if (response && response.access_token && response.refresh_token) {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        return response.access_token;
      } else {
        this.navCtrl.navigateBack('/login');
        return null;
      }
    } catch (error) {
      this.navCtrl.navigateBack('/login');
      return null;
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

    await this.presentLoading();

    this.storage?.get(`resiData_${this.resiNumber}`).then(data => {
      if (data) {
        this.resiData = data;
        this.latestResiData = this.getLatestResiData(data);
        this.dismissLoading();
      } else {
        this.fetchResiData();
      }
    });
  }

  fetchResiData() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/resi/${this.resiNumber}`;

      this.http.get<any>(url, { headers }).subscribe(
        (response) => {
          this.resiData = response.data;
          this.latestResiData = this.getLatestResiData(response.data);
          this.storage?.set(`resiData_${this.resiNumber}`, response.data);
          this.dismissLoading();
        },
        (error) => {
          console.error('Failed to fetch resi data', error);
          this.presentToast('Nomor resi tidak ditemukan atau terjadi kesalahan');
          this.dismissLoading();
        }
      );
    } else {
      console.error('Token not found in localStorage');
      this.presentToast('Anda perlu login untuk melanjutkan');
      this.dismissLoading();
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
