import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.page.html',
  styleUrls: ['./client-details.page.scss'],
  standalone: false,
})
export class ClientDetailsPage implements OnInit {
  client: any = {};
  sales: any[] = [];
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    const clientId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadClient(clientId);
    this.loadSales(clientId);
  }

  loadClient(id: string) {
    // aqui você busca do backend ou service
    this.client = {
      id,
      name: 'Maria Souza',
      phone: '(51) 99999-0000',
      email: 'maria@email.com'
    };
  }

  loadSales(clientId: string) {
    // exemplo de vendas mockadas
    this.sales = [
      { id: 101, value: 'R$ 1.200,00' },
      { id: 102, value: 'R$ 800,00' },
    ];
  }

  enableEdit() {
    this.isEditing = true;
  }

  saveClient() {
    // aqui salvar no backend
    console.log('Cliente atualizado:', this.client);
    this.isEditing = false;
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Cliente',
      message: 'Tem certeza que deseja excluir este cliente?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: () => this.deleteClient()
        }
      ]
    });

    await alert.present();
  }

  deleteClient() {
    console.log('Cliente excluído:', this.client.id);
    this.navCtrl.navigateBack('/tabs/tab2');
  }
}
