import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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
    private clientService: ClientService
  ) { }

  ngOnInit() {
  }

  isFormValid(): boolean {
    return this.client.nome.trim() !== '' && this.client.telefone.trim() !== '';
  }

  saveClient() {
    if (!this.isFormValid()) {
      return;
    }
    this.clientService.createClient(this.client).subscribe({
      next: () => {
        this.navCtrl.navigateBack('/tabs/tab2');
      },
      error: () => {
      }
    });
  }
}