import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html',
  styleUrls: ['./riwayat.page.scss'],
})
export class RiwayatPage implements OnInit {
  customerId: string = '';
  transactions: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('customerId') || '';
    this.loadTransactions();
  }

  loadTransactions() {
    const token = localStorage.getItem('login_token');
    if (token && this.customerId) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/transaksi/${this.customerId}`;

      this.http.get<any>(url, { headers })
        .subscribe(
          (response) => {
            console.log('Transaction Data:', response);
            this.transactions = response.data; // Asumsi respons API memiliki properti data
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