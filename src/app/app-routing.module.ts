import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'new-client',
    loadChildren: () => import('./new-client/new-client.module').then(m => m.NewClientPageModule)
  },
  {
    path: 'new-product',
    loadChildren: () => import('./new-product/new-product.module').then(m => m.NewProductPageModule)
  },
  {
    path: 'new-product',
    loadChildren: () => import('./new-product/new-product.module').then(m => m.NewProductPageModule)
  },
  {
    path: 'new-sale',
    loadChildren: () => import('./new-sale/new-sale.module').then(m => m.NewSalePageModule)
  },
  {
    path: 'new-sale',
    loadChildren: () => import('./new-sale/new-sale.module').then(m => m.NewSalePageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
