// src/app/aut/guard/guard-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardPage } from './guard.page';
import { AuthGuard } from './auth.guard'; // Pastikan path ini benar

const routes: Routes = [
  {
    path: '',
    component: GuardPage,
    canActivate: [AuthGuard] // Gunakan AuthGuard untuk mengamankan halaman ini
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuardPageRoutingModule { }
