import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../../environments/environment';

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

  private storage: Storage | null = null;
  loading: any;

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private http: HttpClient,
    private loadingController: LoadingController,
    private storageService: Storage
  ) { }

  async ngOnInit() {
    await this.initStorage();
    await this.presentLoading('Loading services...');
    this.loadUserName();
    this.loadData();
    await this.dismissLoading();
  }

  async initStorage() {
    this.storage = await this.storageService.create();
  }

  loadUserName() {
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName) {
      this.userName = storedUserName;
    }
  }

  async loadData() {
    try {
      const data = await this.storage?.get('services');
      if (data) {
        this.services = data;
      } else {
        await this.fetchData();
      }
    } catch (error: any) { // Tambahkan tipe 'any' pada error
      console.error('Error loading data:', error);
      this.presentErrorAlert('Failed to load services');
    }
  }

  async fetchData() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token not found in localStorage');
      this.navCtrl.navigateRoot('/login');
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const url = `${environment.apiUrl}/services`;

    try {
      const response = await this.http.get<any>(url, { headers }).toPromise();
      console.log('Data:', response);
      this.services = response.data;
      await this.storage?.set('services', response.data);
    } catch (error: any) { // Tambahkan tipe 'any' pada error
      console.error('Failed to fetch data', error);
      if (error.status === 401) {
        console.error('Unauthorized access, redirecting to login page');
        this.navCtrl.navigateRoot('/login');
      } else {
        this.presentErrorAlert('Failed to load services');
      }
    }
  }

  async presentLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
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

  previousImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    console.log('Previous image:', this.currentIndex);
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    console.log('Next image:', this.currentIndex);
  }

  async onDoorIconClick() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Logout cancelled');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Logging out');
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

  async presentErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
