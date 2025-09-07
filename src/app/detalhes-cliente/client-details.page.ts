import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ModalController, IonicModule } from '@ionic/angular';
import { ClientService, Client } from '../services/client.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-list-modal',
  standalone: true,
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

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.page.html',
  styleUrls: ['./client-details.page.scss'],
  standalone: false,
})
export class ClientDetailsPage implements OnInit {
  client: Client = {
    nome: '',
    telefone: '',
    endereco: '',
    observacoes: ''
  };
  sales: any[] = [];
  isEditing = false;
  originalClient: Client = {
    nome: '',
    telefone: ''
  };

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.loadClient(parseInt(clientId));
      this.loadSales(clientId);
    }
  }

  loadClient(id: number) {
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        this.client = client;
        this.originalClient = { ...client };
      },
      error: () => {
        this.navCtrl.back();
      }
    });
  }

  loadSales(clientId: string) {
    this.sales = [
      { id: 101, product: 'Produto A', value: 'R$ 1.200,00', date: '01/09/2023' },
      { id: 102, product: 'Produto B', value: 'R$ 800,00', date: '05/09/2023' },
    ];
  }

  enableEdit() {
    this.isEditing = true;
    this.originalClient = { ...this.client };
  }

  cancelEdit() {
    this.client = { ...this.originalClient };
    this.isEditing = false;
  }

  saveClient() {
    if (!this.client.nome.trim() || !this.client.telefone.trim()) {
      return;
    }
    this.clientService.updateClient(this.client.id!, this.client).subscribe({
      next: () => {
        this.isEditing = false;
        this.navCtrl.navigateBack('/tabs/tab2');
      },
      error: () => {
      }
    });
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
    this.clientService.deleteClient(this.client.id!).subscribe({
      next: () => {
        this.navCtrl.navigateBack('/tabs/tab2');
      },
      error: () => {
      }
    });
  }

  async openSalesList() {
    const modal = await this.modalCtrl.create({
      component: SalesListModalComponent,
      componentProps: { sales: this.sales }
    });
    await modal.present();
  }
}