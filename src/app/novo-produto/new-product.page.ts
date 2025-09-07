import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ProductService, Product } from '../services/product.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.page.html',
  styleUrls: ['./new-product.page.scss'],
  standalone: false,
})
export class NewProductPage implements OnInit {
  product: Omit<Product, 'id'> = {
    nome: '',
    preco: 0,
    unidades: 0,
    observacoes: ''
  };

  constructor(
    private navCtrl: NavController,
    private productService: ProductService
  ) { }

  ngOnInit() {
  }

  isFormValid(): boolean {
    return (
      this.product.nome.trim() !== '' &&
      this.product.preco !== null &&
      this.product.preco >= 0 &&
      this.product.unidades !== null &&
      this.product.unidades >= 0
    );
  }

  saveProduct() {
    if (!this.isFormValid()) {
      return;
    }

    this.productService.createProduct(this.product as Product).subscribe({
      next: () => {
        this.navCtrl.navigateBack('/tabs/tab3');
      },
      error: () => {
      }
    });
  }
}