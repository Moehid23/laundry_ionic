import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular'; // Import Ionic Storage
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

  private storage: Storage | null = null; // Ionic Storage instance

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    await this.initStorage(); // Initialize Ionic Storage
    this.loadUserName();
    this.loadData();
  }

  async initStorage() {
    this.storage = await new Storage().create(); // Create Ionic Storage instance
  }

  loadUserName() {
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName !== null) {
      this.userName = storedUserName;
    }
  }

  loadData() {
    this.storage?.get('services').then(data => {
      if (data) {
        this.services = data;
      } else {
        this.fetchData();
      }
    });
  }

  fetchData() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/services`;

      this.http.get<any>(url, { headers })
        .subscribe(
          (response) => {
            console.log('Data:', response);
            this.services = response.data; // Set data to component
            this.storage?.set('services', response.data); // Save to storage
          },
          (error) => {
            console.error('Failed to fetch data', error);
            if (error.status === 401) {
              console.error('Unauthorized access, redirecting to login page');
              this.navCtrl.navigateRoot('/login');
            } else {
              this.presentErrorAlert('Failed to load services');
            }
          }
        );
    } else {
      console.error('Token not found in localStorage');
      this.navCtrl.navigateRoot('/login'); // Redirect ke halaman login jika token tidak ditemukan
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
            localStorage.clear(); // Clear localStorage saat logout
            this.navCtrl.navigateRoot('/login'); // Redirect ke halaman login
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
}
