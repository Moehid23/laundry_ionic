import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../../environments/environment';
import { LoadingController } from '@ionic/angular'; // tambahkan LoadingController

@Component({
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html',
  styleUrls: ['./riwayat.page.scss'],
})
export class RiwayatPage implements OnInit {
  customerId: string = '';
  transactions: any[] = [];
  private storage: Storage | null = null;
  loading: any; // variabel untuk menyimpan objek loading

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private loadingController: LoadingController // tambahkan LoadingController
  ) { }

  async ngOnInit() {
    await this.initStorage(); // Initialize Ionic Storage
    await this.presentLoading(); // tampilkan loading spinner saat memuat data
    this.customerId = this.route.snapshot.paramMap.get('customerId') || '';
    await this.loadTransactions(); // Memuat transaksi dari penyimpanan lokal atau API
    await this.dismissLoading(); // tutup loading spinner setelah selesai memuat data
  }

  async initStorage() {
    this.storage = await new Storage().create(); // Create Ionic Storage instance
  }

  async loadTransactions() {
    try {
      const data = await this.storage?.get('transactions');
      if (data) {
        this.transactions = data;
      } else {
        await this.fetchTransactions();
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }

  async fetchTransactions() {
    const token = localStorage.getItem('login_token');
    if (token && this.customerId) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/transaksi/${this.customerId}`;

      try {
        const response = await this.http.get<any>(url, { headers }).toPromise();
        console.log('Transaction Data:', response);
        this.transactions = response.data; // Set data to component
        await this.storage?.set('transactions', response.data); // Save to storage
      } catch (error) {
        console.error('Failed to fetch transaction data', error);
      }
    } else {
      console.error('Token or Customer ID not found');
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

}
