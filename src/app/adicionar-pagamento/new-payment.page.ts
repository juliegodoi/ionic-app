import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.page.html',
  styleUrls: ['./new-payment.page.scss'],
  standalone: false,
})
export class NewPaymentPage implements OnInit {

  // Mock de vendas existentes
  sales = [
    { 
      id: 1, 
      client: 'Maria Silva', 
      totalValue: 189.80, 
      paidValue: 100.00,
      date: '2024-09-01',
      description: 'Venda #001 - Maria Silva'
    },
    { 
      id: 2, 
      client: 'João Santos', 
      totalValue: 259.90, 
      paidValue: 0.00,
      date: '2024-09-02',
      description: 'Venda #002 - João Santos'
    },
    { 
      id: 3, 
      client: 'Ana Costa', 
      totalValue: 129.90, 
      paidValue: 129.90,
      date: '2024-09-03',
      description: 'Venda #003 - Ana Costa'
    },
    { 
      id: 4, 
      client: 'Pedro Lima', 
      totalValue: 319.70, 
      paidValue: 150.00,
      date: '2024-09-04',
      description: 'Venda #004 - Pedro Lima'
    },
  ];

  payment = {
    selectedSale: '',
    selectedSaleId: null as number | null,
    value: null as number | null,
    paymentMethod: '',
    observations: ''
  };

  selectedSaleDetails: any = null;

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  isFormValid(): boolean {
    return this.payment.selectedSale !== '' &&
      this.payment.value !== null &&
      this.payment.value > 0 &&
      this.payment.paymentMethod !== '';
  }

  async selectSale() {
    const alert = await this.alertController.create({
      header: 'Selecionar Venda',
      inputs: this.sales
        .filter(sale => sale.paidValue < sale.totalValue) // Só vendas com saldo pendente
        .map(sale => ({
          type: 'radio',
          label: `${sale.description} - Saldo: R$ ${(sale.totalValue - sale.paidValue).toFixed(2).replace('.', ',')}`,
          value: sale.id,
          checked: this.payment.selectedSaleId === sale.id
        })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Selecionar',
          handler: (selectedSaleId) => {
            if (selectedSaleId) {
              const selectedSale = this.sales.find(s => s.id === selectedSaleId);
              if (selectedSale) {
                this.payment.selectedSale = selectedSale.description;
                this.payment.selectedSaleId = selectedSale.id;
                this.updateSaleDetails(selectedSale);
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  updateSaleDetails(sale: any) {
    this.selectedSaleDetails = {
      client: sale.client,
      totalValue: `R$ ${sale.totalValue.toFixed(2).replace('.', ',')}`,
      paidValue: `R$ ${sale.paidValue.toFixed(2).replace('.', ',')}`,
      remainingBalance: `R$ ${(sale.totalValue - sale.paidValue).toFixed(2).replace('.', ',')}`
    };
  }

  formatValue(event: any) {
    const value = event.detail.value;
    if (value) {
      this.payment.value = parseFloat(value);
    }
  }

  async savePayment() {
    if (!this.isFormValid()) {
      await this.showToast('Por favor, preencha todos os campos obrigatórios', 'warning');
      return;
    }

    // Verificar se o valor do pagamento não excede o saldo devedor
    const selectedSale = this.sales.find(s => s.id === this.payment.selectedSaleId);
    if (selectedSale) {
      const remainingBalance = selectedSale.totalValue - selectedSale.paidValue;
      if (this.payment.value! > remainingBalance) {
        await this.showToast(`O valor do pagamento não pode exceder o saldo devedor de R$ ${remainingBalance.toFixed(2).replace('.', ',')}`, 'warning');
        return;
      }
    }

    try {
      // Simular salvamento do pagamento
      console.log('Pagamento a ser salvo:', this.payment);
      
      // Atualizar o valor pago da venda (simulação)
      if (selectedSale && this.payment.value) {
        selectedSale.paidValue += this.payment.value;
      }

      await this.showToast('Pagamento adicionado com sucesso!', 'success');
      this.navCtrl.back();

    } catch (error) {
      await this.showToast('Erro ao adicionar pagamento', 'danger');
      console.error('Erro:', error);
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

}