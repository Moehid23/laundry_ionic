import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './aut/guard/auth.guard'; // Impor AuthGuard

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadChildren: () => import('./slides/splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: 'slide-2',
    loadChildren: () => import('./slides/slide-2/slide-2.module').then(m => m.Slide2PageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./aut/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./aut/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard] // Amankan halaman ini
  },
  {
    path: 'homepage',
    loadChildren: () => import('./pages/homepage/homepage.module').then(m => m.HomepagePageModule),
    canActivate: [AuthGuard] // Amankan halaman ini
  },
  {
    path: 'tarif',
    loadChildren: () => import('./pages/tarif/tarif.module').then(m => m.TarifPageModule),
    canActivate: [AuthGuard] // Amankan halaman ini
  },
  {
    path: 'riwayat/:customerId',
    loadChildren: () => import('./pages/riwayat/riwayat.module').then(m => m.RiwayatPageModule),
    canActivate: [AuthGuard] // Amankan halaman ini
  },
  {
    path: 'voucher',
    loadChildren: () => import('./pages/voucher/voucher.module').then(m => m.VoucherPageModule),
    canActivate: [AuthGuard] // Amankan halaman ini
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard] // Amankan halaman ini
  },
  {
    path: 'guard',
    loadChildren: () => import('./aut/guard/guard.module').then(m => m.GuardPageModule),
    canActivate: [AuthGuard] // Amankan halaman ini
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
