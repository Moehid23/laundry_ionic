import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router from Angular Router
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tarif',
  templateUrl: './tarif.page.html',
  styleUrls: ['./tarif.page.scss'],
})
export class TarifPage implements OnInit {
  services: any[] = [];

  constructor(private http: HttpClient, private router: Router) { } // Inject Router

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/services`;

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
    service.quantity++;
  }

  decreaseQuantity(service: any) {
    if (service.quantity > 0) {
      service.quantity--;
    }
  }

  getTotalPrice(service: any) {
    return service.price * service.quantity;
  }

  navigateToRiwayat() {
    const customerId = localStorage.getItem('customer_id');
    if (customerId) {
      this.router.navigate(['/riwayat', customerId]); // Use Router to navigate
    } else {
      console.error('Customer ID not found');
    }
  }

}
