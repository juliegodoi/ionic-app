import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'new-client',
    loadChildren: () => import('./novo-cliente/new-client.module').then(m => m.NewClientPageModule)
  },
  {
    path: 'new-product',
    loadChildren: () => import('./novo-produto/new-product.module').then(m => m.NewProductPageModule)
  },
  {
    path: 'new-product',
    loadChildren: () => import('./novo-produto/new-product.module').then(m => m.NewProductPageModule)
  },
  {
    path: 'new-sale',
    loadChildren: () => import('./nova-venda/new-sale.module').then(m => m.NewSalePageModule)
  },
  {
    path: 'new-payment',
    loadChildren: () => import('./adicionar-pagamento/new-payment.module').then(m => m.NewPaymentPageModule)
  },
  {
    path: 'client-details',
    loadChildren: () => import('./detalhes-cliente/client-details.module').then(m => m.ClientDetailsPageModule)
  },
  {
    path: 'client-details/:id',
    loadChildren: () => import('./detalhes-cliente/client-details.module').then(m => m.ClientDetailsPageModule)
  },
  {
    path: 'product-details/:id',
    loadChildren: () => import('./detalhes-produto/product-details.module').then(m => m.ProductDetailsPageModule)
  },
  {
    path: 'sale-details/:id',
    loadChildren: () => import('./detalhes-vendas/sale-details.module').then( m => m.SaleDetailsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
