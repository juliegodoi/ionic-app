import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ClientService, Client } from '../services/client.service';

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
    private clientService: ClientService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.loadClient(parseInt(clientId));
      this.loadSales(clientId);
    }
  }

  async loadClient(id: number) {
    const loading = await this.loadingController.create({
      message: 'Carregando cliente...',
      spinner: 'circular'
    });
    await loading.present();

    try {
      this.clientService.getClientById(id).subscribe({
        next: (client) => {
          this.client = client;
          this.originalClient = { ...client }; // Backup para cancelar edição
          loading.dismiss();
        },
        error: async (error) => {
          loading.dismiss();
          await this.showToast('Erro ao carregar cliente', 'danger');
          console.error('Erro ao carregar cliente:', error);
          this.navCtrl.back();
        }
      });
    } catch (error) {
      loading.dismiss();
      await this.showToast('Erro ao carregar cliente', 'danger');
      console.error('Erro:', error);
      this.navCtrl.back();
    }
  }

  loadSales(clientId: string) {
    // Mantém os dados mockados das vendas por enquanto
    this.sales = [
      { id: 101, product: 'Produto A', value: 'R$ 1.200,00', date: '01/09/2023' },
      { id: 102, product: 'Produto B', value: 'R$ 800,00', date: '05/09/2023' },
    ];
  }

  enableEdit() {
    this.isEditing = true;
    this.originalClient = { ...this.client }; // Backup dos dados originais
  }

  cancelEdit() {
    this.client = { ...this.originalClient }; // Restaura dados originais
    this.isEditing = false;
  }

  async saveClient() {
    if (!this.client.nome.trim() || !this.client.telefone.trim()) {
      await this.showToast('Nome e telefone são obrigatórios', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Salvando alterações...',
      spinner: 'circular'
    });
    await loading.present();

    try {
      this.clientService.updateClient(this.client.id!, this.client).subscribe({
        next: async (updatedClient) => {
          loading.dismiss();
          this.client = updatedClient;
          this.originalClient = { ...updatedClient };
          this.isEditing = false;
          await this.showToast('Cliente atualizado com sucesso!', 'success');
        },
        error: async (error) => {
          loading.dismiss();
          await this.showToast('Erro ao atualizar cliente', 'danger');
          console.error('Erro ao atualizar cliente:', error);
        }
      });
    } catch (error) {
      loading.dismiss();
      await this.showToast('Erro ao atualizar cliente', 'danger');
      console.error('Erro:', error);
    }
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

  async deleteClient() {
    const loading = await this.loadingController.create({
      message: 'Excluindo cliente...',
      spinner: 'circular'
    });
    await loading.present();

    try {
      this.clientService.deleteClient(this.client.id!).subscribe({
        next: async () => {
          loading.dismiss();
          await this.showToast('Cliente excluído com sucesso!', 'success');
          this.navCtrl.navigateBack('/tabs/tab2');
        },
        error: async (error) => {
          loading.dismiss();
          await this.showToast('Erro ao excluir cliente', 'danger');
          console.error('Erro ao excluir cliente:', error);
        }
      });
    } catch (error) {
      loading.dismiss();
      await this.showToast('Erro ao excluir cliente', 'danger');
      console.error('Erro:', error);
    }
  }

  async openSalesList() {
    const modal = await this.modalCtrl.create({
      component: SalesListModalComponent,
      componentProps: { sales: this.sales }
    });

    await modal.present();
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color
    });
    await toast.present();
  }
}

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