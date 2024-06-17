import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastController, LoadingController } from '@ionic/angular'; // tambahkan LoadingController
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.page.html',
  styleUrls: ['./voucher.page.scss'],
})
export class VoucherPage implements OnInit {

  vouchers: any[] = [];
  customer: any = null;
  private storage: Storage | null = null;
  loading: any; // variabel untuk menyimpan objek loading

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private loadingController: LoadingController, // inject LoadingController
    private ionicStorage: Storage,
    private router: Router
  ) {
    this.initStorage();
  }

  async ngOnInit() {
    await this.presentLoading(); // tampilkan loading spinner saat memuat data
    await this.loadCustomerData();
    await this.loadVouchers();
    await this.dismissLoading(); // tutup loading spinner setelah selesai memuat data
  }

  async initStorage() {
    this.storage = await this.ionicStorage.create();
  }

  async loadCustomerData() {
    try {
      const data = await this.storage?.get('customerData');
      if (data) {
        this.customer = data;
      } else {
        await this.fetchCustomerData();
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
    }
  }

  async fetchCustomerData() {
    try {
      const token = localStorage.getItem('login_token');
      if (token) {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const url = `${environment.apiUrl}/customer`;

        const response = await this.http.get<any>(url, { headers }).toPromise();
        console.log('Customer Data:', response);
        this.customer = response.data;
        await this.storage?.set('customerData', response.data);
      } else {
        console.error('Token not found');
      }
    } catch (error) {
      console.error('Failed to fetch customer data', error);
    }
  }

  async loadVouchers() {
    try {
      const data = await this.storage?.get('vouchersData');
      if (data) {
        this.vouchers = data;
      } else {
        await this.fetchVouchersData();
      }
    } catch (error) {
      console.error('Error loading vouchers data:', error);
    }
  }

  async fetchVouchersData() {
    try {
      const token = localStorage.getItem('login_token');
      if (token) {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const url = `${environment.apiUrl}/vouchers`;

        const response = await this.http.get<any>(url, { headers }).toPromise();
        console.log('Vouchers Data:', response);
        this.vouchers = response.data;
        await this.storage?.set('vouchersData', response.data);
      } else {
        console.error('Token not found');
      }
    } catch (error) {
      console.error('Failed to fetch vouchers data', error);
    }
  }

  async claimVoucher(voucherId: number, pointsRequired: number) {
    try {
      if (this.customer && this.customer.points >= pointsRequired) {
        await this.presentLoading(); // tampilkan loading spinner sebelum mengklaim voucher

        const token = localStorage.getItem('login_token');
        if (token) {
          const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
          const url = `${environment.apiUrl}/claim-voucher/${voucherId}`;

          const response = await this.http.post<any>(url, {}, { headers }).toPromise();
          console.log('Voucher claimed successfully', response);

          this.customer.points -= pointsRequired;
          await this.storage?.set('customerData', this.customer);

          this.presentToast('Voucher berhasil diclaim', 'success');
        } else {
          console.error('Token not found');
        }

        await this.dismissLoading(); // tutup loading spinner setelah mengklaim voucher
      } else {
        console.error('Not enough points to claim this voucher');
        this.presentToast('Point Anda tidak mencukupi untuk melakukan klaim voucher', 'danger');
      }
    } catch (error) {
      console.error('Failed to claim voucher', error);
      this.presentToast('Gagal melakukan klaim voucher', 'danger');
      await this.dismissLoading(); // pastikan loading spinner ditutup jika terjadi error
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

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    toast.present();
  }

  navigateToRiwayat() {
    const customerId = localStorage.getItem('customer_id');
    if (customerId) {
      this.router.navigate(['/riwayat', customerId]);
    } else {
      console.error('Customer ID not found');
    }
  }

}
