import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TarifPageRoutingModule } from './tarif-routing.module';
import { TarifPage } from './tarif.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TarifPageRoutingModule
  ],
  declarations: [TarifPage]
})
export class TarifPageModule { }
