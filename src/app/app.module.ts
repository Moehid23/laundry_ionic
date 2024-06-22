import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Tambahkan import HttpClientModule untuk HTTP Client
import { HttpClientModule } from '@angular/common/http';

// Tambahkan import untuk Ionic Storage
import { IonicStorageModule } from '@ionic/storage-angular';

// Tambahkan import BrowserAnimationsModule untuk animasi
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,  // Tambahkan HttpClientModule di sini
    IonicStorageModule.forRoot(),  // Inisialisasi Ionic Storage
    BrowserAnimationsModule  // Tambahkan BrowserAnimationsModule di sini
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
