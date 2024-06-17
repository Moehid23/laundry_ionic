import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router from Angular Router
import { Storage } from '@ionic/storage-angular'; // Import Ionic Storage
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tarif',
  templateUrl: './tarif.page.html',
  styleUrls: ['./tarif.page.scss'],
})
export class TarifPage implements OnInit {
  services: any[] = [];
  private storage: Storage | null = null; // Ionic Storage instance

  constructor(private http: HttpClient, private router: Router) { } // Inject Router

  async ngOnInit() {
    await this.initStorage(); // Initialize Ionic Storage
    this.loadData();
  }

  async initStorage() {
    this.storage = await new Storage().create(); // Create Ionic Storage instance
  }

  loadData() {
    this.storage?.get('services').then(data => {
      if (data) {
        this.services = data.map((service: any) => ({ ...service, quantity: 1 }));
      } else {
        this.fetchData();
      }
    });
  }

  fetchData() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/services`;

      this.http.get<any>(url, { headers })
        .subscribe(
          (response) => {
            console.log('Data:', response);
            this.services = response.data.map((service: any) => ({ ...service, quantity: 1 }));
            this.storage?.set('services', response.data); // Save to storage
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
