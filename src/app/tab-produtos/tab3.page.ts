import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  products = [
    { id: 1, name: 'Camiseta Branca P', price: '59.90', stock: 22 },
    { id: 2, name: 'Camiseta Branca M', price: '59.90', stock: 18 },
    { id: 3, name: 'Camiseta Branca G', price: '59.90', stock: 15 },
    { id: 4, name: 'Camiseta Branca GG', price: '59.90', stock: 12 },
    { id: 5, name: 'Camiseta Preta P', price: '59.90', stock: 25 },
    { id: 6, name: 'Camiseta Preta M', price: '59.90', stock: 20 },
    { id: 7, name: 'Calça Jeans 38', price: '129.90', stock: 8 },
  ];

  filteredProducts = [...this.products];

  constructor(private navCtrl: NavController) {
    this.filteredProducts = this.products;
  }

  searchProducts(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm.trim() === '') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.price.includes(searchTerm)
      );
    }
  }

  openProductDetails(product: any) {
    console.log('Abrir detalhes do produto:', product);
    this.navCtrl.navigateForward(`/product-details/${product.id}`);
  }
  addNewProduct() {
    this.navCtrl.navigateForward('/new-product');
  }


  formatPrice(price: string): string {
    return `R$ ${price}`;
  }

}
