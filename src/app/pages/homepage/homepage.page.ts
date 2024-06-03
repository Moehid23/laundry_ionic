import { Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage {

  images = [
    'https://ionicframework.com/docs/img/demos/card-media.png',
    'https://ionicframework.com/docs/img/demos/card-media.png', // Ganti URL dengan URL gambar Anda
    'https://ionicframework.com/docs/img/demos/card-media.png' // Ganti URL dengan URL gambar Anda
    // Tambahkan URL gambar yang lain di sini jika diperlukan
  ];
  currentIndex = 0;

  constructor() { }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    console.log('Next image:', this.currentIndex);
  }

  previousImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    console.log('Previous image:', this.currentIndex);
  }
}
