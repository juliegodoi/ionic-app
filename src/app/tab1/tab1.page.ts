import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  constructor() { }

  // Adicionar estes métodos na classe Tab1Page

  addProduct() {
    console.log('Adicionar produto');
  }

  addClient() {
    console.log('Adicionar cliente');
  }

  addSale() {
    console.log('Adicionar venda');
  }

  addPayment() {
    console.log('Adicionar pagamento');
  }

}
