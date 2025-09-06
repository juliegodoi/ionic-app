import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.page.html',
  styleUrls: ['./client-details.page.scss'],
  standalone: false,
})
export class ClientDetailsPage implements OnInit {
  client: any = {};
  sales: any[] = [];
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    const clientId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadClient(clientId);
    this.loadSales(clientId);
  }

  loadClient(id: string) {
    this.client = {
      id,
      name: 'Maria Souza',
      phone: '(51) 99999-0000',
      email: 'maria@email.com'
    };
  }

  loadSales(clientId: string) {
    this.sales = [
      { id: 101, product: 'Produto A', value: 'R$ 1.200,00', date: '01/09/2023' },
      { id: 102, product: 'Produto B', value: 'R$ 800,00', date: '05/09/2023' },
    ];
  }

  enableEdit() {
    this.isEditing = true;
  }

  saveClient() {
    console.log('Cliente atualizado:', this.client);
    this.isEditing = false;
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Excluir cliente',
      message: 'Tem certeza que deseja excluir este cliente?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: () => this.deleteClient()
        }
      ]
    });

    await alert.present();
  }

  deleteClient() {
    console.log('Cliente excluído:', this.client.id);
    this.navCtrl.navigateBack('/tabs/tab2');
  }

  // 👉 Abre a modal com a lista de vendas
  async openSalesList() {
    const modal = await this.modalCtrl.create({
      component: SalesListModalComponent,
      componentProps: { sales: this.sales }
    });

    await modal.present();
  }
}

@Component({
  selector: 'app-sales-list-modal',
  standalone: true, // importante!
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Vendas do cliente</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item *ngFor="let sale of sales">
          <ion-label>
            <h2>Venda #{{ sale.id }}</h2>
            <p>Produto: {{ sale.product }}</p>
            <p>Valor: {{ sale.value }}</p>
            <p>Data: {{ sale.date }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `
})
export class SalesListModalComponent {
  @Input() sales: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }
}
