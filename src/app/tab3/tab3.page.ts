import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  // Adicionar estas propriedades e métodos na classe Tab3Page

  products = [
    { id: 1, name: 'Camiseta Branca P', price: '59.90', stock: 22 },
    { id: 2, name: 'Camiseta Branca M', price: '59.90', stock: 18 },
    { id: 3, name: 'Camiseta Branca G', price: '59.90', stock: 15 },
    { id: 4, name: 'Camiseta Branca GG', price: '59.90', stock: 12 },
    { id: 5, name: 'Camiseta Preta P', price: '59.90', stock: 25 },
    { id: 6, name: 'Camiseta Preta M', price: '59.90', stock: 20 },
    { id: 7, name: 'Calça Jeans 38', price: '129.90', stock: 8 },
    { id: 8, name: 'Calça Jeans 40', price: '129.90', stock: 6 },
  ];

  filteredProducts = [...this.products];

  constructor() {
    // Inicializar com todos os produtos
    this.filteredProducts = this.products;
  }

  // Buscar produtos
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

  // Abrir detalhes do produto
  openProductDetails(product: any) {
    console.log('Abrir detalhes do produto:', product);
    // Implementar navegação para página de detalhes do produto
  }

  // Adicionar novo produto
  addNewProduct() {
    console.log('Adicionar novo produto');
    // Implementar navegação para página de adicionar produto
  }

  // Formatar preço (método auxiliar)
  formatPrice(price: string): string {
    return `R$ ${price}`;
  }

}
