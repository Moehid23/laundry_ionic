import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js'; // Import CryptoJS

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.page.html',
  styleUrls: ['./voucher.page.scss'],
})
export class VoucherPage implements OnInit {
  vouchers: any[] = [];
  private storage: Storage | null = null;
  loading: any;

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.initStorage().then(() => {
      this.fetchVouchersData(); // Memanggil fungsi fetchVouchersData untuk memperbarui data voucher
    }).finally(() => {
      this.dismissLoading();
    });
  }

  async initStorage() {
    this.storage = await this.storage || await new Storage().create();
  }

  async fetchVouchersData() {
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
      const url = `${environment.apiUrl}/vouchers`;

      const response = await this.http.get<any>(url, { headers }).toPromise();
      this.vouchers = response.data;
      await this.storage?.set('vouchersData', response.data);
    } catch (error) {
      console.error('Failed to fetch vouchers data', error);
      this.presentToast('Gagal memuat data voucher', 'danger');
    }
  }

  async claimVoucher(voucherId: number, pointsRequired: number) {
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
      const url = `${environment.apiUrl}/claim-voucher/${voucherId}`;

      // Menampilkan loading sebelum request
      await this.presentLoading();

      const response = await this.http.post<any>(url, { points_required: pointsRequired }, { headers }).toPromise();
      this.presentToast('Voucher berhasil di-claim', 'success');
      // Lakukan pengolahan data setelah klaim voucher berhasil

    } catch (error) {
      console.error('Failed to claim voucher', error);
      this.presentToast('Gagal meng-claim voucher', 'danger');
    } finally {
      // Tutup loading setelah request selesai
      await this.dismissLoading();
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

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color
    });
    toast.present();
  }

  decryptToken(encryptedToken: string): string {
    return CryptoJS.AES.decrypt(encryptedToken, 'secret_key').toString(CryptoJS.enc.Utf8);
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
