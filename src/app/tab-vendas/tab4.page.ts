import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SaleService } from '../services/sale.service';
import { Sale } from '../models/sale.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit, OnDestroy {
  sales: Sale[] = [];
  filteredSales: Sale[] = [];
  searchTerm: string = '';
  private salesSubscription!: Subscription;

  constructor(
    private navCtrl: NavController,
    private saleService: SaleService
  ) { }

  ngOnInit() {
    this.salesSubscription = this.saleService.sales$.subscribe(sales => {
      this.sales = sales;
      this.applyFilter();
    });
  }

  ngOnDestroy() {
    this.salesSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.saleService.getAllSales().subscribe();
  }

  searchSales(event: any) {
    this.searchTerm = event.target.value?.toLowerCase() || '';
    this.applyFilter();
  }

  applyFilter() {
    const filtered = this.sales.filter(sale => {
      const clientName = sale.cliente?.nome?.toLowerCase() || '';
      const searchTerm = this.searchTerm.toLowerCase();
      return clientName.includes(searchTerm) || sale.date.includes(searchTerm);
    });

    this.filteredSales = filtered.sort((a, b) => {
      const dateA = this.parseDate(a.date);
      const dateB = this.parseDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }

  private parseDate(dateString: string): Date {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(NaN);
  }

  addNewSale() {
    this.navCtrl.navigateForward('/new-sale');
  }

  openSaleDetails(sale: Sale) {
    if (sale.id) {
      this.navCtrl.navigateForward(`/sale-details/${sale.id}`);
    }
  }
}