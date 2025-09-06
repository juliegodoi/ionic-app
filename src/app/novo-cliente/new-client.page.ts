import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { ClientService, Client } from '../services/client.service';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.page.html',
  styleUrls: ['./new-client.page.scss'],
  standalone: false,
})
export class NewClientPage implements OnInit {

  client: Client = {
    nome: '',
    telefone: '',
    endereco: '',
    observacoes: ''
  };

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private clientService: ClientService
  ) { }

  ngOnInit() {
  }

  isFormValid(): boolean {
    return this.client.nome.trim() !== '' && this.client.telefone.trim() !== '';
  }

  async saveClient() {
    if (!this.isFormValid()) {
      await this.showToast('Por favor, preencha os campos obrigatórios', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Salvando cliente...',
      spinner: 'circular'
    });
    await loading.present();

    try {
      this.clientService.createClient(this.client).subscribe({
        next: async (createdClient) => {
          loading.dismiss();
          await this.showToast('Cliente salvo com sucesso!', 'success');
          console.log('Cliente criado:', createdClient);
          this.navCtrl.back();
        },
        error: async (error) => {
          loading.dismiss();
          await this.showToast('Erro ao salvar cliente', 'danger');
          console.error('Erro ao criar cliente:', error);
        }
      });
    } catch (error) {
      loading.dismiss();
      await this.showToast('Erro ao salvar cliente', 'danger');
      console.error('Erro:', error);
    }
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