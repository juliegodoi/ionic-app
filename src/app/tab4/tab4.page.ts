import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: false,
})
export class Tab4Page {
  searchTerm: string = '';

  constructor(private navCtrl: NavController) { }

  sales = [
    { date: '2025-08-30', client: 'Maria Silva', value: 500, products: ['Produto A', 'Produto B'] },
    { date: '2025-08-30', client: 'João Souza', value: 200, products: ['Produto X'] },
    { date: '2025-08-29', client: 'Maria Silva', value: 500, products: ['Produto A', 'Produto B'] }
  ];

  get filteredSales() {
    let filtered = this.sales.filter(sale =>
      sale.client.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      sale.date.includes(this.searchTerm)
    );

    const groups: any = {};
    filtered.forEach(sale => {
      if (!groups[sale.date]) groups[sale.date] = [];
      groups[sale.date].push(sale);
    });

    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(date => ({
        date,
        sales: groups[date]
      }));
  }
  addNewSale() {
    this.navCtrl.navigateForward('/new-sale');
  }
  openSaleDetails(sale: any) {
    console.log('Detalhes da venda:', sale);
  }
}