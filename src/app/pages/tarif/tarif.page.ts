import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../../environments/environment';
import { LoadingController } from '@ionic/angular'; // tambahkan LoadingController

@Component({
  selector: 'app-tarif',
  templateUrl: './tarif.page.html',
  styleUrls: ['./tarif.page.scss'],
})
export class TarifPage implements OnInit {
  services: any[] = [];
  private storage: Storage | null = null;
  loading: any; // variabel untuk menyimpan objek loading

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingController: LoadingController // tambahkan LoadingController
  ) { }

  async ngOnInit() {
    await this.initStorage(); // Initialize Ionic Storage
    await this.presentLoading(); // tampilkan loading spinner saat memuat data
    this.loadData(); // Memuat data dari penyimpanan lokal atau API
    await this.dismissLoading(); // tutup loading spinner setelah selesai memuat data
  }

  async initStorage() {
    this.storage = await new Storage().create(); // Create Ionic Storage instance
  }

  async loadData() {
    try {
      const data = await this.storage?.get('services');
      if (data) {
        this.services = data.map((service: any) => ({ ...service, quantity: 1 }));
      } else {
        await this.fetchData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async fetchData() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/services`;

      try {
        const response = await this.http.get<any>(url, { headers }).toPromise();
        console.log('Data:', response);
        this.services = response.data.map((service: any) => ({ ...service, quantity: 1 }));
        await this.storage?.set('services', response.data); // Save to storage
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
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

  navigateToRiwayat() {
    const customerId = localStorage.getItem('customer_id');
    if (customerId) {
      this.router.navigate(['/riwayat', customerId]); // Gunakan Router untuk navigasi
    } else {
      console.error('Customer ID not found');
    }
  }

}
