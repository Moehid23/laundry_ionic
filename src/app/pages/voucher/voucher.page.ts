import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.page.html',
  styleUrls: ['./voucher.page.scss'],
})
export class VoucherPage implements OnInit {

  vouchers: any[] = [];
  customer: any = null; // Objek untuk menyimpan data pelanggan termasuk poin

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadCustomerData();
    this.loadVouchers();
  }

  loadCustomerData() {
    const token = localStorage.getItem('login_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/customer`; // Sesuaikan dengan route API untuk mengambil data pelanggan

      this.http.get<any>(url, { headers }).subscribe(
        (response) => {
          console.log('Customer Data:', response);
          this.customer = response.data; // Asumsi respons API memiliki properti data yang berisi data pelanggan
        },
        (error) => {
          console.error('Failed to fetch customer data', error);
        }
      );
    } else {
      console.error('Token not found');
    }
  }

  loadVouchers() {
    const token = localStorage.getItem('login_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/vouchers`;

      this.http.get<any>(url, { headers }).subscribe(
        (response) => {
          console.log('Vouchers Data:', response);
          this.vouchers = response.data;
        },
        (error) => {
          console.error('Failed to fetch vouchers data', error);
        }
      );
    } else {
      console.error('Token not found');
    }
  }

  claimVoucher(voucherId: number, pointsRequired: number) {
    if (this.customer && this.customer.points >= pointsRequired) {
      const token = localStorage.getItem('login_token');
      if (token) {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const url = `${environment.apiUrl}/claim-voucher/${voucherId}`;

        this.http.post<any>(url, {}, { headers }).subscribe(
          (response) => {
            console.log('Voucher claimed successfully', response);
            this.customer.points -= pointsRequired;

            this.presentToast('Voucher berhasil diclaim', 'success');
          },
          (error) => {
            console.error('Failed to claim voucher', error);
            this.presentToast('Gagal melakukan klaim voucher', 'danger');
          }
        );
      } else {
        console.error('Token not found');
      }
    } else {
      console.error('Not enough points to claim this voucher');
      this.presentToast('Point Anda tidak mencukupi untuk melakukan klaim voucher', 'danger');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Durasi toast (ms)
      position: 'top', // Posisi toast di bagian atas
      color: color // Warna toast berdasarkan parameter
    });
    toast.present();
  }

}
