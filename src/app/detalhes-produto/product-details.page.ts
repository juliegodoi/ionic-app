import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: false,
})
export class ProductDetailsPage implements OnInit {
  product: any = {};
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadProduct(productId);
  }

  loadProduct(id: string) {
    const mockProducts = [
      { id: '1', name: 'Camiseta Branca P', price: '59.90', stock: 22, observations: 'Produto em algodão 100%, tamanho P' },
      { id: '2', name: 'Camiseta Branca M', price: '59.90', stock: 18, observations: 'Produto em algodão 100%, tamanho M' },
      { id: '3', name: 'Camiseta Branca G', price: '59.90', stock: 15, observations: 'Produto em algodão 100%, tamanho G' },
      { id: '4', name: 'Camiseta Branca GG', price: '59.90', stock: 12, observations: 'Produto em algodão 100%, tamanho GG' },
      { id: '5', name: 'Camiseta Preta P', price: '59.90', stock: 25, observations: 'Produto em algodão 100%, cor preta, tamanho P' },
      { id: '6', name: 'Camiseta Preta M', price: '59.90', stock: 20, observations: 'Produto em algodão 100%, cor preta, tamanho M' },
      { id: '7', name: 'Calça Jeans 38', price: '129.90', stock: 8, observations: 'Calça jeans tradicional, numeração 38' },
    ];

    const foundProduct = mockProducts.find(p => p.id === id);
    
    if (foundProduct) {
      this.product = { ...foundProduct };
    } else {
      this.product = {
        id,
        name: 'Produto não encontrado',
        price: '0.00',
        stock: 0,
        observations: ''
      };
    }
  }

  enableEdit() {
    this.isEditing = true;
  }

  saveProduct() {
    if (!this.product.name || !this.product.price) {
      this.showAlert('Erro', 'Nome e preço são obrigatórios!');
      return;
    }

    console.log('Produto atualizado:', this.product);
    
    this.showAlert('Sucesso', 'Produto atualizado com sucesso!');
    this.isEditing = false;
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Excluir produto',
      message: 'Tem certeza que deseja excluir este produto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: () => this.deleteProduct()
        }
      ]
    });

    await alert.present();
  }

  deleteProduct() {
    console.log('Produto excluído:', this.product.id);
    this.navCtrl.navigateBack('/tabs/tab3');
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}