import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, NavController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../../environments/environment';
import { AnimationController, Animation } from '@ionic/angular';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],

})
export class ProfilePage implements OnInit {
  customerData: any = {};
  private storage: Storage | null = null;
  showEditModal = false;
  animation: Animation | undefined;
  loading: HTMLIonLoadingElement | null = null;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private navCtrl: NavController,
    private animationCtrl: AnimationController,
    private storageService: Storage,
    private loadingController: LoadingController,
    private alertController: AlertController // Tambahkan ini

  ) { }

  async ngOnInit() {
    try {
      await this.initStorage();
      await this.loadCustomerData();
    } catch (error) {
      console.error('Error in ngOnInit:', error);
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
    }
  }
  // profile.page.ts
  async logout() {
    try {
      localStorage.removeItem('access_token'); // Hapus token dari localStorage
      localStorage.removeItem('customer_id'); // Hapus customer ID dari localStorage jika ada
      localStorage.removeItem('user_name'); // Hapus user name dari localStorage jika ada
      await this.storage?.remove('customerData'); // Hapus data pelanggan dari Storage
      this.navCtrl.navigateRoot('/login'); // Redirect ke halaman login
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }


  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top' // Tampilkan toast di bagian atas halaman
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
    const element = document.querySelector('.edit-profile-card') as HTMLElement;
    if (element) {
      element.style.display = 'block';
    } else {
      console.error('Element with class .edit-profile-card not found');
    }
  }

  animateIn() {
    const element = document.querySelector('.edit-profile-card');
    if (element) {
      this.animation = this.animationCtrl.create()
        .addElement(element)
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

        // Menggunakan customerId untuk menentukan endpoint
        const customerId = this.customerData.id;
        const url = `${environment.apiUrl}/customer/update/${customerId}`;

        // Tampilkan spinner loading saat menyimpan
        await this.presentLoading();

        // Kirim permintaan PUT untuk memperbarui data pelanggan
        const response = await this.http.put<any>(url, this.customerData, { headers }).toPromise();
        console.log('Update Success:', response);

        // Perbarui local storage dengan data pelanggan yang diperbarui
        await this.storage?.set('customerData', this.customerData);

        // Sembunyikan spinner loading
        await this.dismissLoading();

        // Tampilkan toast sukses
        this.presentToast('Profil berhasil diperbarui', 'success');
      } else {
        console.error('Token not found');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);

      // Sembunyikan spinner loading
      await this.dismissLoading();

      // Tampilkan toast error
      this.presentToast('Gagal memperbarui profil', 'danger');
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...', // Pesan yang ditampilkan pada spinner loading
      spinner: 'circles', // Jenis spinner yang digunakan (bisa diganti dengan 'dots', 'lines', dll)
      translucent: true, // Membuat latar belakang loading semi-transparan
      cssClass: 'custom-loading' // Kustomisasi tambahan untuk spinner loading
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
            await this.logout(); // Panggil fungsi logout
          }
        }
      ]
    });

    await alert.present();
  }


}
