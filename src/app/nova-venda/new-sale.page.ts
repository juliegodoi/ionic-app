import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.page.html',
  styleUrls: ['./new-sale.page.scss'],
  standalone: false,
})
export class NewSalePage implements OnInit {

  clients = [
    { id: 1, name: 'Maria Silva' },
    { id: 2, name: 'João Santos' },
    { id: 3, name: 'Ana Costa' },
    { id: 4, name: 'Pedro Lima' },
    { id: 5, name: 'Carla Oliveira' },
  ];

  products = [
    { id: 1, name: 'Camiseta Branca P', price: 59.90 },
    { id: 2, name: 'Camiseta Branca M', price: 59.90 },
    { id: 3, name: 'Camiseta Branca G', price: 59.90 },
    { id: 4, name: 'Calça Jeans 38', price: 129.90 },
  ];

  sale = {
    selectedClient: '',
    selectedProducts: [] as any[],
    value: 'R$ 0,00',
    paymentMethod: '',
    paymentCondition: ''
  };

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  isFormValid(): boolean {
    return this.sale.selectedClient !== '' &&
      this.sale.selectedProducts.length > 0 &&
      this.sale.paymentMethod !== '';
  }

  async selectClient() {
    const alert = await this.alertController.create({
      header: 'Selecionar cliente',
      inputs: this.clients.map(client => ({
        type: 'radio',
        label: client.name,
        value: client.name,
        checked: this.sale.selectedClient === client.name
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Selecionar',
          handler: (selectedClient) => {
            if (selectedClient) {
              this.sale.selectedClient = selectedClient;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async selectProducts() {
    const alert = await this.alertController.create({
      header: 'Selecionar produtos',
      inputs: this.products.map(product => ({
        type: 'checkbox',
        label: `${product.name} - R$ ${product.price.toFixed(2)}`,
        value: product,
        checked: this.sale.selectedProducts.some(p => p.id === product.id)
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Selecionar',
          handler: (selectedProducts) => {
            this.sale.selectedProducts = selectedProducts || [];
          }
        }
      ]
    });
    await alert.present();
  }

  calculateTotal() {
    const total = this.sale.selectedProducts.reduce((sum, product) => sum + product.price, 0);
    this.sale.value = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  async saveSale() {
    if (!this.isFormValid()) {
      await this.showToast('Por favor, preencha todos os campos obrigatórios', 'warning');
      return;
    }

    try {
      console.log('Venda a ser salva:', this.sale);

      await this.showToast('Venda salva com sucesso!', 'success');

      this.navCtrl.back();

    } catch (error) {
      await this.showToast('Erro ao salvar venda', 'danger');
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