import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { SaleService } from '../services/sale.service';
import { Sale, BackendSale } from '../models/sale.model';
import { Client, ClientService } from '../services/client.service';
import { Product, ProductService } from '../services/product.service';

@Component({
  selector: 'app-new-sale',
  templateUrl: './new-sale.page.html',
  styleUrls: ['./new-sale.page.scss'],
  standalone: false,
})
export class NewSalePage implements OnInit {
  sale: Sale = {
    cliente: { id: 0, nome: '', telefone: '' },
    produtos: [],
    formaPagamento: '',
    condicoes: '',
    totalValue: 0,
    date: new Date().toLocaleDateString('pt-BR'),
  };

  constructor(
    private navCtrl: NavController,
    private saleService: SaleService,
    private alertController: AlertController,
    private clientService: ClientService,
    private productService: ProductService,
  ) { }

  ngOnInit() { }

  isFormValid(): boolean {
    return !!this.sale.cliente.id && this.sale.produtos.length > 0 && !!this.sale.formaPagamento;
  }

  async selectClient() {
    this.clientService.getAllClients().subscribe(async clients => {
      const alert = await this.alertController.create({
        header: 'Selecionar cliente',
        inputs: clients.map(client => ({
          type: 'radio',
          label: client.nome,
          value: client,
          checked: this.sale.cliente.id === client.id,
        })),
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Selecionar',
            handler: (selectedClient: Client) => {
              this.sale.cliente = selectedClient;
            },
          },
        ],
      });
      await alert.present();
    });
  }

  async selectProducts() {
    this.productService.getAllProducts().subscribe(async products => {
      const alert = await this.alertController.create({
        header: 'Selecionar produtos',
        inputs: products.map(product => ({
          type: 'checkbox',
          label: `${product.nome} - R$ ${product.preco.toFixed(2)}`,
          value: product,
          checked: this.sale.produtos.some(p => p.id === product.id),
        })),
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Selecionar',
            handler: (selectedProducts: Product[]) => {
              this.sale.produtos = selectedProducts || [];
              this.calculateTotal();
            },
          },
        ],
      });
      await alert.present();
    });
  }

  calculateTotal() {
    this.sale.totalValue = this.sale.produtos.reduce((sum, p) => sum + p.preco, 0);
  }

  async saveSale() {
    if (!this.isFormValid()) {
      return;
    }

    const saleToSend: BackendSale = {
      cliente: { id: this.sale.cliente.id! },
      produtos: this.sale.produtos.map(p => ({ id: p.id!, unidades: 1 })),
      condicoes: this.sale.condicoes,
      formaPagamento: this.sale.formaPagamento,
      date: new Date().toISOString()
    };

    this.saleService.createSale(saleToSend as any).subscribe({
      next: () => {
        this.navCtrl.navigateBack('/tabs/tab4');
      }
    });
  }
}