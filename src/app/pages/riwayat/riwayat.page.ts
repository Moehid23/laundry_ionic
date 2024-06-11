import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html',
  styleUrls: ['./riwayat.page.scss'],
})
export class RiwayatPage implements OnInit {
  transactions: any[] = [];
  customerId: string = '';

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.customerId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.loadTransactionsByCustomerId(this.customerId);
  }

  loadTransactionsByCustomerId(customerId: string) {
    const url = `${environment.apiUrl}/transaksi/${customerId}`;
    this.http.get<any>(url)
      .subscribe(
        (response) => {
          console.log('Transaction data:', response);
          this.transactions = response;
        },
        (error) => {
          console.error('Failed to fetch transaction data', error);
        }
      );
  }
}
