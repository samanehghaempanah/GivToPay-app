import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./pages/publics/landing/landing.module').then(m => m.LandingPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/publics/landing/landing.module').then(m => m.LandingPageModule)
  }, {
    path: 'landing/:token',
    loadChildren: () => import('./pages/publics/landing/landing.module').then(m => m.LandingPageModule)
  },
  {
    canActivate: [AuthGuard],
    path: 'shopping',
    loadChildren: () =>
      import('./pages/publics/shopping/shopping.module').then((m) => m.ShoppingPageModule),
  },
  {
    canActivate: [AuthGuard],
    path: 'shopping/:ordernumber',
    loadChildren: () =>
      import('./pages/publics/shopping/shopping.module').then((m) => m.ShoppingPageModule),
  },
  {
    canActivate: [AuthGuard],
    path: '',
    loadChildren: () =>
      import('./pages/privates/privates-routing.module').then((m) => m.PrivatesRoutingModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/publics/signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'login/:url',
    loadChildren: () =>
      import('./pages/publics/signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'reserve',
    loadChildren: () => import('./pages/publics/reserve/reserve.module').then(m => m.ReservePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
