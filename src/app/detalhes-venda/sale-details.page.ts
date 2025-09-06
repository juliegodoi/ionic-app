import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ModalController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.page.html',
  styleUrls: ['./sale-details.page.scss'],
  standalone: false,
})
export class SaleDetailsPage implements OnInit {
  sale: any = {};
  isEditing: boolean | undefined;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.loadSale();
  }

  loadSale() {
    this.sale = {
      id: '1',
      clientName: 'Maria Souza',
      date: '15/09/2024',
      paymentMethod: 'cartao_credito',
      paymentCondition: 'Parcelado em 3x sem juros',
      status: 'concluida',
      products: [
        { id: 1, name: 'Camiseta Branca M', quantity: 2, price: 59.90 },
        { id: 3, name: 'Camiseta Branca G', quantity: 1, price: 59.90 },
        { id: 7, name: 'Calça Jeans 38', quantity: 1, price: 129.90 },
      ]
    };
  }

  getTotalValue(): number {
    return this.sale.products?.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity);
    }, 0) || 0;
  }

  enableEdit() {
    this.isEditing = true;
  }

  saveSale() {
    if (!this.sale.clientName || !this.sale.paymentMethod) {
      this.showAlert('Erro', 'Cliente e forma de pagamento são obrigatórios!');
      return;
    }

    console.log('Venda atualizada:', this.sale);
    
    this.showAlert('Sucesso', 'Venda atualizada com sucesso!');
    this.isEditing = false;
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Excluir venda',
      message: 'Tem certeza que deseja excluir esta venda?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: () => this.deleteSale()
        }
      ]
    });

    await alert.present();
  }

  deleteSale() {
    console.log('Venda excluída:', this.sale.id);
    this.navCtrl.navigateBack('/tabs/tab4');
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async openProductsList() {
    const modal = await this.modalCtrl.create({
      component: ProductsListModalComponent,
      componentProps: { products: this.sale.products }
    });

    await modal.present();
  }
}

@Component({
  selector: 'app-products-list-modal',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Produtos da venda</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item *ngFor="let product of products">
          <ion-label>
            <h2>{{ product.name }}</h2>
            <p>Quantidade: {{ product.quantity }}</p>
            <p>Valor unitário: R$ {{ product.price.toFixed(2) }}</p>
            <p><strong>Subtotal: R$ {{ (product.quantity * product.price).toFixed(2) }}</strong></p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-item lines="none" style="margin-top: 16px; --background: var(--ion-color-light);">
        <ion-label>
          <h2><strong>TOTAL: R$ {{ getTotalValue().toFixed(2) }}</strong></h2>
        </ion-label>
      </ion-item>
    </ion-content>
  `
})
export class ProductsListModalComponent {
  @Input() products: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  getTotalValue(): number {
    return this.products.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  close() {
    this.modalCtrl.dismiss();
  }
}