// src/app/aut/guard/guard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GuardPageRoutingModule } from './guard-routing.module';
import { GuardPage } from './guard.page';
import { AuthGuard } from './auth.guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuardPageRoutingModule
  ],
  declarations: [GuardPage],
  providers: [AuthGuard]
})
export class GuardPageModule { }
