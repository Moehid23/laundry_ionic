import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  customerData: any = {
    name: '',
    contact: '',
    address: '',
    points: 0
  };
  password = '';
  passwordConfirmation = '';
  showPassword = false;
  showVerPassword = false;
  showForm = false; // This will toggle between view and edit mode
  loadingData = true; // Indicates whether data is being loaded

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadCustomerData();
  }

  loadCustomerData() {
    const token = localStorage.getItem('login_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      const url = `${environment.apiUrl}/customer`;

      this.http.get<any>(url, { headers }).subscribe(
        (response) => {
          console.log('Customer Data:', response);
          this.customerData = response.data; // Assuming response structure has a 'data' property
          this.loadingData = false; // Set loadingData to false after data is loaded
        },
        (error) => {
          console.error('Failed to fetch customer data', error);
          this.loadingData = false; // Set loadingData to false if there's an error
          this.presentToast('Failed to fetch customer data. Please try again.', 'danger');
        }
      );
    } else {
      console.error('Token not found in localStorage');
      this.loadingData = false; // Set loadingData to false if token is not found
      this.presentToast('Token not found. Please log in again.', 'danger');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleVerPasswordVisibility() {
    this.showVerPassword = !this.showVerPassword;
  }

  async ubahProfile() {
    const token = localStorage.getItem('login_token');
    if (token) {
      // Check if passwords match
      if (this.password !== this.passwordConfirmation) {
        this.presentToast('Password and confirmation do not match.', 'danger');
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      const url = `${environment.apiUrl}/customer`;

      // Prepare data to send including password fields
      const data = {
        ...this.customerData,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };

      this.http.put<any>(url, data, { headers }).subscribe(
        (response) => {
          console.log('Customer updated successfully', response);
          this.presentToast('Profile updated successfully', 'success');
          this.showForm = false; // Hide the form after successful update
          // Optionally, update localStorage or perform any other actions upon successful update
          // Example: localStorage.setItem('customer_id', response.id);
        },
        (error) => {
          console.error('Failed to update customer data', error);
          this.presentToast('Failed to update profile. Please try again.', 'danger');
        }
      );
    } else {
      console.error('Token not found in localStorage');
      this.presentToast('Token not found. Please log in again.', 'danger');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  navigateToRiwayat() {
    const customerId = localStorage.getItem('customer_id');
    if (customerId) {
      this.navCtrl.navigateForward(`/riwayat/${customerId}`);
    } else {
      console.error('Customer ID not found');
      this.presentToast('Customer ID not found.', 'danger');
    }
  }

  batal() {
    // Reset form data or any necessary actions to cancel editing
    this.showForm = false;
    // Optionally, reset form fields or perform other cancellation actions
    this.password = '';
    this.passwordConfirmation = '';
  }
}