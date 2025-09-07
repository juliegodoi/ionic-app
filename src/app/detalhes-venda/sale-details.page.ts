import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ModalController, IonicModule } from '@ionic/angular';
import { SaleService } from '../services/sale.service';
import { Sale, BackendSale } from '../models/sale.model';
import { Product } from '../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-list-modal',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Produtos da venda</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item *ngFor="let product of products">
          <ion-label>
            <h2>{{ product.nome }}</h2>
            <p>Valor unitário: R$ {{ product.preco?.toFixed(2) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-item lines="none" style="margin-top: 16px; --background: var(--ion-color-light);">
        <ion-label>
          <h2><strong>TOTAL: R$ {{ getTotalValue().toFixed(2) }}</strong></h2>
        </ion-label>
      </ion-item>
    </ion-content>
  `,
})
export class ProductsListModalComponent {
  @Input() products: Product[] = [];

  constructor(private modalCtrl: ModalController) { }

  getTotalValue(): number {
    return this.products.reduce((total, item) => total + (item.preco), 0);
  }

  close() {
    this.modalCtrl.dismiss();
  }
}

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.page.html',
  styleUrls: ['./sale-details.page.scss'],
  standalone: false,
})
export class SaleDetailsPage implements OnInit {
  sale: Sale | undefined;
  isEditing: boolean = false;
  draftSale: any;
  paymentOptions: string[] = ['cartao_debito', 'cartao_credito', 'dinheiro', 'pix'];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private saleService: SaleService,
  ) { }

  ngOnInit() {
    this.loadSale();
  }

  loadSale() {
    const saleId = this.route.snapshot.paramMap.get('id');
    if (saleId) {
      this.saleService.getSaleById(parseInt(saleId)).subscribe(sale => {
        this.sale = sale;
        this.draftSale = sale ? { ...sale } : undefined;
      });
    }
  }

  getTotalValue(): number {
    return this.sale?.produtos?.reduce((total, item) => total + (item.preco), 0) || 0;
  }

  enableEdit() {
    this.isEditing = true;
    this.draftSale = { ...this.sale };
  }

  cancelEdit() {
    if (this.sale) {
      this.draftSale = { ...this.sale };
    }
    this.isEditing = false;
  }

  async saveSale() {
    if (!this.draftSale || !this.draftSale.cliente.nome || !this.draftSale.formaPagamento) {
      return;
    }

    const saleToSend: BackendSale = {
      cliente: { id: this.draftSale.cliente.id! },
      produtos: this.draftSale.produtos.map((p: any) => ({ id: p.id!, unidades: 1 })),
      condicoes: this.draftSale.condicoes,
      formaPagamento: this.draftSale.formaPagamento,
      date: this.sale?.date!
    };

    this.saleService.updateSale(this.draftSale.id!, saleToSend).subscribe({
      next: () => {
        this.isEditing = false;
        // Redireciona após salvar
        this.navCtrl.navigateBack('/tabs/tab4');
      },
      error: () => { }
    });
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Venda',
      message: 'Tem certeza que deseja excluir esta venda?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: () => this.deleteSale(),
        },
      ],
    });
    await alert.present();
  }

  deleteSale() {
    if (this.sale?.id) {
      const deleteBody = {
        cliente: { id: this.sale.cliente.id! },
        produtos: this.sale.produtos.map(p => ({ id: p.id! })),
      };

      this.saleService.deleteSale(this.sale.id, deleteBody).subscribe({
        next: () => {
          this.navCtrl.navigateBack('/tabs/tab4');
        },
        error: () => { }
      });
    }
  }

  async openProductsList() {
    if (!this.sale || !this.sale.produtos) {
      return;
    }
    const modalProducts = this.sale.produtos.map(p => ({
      nome: p.nome,
      preco: p.preco
    }));

    const modal = await this.modalCtrl.create({
      component: ProductsListModalComponent,
      componentProps: { products: modalProducts },
    });
    await modal.present();
  }
}