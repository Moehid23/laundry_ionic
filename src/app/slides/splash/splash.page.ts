import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: 'splash.page.html',
  styleUrls: ['splash.page.scss'],
})
export class SplashPage {

  constructor(private router: Router) { }

  ionViewDidEnter() {
    // Animasi atau logika lainnya yang berjalan saat halaman splash dimuat
    setTimeout(() => {
      // Setelah 2 detik (atau sesuai durasi animasi splash), navigasi ke slide-2
      this.router.navigate(['/slide-2']); // Navigasi berdasarkan URL
      // atau bisa menggunakan nama rute jika telah didefinisikan dalam app-routing.module.ts
      // this.router.navigate(['slide-2']); 
    }, 2000); // Sesuaikan dengan durasi animasi splash
  }

}