import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../../environments/environment';
import { LoadingController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html',
  styleUrls: ['./riwayat.page.scss'],
})
export class RiwayatPage implements OnInit {
  customerId: string = '';
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  endDate: string = '';
  private storage: Storage | null = null;
  startDate: string = ''; // Deklarasikan properti startDate
  loading: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private loadingController: LoadingController,
    private router: Router // Tambahkan ini
  ) { }

  async ngOnInit() {
    await this.initStorage();
    await this.presentLoading();
    this.customerId = this.route.snapshot.paramMap.get('customerId') || '';
    await this.loadTransactions();
    await this.dismissLoading();
  }

  async initStorage() {
    this.storage = await new Storage().create();
  }

  async loadTransactions() {
    try {
      const data = await this.storage?.get(`transactions_${this.customerId}`);
      if (data) {
        this.transactions = data;
        this.filteredTransactions = data;
      } else {
        await this.fetchTransactions();
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }

  async fetchTransactions() {
    try {
      const encryptedToken = localStorage.getItem('access_token');
      if (!encryptedToken) {
        console.error('Token not found in localStorage');
        this.router.navigate(['/login']); // Gunakan Router untuk navigasi
        return;
      }

      // Decrypt token before using it
      const token = this.decryptToken(encryptedToken);

      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/transaksi/${this.customerId}`;

      const response = await this.http.get<any>(url, { headers }).toPromise();
      console.log('Transaction Data:', response);
      this.transactions = response.data;
      this.filteredTransactions = response.data;
      await this.storage?.set(`transactions_${this.customerId}`, response.data);
    } catch (error) {
      console.error('Failed to fetch transaction data', error);
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

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }

  parseItems(items: string): any[] {
    try {
      const parsedItems = JSON.parse(items);
      return Object.keys(parsedItems).map(key => ({
        name: key,
        qty: parsedItems[key].qty,
        unit: parsedItems[key].unit,
        price: parsedItems[key].price
      }));
    } catch (error) {
      console.error('Failed to parse items:', error);
      return [];
    }
  }

  filterByDate() {
    if (this.startDate) {
      const start = new Date(this.startDate);

      this.filteredTransactions = this.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.updated_at);
        // Bandingkan hanya dengan tanggal
        return transactionDate.toDateString() === start.toDateString();
      });
    } else {
      this.filteredTransactions = this.transactions;
    }
  }

  decryptToken(encryptedToken: string): string {
    return CryptoJS.AES.decrypt(encryptedToken, 'secret_key').toString(CryptoJS.enc.Utf8);
  }
}
