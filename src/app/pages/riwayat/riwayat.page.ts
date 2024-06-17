import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular'; // Import Ionic Storage
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html',
  styleUrls: ['./riwayat.page.scss'],
})
export class RiwayatPage implements OnInit {
  customerId: string = '';
  transactions: any[] = [];

  private storage: Storage | null = null; // Ionic Storage instance

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    await this.initStorage(); // Initialize Ionic Storage
    this.customerId = this.route.snapshot.paramMap.get('customerId') || '';
    this.loadTransactions();
  }

  async initStorage() {
    this.storage = await new Storage().create(); // Create Ionic Storage instance
  }

  loadTransactions() {
    this.storage?.get('transactions').then(data => {
      if (data) {
        this.transactions = data;
      } else {
        this.fetchTransactions();
      }
    });
  }

  fetchTransactions() {
    const token = localStorage.getItem('login_token');
    if (token && this.customerId) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/transaksi/${this.customerId}`;

      this.http.get<any>(url, { headers })
        .subscribe(
          (response) => {
            console.log('Transaction Data:', response);
            this.transactions = response.data; // Set data to component
            this.storage?.set('transactions', response.data); // Save to storage
          },
          (error) => {
            console.error('Failed to fetch transaction data', error);
          }
        );
    } else {
      console.error('Token or Customer ID not found');
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
