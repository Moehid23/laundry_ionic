import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Import environment variable

@Component({
  selector: 'app-tarif',
  templateUrl: './tarif.page.html',
  styleUrls: ['./tarif.page.scss'],
})
export class TarifPage implements OnInit {
  services: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/services`; // Menggunakan URL dari environment variable

      this.http.get<any>(url, { headers })
        .subscribe(
          (response) => {
            console.log('Data:', response);
            this.services = response.data.map((service: any) => ({ ...service, quantity: 1 }));
          },
          (error) => {
            console.error('Failed to fetch data', error);
          }
        );
    } else {
      console.error('Token not found in localStorage');
    }
  }

  increaseQuantity(service: any) {
    service.quantity++; // Tambah 1 pada jumlah laundry
  }

  decreaseQuantity(service: any) {
    if (service.quantity > 0) {
      service.quantity--; // Kurangi 1 dari jumlah laundry jika lebih dari 0
    }
  }

  getTotalPrice(service: any) {
    return service.price * service.quantity; // Menghitung harga total
  }
}
