import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Sale } from '../models/sale.model';
import { SaleService } from '../services/sale.service';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.page.html',
  styleUrls: ['./new-payment.page.scss'],
  standalone: false,
})
export class NewPaymentPage implements OnInit {

  sales: Sale[] = [];
  selectedSale: Sale | null = null;

  payment = {
    selectedSaleName: '', 
    selectedSaleId: null as number | null,
    value: null as number | null,
    paymentMethod: '',
    observations: ''
  };

  selectedSaleDetails: any = null;

  paymentMethods = ['Cartão de Débito', 'Cartão de Crédito', 'Dinheiro', 'PIX'];

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private alertController: AlertController,
    private saleService: SaleService
  ) { }

  ngOnInit() {
    this.saleService.sales$.subscribe(sales => {
      this.sales = sales.filter(sale => sale.totalValue > (sale.paidValue || 0));
    });
    this.saleService.getAllSales().subscribe();
  }

  isFormValid(): boolean {
    const isSaleSelected = !!this.payment.selectedSaleId;
    const isValueValid = this.payment.value !== null && this.payment.value > 0;
    const isPaymentMethodSelected = this.payment.paymentMethod !== '';

    if (this.selectedSale) {
      const remainingBalance = this.selectedSale.totalValue - (this.selectedSale.paidValue || 0);
      if (this.payment.value! > remainingBalance) {
        return false;
      }
    }

    return isSaleSelected && isValueValid && isPaymentMethodSelected;
  }

  async selectSale() {
    const alert = await this.alertController.create({
      header: 'Selecionar Venda',
      inputs: this.sales.map(sale => ({
        type: 'radio',
        label: `${sale.cliente.nome} - R$ ${sale.totalValue.toFixed(2).replace('.', ',')}`,
        value: sale,
        checked: this.payment.selectedSaleId === sale.id
      })),
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Selecionar',
          handler: (selectedSale: Sale) => {
            if (selectedSale) {
              this.selectedSale = selectedSale;
              this.payment.selectedSaleName = `${selectedSale.cliente.nome} - R$ ${selectedSale.totalValue.toFixed(2).replace('.', ',')}`;
              this.payment.selectedSaleId = selectedSale.id!;
              this.updateSaleDetails(selectedSale);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  updateSaleDetails(sale: Sale) {
    this.selectedSaleDetails = {
      client: sale.cliente.nome,
      totalValue: `R$ ${sale.totalValue.toFixed(2).replace('.', ',')}`,
      paidValue: `R$ ${sale.paidValue ? sale.paidValue.toFixed(2).replace('.', ',') : '0,00'}`,
      remainingBalance: `R$ ${(sale.totalValue - (sale.paidValue || 0)).toFixed(2).replace('.', ',')}`
    };
  }

  formatValue(event: any) {
    const value = event.target.value;
    if (value) {
      this.payment.value = parseFloat(value.replace(',', '.'));
    }
    this.updateSummary();
  }

  updateSummary() {
    if (this.selectedSale) {
      const newPaidValue = (this.selectedSale.paidValue || 0) + (this.payment.value || 0);
      const newRemainingBalance = this.selectedSale.totalValue - newPaidValue;

      this.selectedSaleDetails.paidValue = `R$ ${newPaidValue.toFixed(2).replace('.', ',')}`;
      this.selectedSaleDetails.remainingBalance = `R$ ${newRemainingBalance.toFixed(2).replace('.', ',')}`;
    }
  }

  async savePayment() {
    if (!this.isFormValid()) {
      return;
    }

    const paymentData = {
      valor: this.payment.value,
      formaPagamento: this.payment.paymentMethod,
      observacoes: this.payment.observations
    };

    this.http.post(`http://localhost:8080/pagamentos/${this.payment.selectedSaleId}`, paymentData)
      .subscribe({
        next: (response) => {
          this.saleService.getAllSales().subscribe(() => {
            this.navCtrl.back();
          });
        },
        error: (error) => {
        }
      });
  }
}