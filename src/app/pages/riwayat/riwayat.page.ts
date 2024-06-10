import { Component } from '@angular/core';

@Component({
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html',
  styleUrls: ['./riwayat.page.scss'],
})
export class RiwayatPage {
  transactions: any[] = []; // Define and initialize 'transactions' property

  constructor() {
    // Initialize or fetch data for 'transactions' here if necessary
    // Example: this.transactions = someService.getTransactions();
  }

  closeCard() {
    // Implement the functionality to close the card here
    console.log('Card closed'); // Example action, replace with your actual implementation
  }
}
