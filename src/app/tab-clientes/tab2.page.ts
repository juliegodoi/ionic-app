import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {


clients = [
  { id: 1, name: 'Maria Silva', phone: '(11) 98765-4321' },
  { id: 2, name: 'João Santos', phone: '(11) 98765-4322' },
  { id: 3, name: 'Ana Costa', phone: '(11) 98765-4323' },
  { id: 4, name: 'Pedro Lima', phone: '(11) 98765-4324' },
  { id: 5, name: 'Carla Oliveira', phone: '(11) 98765-4325' },
];

filteredClients = [...this.clients];

  constructor(private navCtrl: NavController) { 
    this.filteredClients = this.clients;
  }

searchClients(event: any) {
  const searchTerm = event.target.value.toLowerCase();
  
  if (searchTerm.trim() === '') {
    this.filteredClients = this.clients;
  } else {
    this.filteredClients = this.clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm) ||
      client.phone.includes(searchTerm)
    );
  }
}

openClientDetails(client: any) {
  this.navCtrl.navigateForward(`/client-details/${client.id}`);
}

  addNewClient() {
    this.navCtrl.navigateForward('/new-client');
  }

}
