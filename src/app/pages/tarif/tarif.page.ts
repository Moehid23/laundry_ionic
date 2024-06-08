import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

      this.http.get<any>('https://fahrul.webframework.my.id/api/services', { headers })
        .subscribe(
          (response) => {
            console.log('Data:', response);
            this.services = response.data;
          },
          (error) => {
            console.error('Failed to fetch data', error);
          }
        );
    } else {
      console.error('Token not found in localStorage');
    }
  }
}
