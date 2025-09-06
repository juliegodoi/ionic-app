import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { ClientService, Client } from '../services/client.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  private searchTimeout: any;

  constructor(
    private navCtrl: NavController,
    private clientService: ClientService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.loadClients();
  }

  ionViewWillEnter() {
    // Recarrega a lista sempre que a tela for exibida
    this.loadClients();
  }

  async loadClients() {
    const loading = await this.loadingController.create({
      message: 'Carregando clientes...',
      spinner: 'circular'
    });
    await loading.present();

    try {
      this.clientService.getAllClients().subscribe({
        next: (clients) => {
          this.clients = clients;
          this.filteredClients = [...this.clients];
          loading.dismiss();
        },
        error: async (error) => {
          loading.dismiss();
          await this.showToast('Erro ao carregar clientes', 'danger');
          console.error('Erro ao carregar clientes:', error);
        }
      });
    } catch (error) {
      loading.dismiss();
      await this.showToast('Erro ao carregar clientes', 'danger');
      console.error('Erro:', error);
    }
  }

  searchClients(event: any) {
    const searchTerm = event.target.value.toLowerCase().trim();

    // Limpa timeout anterior
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (searchTerm === '') {
      this.filteredClients = [...this.clients];
      return;
    }

    // Delay para evitar muitas requisições
    this.searchTimeout = setTimeout(() => {
      this.performSearch(searchTerm);
    }, 500);
  }

  private async performSearch(searchTerm: string) {
    try {
      this.clientService.getClientByName(searchTerm).subscribe({
        next: (clients) => {
          this.filteredClients = clients;
        },
        error: (error) => {
          // Se der erro na busca por nome, faz busca local
          this.filteredClients = this.clients.filter(client =>
            client.nome.toLowerCase().includes(searchTerm) ||
            client.telefone.includes(searchTerm)
          );
          console.warn('Busca por API falhou, usando busca local:', error);
        }
      });
    } catch (error) {
      // Fallback para busca local
      this.filteredClients = this.clients.filter(client =>
        client.nome.toLowerCase().includes(searchTerm) ||
        client.telefone.includes(searchTerm)
      );
    }
  }

  openClientDetails(client: Client) {
    this.navCtrl.navigateForward(`/client-details/${client.id}`);
  }

  addNewClient() {
    this.navCtrl.navigateForward('/new-client');
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