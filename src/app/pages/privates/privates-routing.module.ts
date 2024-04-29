import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/order',
        pathMatch: 'full'
      },
      {
        path: 'history',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },

      {
        path: 'order',
        loadChildren: () =>
          import('./order/order.module').then((m) => m.OrderPageModule),
      },
      {
        path: 'order/:ordernumber',
        loadChildren: () =>
          import('./order/order.module').then((m) => m.OrderPageModule),
      },
      {
        path: 'suggestion',
        loadChildren: () =>
          import('./suggestion/suggestion.module').then(
            (m) => m.SuggestionPageModule
          ),
      },
      {
        path: 'suggestion/:ordernumber',
        loadChildren: () => import('./suggestion/suggestion.module').then((m) => m.SuggestionPageModule),
      },
      {
        path: 'basket',
        loadChildren: () =>
          import('./basket/basket.module').then((m) => m.BasketPageModule),
      },
      {
        path: 'basket/:ordernumber',
        loadChildren: () =>
          import('./basket/basket.module').then((m) => m.BasketPageModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PrivatesRoutingModule { }
