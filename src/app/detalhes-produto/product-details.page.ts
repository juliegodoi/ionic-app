import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { ProductService, Product } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: false,
})
export class ProductDetailsPage implements OnInit {
  product: Product = {
    nome: '',
    preco: 0,
    unidades: 0,
    observacoes: ''
  };
  isEditing = false;
  originalProduct: Product = {
    nome: '',
    preco: 0,
    unidades: 0
  };

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private productService: ProductService
  ) { }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(parseInt(productId));
    }
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.originalProduct = { ...product };
      },
      error: () => {
        this.navCtrl.back();
      }
    });
  }

  enableEdit() {
    this.isEditing = true;
    this.originalProduct = { ...this.product };
  }

  cancelEdit() {
    this.product = { ...this.originalProduct };
    this.isEditing = false;
  }

  saveProduct() {
    if (!this.product.nome.trim() || this.product.preco === null || this.product.preco === undefined) {
      return;
    }

    this.productService.updateProduct(this.product.id!, this.product).subscribe({
      next: () => {
        this.isEditing = false;
        this.navCtrl.navigateBack('/tabs/tab3');
      },
      error: () => {
      }
    });
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
    this.productService.deleteProduct(this.product.id!).subscribe({
      next: () => {
        this.navCtrl.navigateBack('/tabs/tab3');
      },
      error: () => {
      }
    });
  }
}