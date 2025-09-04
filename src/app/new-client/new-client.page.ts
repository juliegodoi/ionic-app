import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.page.html',
  styleUrls: ['./new-client.page.scss'],
  standalone: false,
})
export class NewClientPage implements OnInit {

  client = {
    name: '',
    phone: '',
    address: '',
    observations: ''
  };

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  // Verificar se o formulário é válido
  isFormValid(): boolean {
    return this.client.name.trim() !== '' && this.client.phone.trim() !== '';
  }

  // Salvar cliente
  async saveClient() {
    if (!this.isFormValid()) {
      await this.showToast('Por favor, preencha os campos obrigatórios', 'warning');
      return;
    }

    try {
      // Aqui você implementaria a lógica de salvar no banco/API
      console.log('Cliente a ser salvo:', this.client);
      
      // Simular salvamento
      await this.showToast('Cliente salvo com sucesso!', 'success');
      
      // Voltar para a lista de clientes
      this.navCtrl.back();
      
    } catch (error) {
      await this.showToast('Erro ao salvar cliente', 'danger');
      console.error('Erro:', error);
    }
  }

  // Mostrar mensagem toast
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