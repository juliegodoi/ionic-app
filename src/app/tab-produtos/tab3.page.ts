import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ProductService, Product } from '../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  private productsSubscription?: Subscription;

  constructor(
    private navCtrl: NavController,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  ngOnDestroy() {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.loadProducts();
  }

  private loadProducts() {
    this.productsSubscription = this.productService.products$.subscribe(
      (products) => {
        this.products = products;
        this.filteredProducts = [...products];
      }
    );
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.products = products;
        this.filteredProducts = [...products];
      }
    );
  }

  searchProducts(event: any) {
    const searchTerm = event.target.value?.toLowerCase() || '';
    if (searchTerm.trim() === '') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.nome.toLowerCase().includes(searchTerm) ||
        product.preco.toString().includes(searchTerm)
      );
    }
  }

  openProductDetails(product: Product) {
    this.navCtrl.navigateForward(`/product-details/${product.id}`);
  }

  addNewProduct() {
    this.navCtrl.navigateForward('/new-product');
  }
}