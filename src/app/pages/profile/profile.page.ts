import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../../environments/environment';
import { AnimationController, Animation } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations'; // Import animasi dari Angular

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ProfilePage implements OnInit, AfterViewInit {
  customerData: any = {};
  private storage: Storage | null = null;
  showEditModal = false;
  animation: Animation | undefined;
  loading: HTMLIonLoadingElement | null = null;

  @ViewChild('editProfileCard', { static: false }) editProfileCard: ElementRef | undefined;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private navCtrl: NavController,
    private animationCtrl: AnimationController,
    private storageService: Storage,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    try {
      await this.initStorage();
      await this.loadCustomerData();
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }
  }

  async ngAfterViewInit() {
    if (this.showEditModal) {
      this.animateIn();
    }
  }

  async initStorage() {
    this.storage = await this.storageService.create();
  }

  async loadCustomerData() {
    try {
      const data = await this.storage?.get('customerData');
      if (data) {
        this.customerData = data;
      } else {
        await this.fetchCustomerData();
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
    }
  }

  async fetchCustomerData() {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const url = `${environment.apiUrl}/customer`;

        const response = await this.http.get<any>(url, { headers }).toPromise();
        console.log('Customer Data:', response);
        this.customerData = response.data;
        await this.storage?.set('customerData', response.data);
      } else {
        console.error('Token not found');
      }
    } catch (error) {
      console.error('Failed to fetch customer data', error);
      this.presentToast('Gagal memuat data pelanggan', 'danger');
    }
  }

  async logout() {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('customer_id');
      localStorage.removeItem('user_name');
      await this.storage?.remove('customerData');
      this.navCtrl.navigateRoot('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  navigateToRiwayat() {
    const customerId = localStorage.getItem('customer_id');
    if (customerId) {
      this.navCtrl.navigateForward(`/riwayat/${customerId}`);
    } else {
      console.error('Customer ID not found');
    }
  }

  editProfile() {
    this.showEditModal = true;
    this.animateIn();
  }

  animateIn() {
    if (this.editProfileCard && this.editProfileCard.nativeElement) {
      this.animation = this.animationCtrl.create()
        .addElement(this.editProfileCard.nativeElement)
        .duration(500)
        .easing('ease-out')
        .fromTo('transform', 'translateY(100%)', 'translateY(0)')
        .fromTo('opacity', '0', '1');

      this.animation.play();
    } else {
      console.error('Element with class .edit-profile-card not found');
    }
  }

  cancelEdit() {
    this.showEditModal = false;
  }

  async saveChanges() {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        const customerId = this.customerData.id;
        const url = `${environment.apiUrl}/customer/update/${customerId}`;

        await this.presentLoading();

        const response = await this.http.put<any>(url, this.customerData, { headers }).toPromise();
        console.log('Update Success:', response);

        await this.storage?.set('customerData', this.customerData);

        await this.dismissLoading();

        this.presentToast('Profil berhasil diperbarui', 'success');
      } else {
        console.error('Token not found');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);

      await this.dismissLoading();

      this.presentToast('Gagal memperbarui profil', 'danger');
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

  async presentLogoutConfirm() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Logout dibatalkan');
          }
        }, {
          text: 'Keluar',
          handler: async () => {
            await this.logout();
          }
        }
      ]
    });

    await alert.present();
  }
}
