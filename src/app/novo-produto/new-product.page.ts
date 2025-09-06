import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.page.html',
  styleUrls: ['./new-product.page.scss'],
  standalone: false,
})
export class NewProductPage implements OnInit {

  product = {
    title: '',
    value: '',
    stock: '',
    observations: ''
  };

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  isFormValid(): boolean {
    return (
      this.product.title.trim() !== '' &&
      this.product.value.toString().trim() !== '' &&
      this.product.stock.toString().trim() !== ''
    );
  }

  async saveProduct() {
    if (!this.isFormValid()) {
      await this.showToast('Por favor, preencha os campos obrigatórios', 'warning');
      return;
    }

    try {
      console.log('Produto a ser salvo:', this.product);

      await this.showToast('Produto salvo com sucesso!', 'success');

      this.navCtrl.back();

    } catch (error) {
      await this.showToast('Erro ao salvar produto', 'danger');
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