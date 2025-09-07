import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService, Client } from '../services/client.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit, OnDestroy {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  private clientsSubscription?: Subscription;

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  ngOnDestroy() {
    if (this.clientsSubscription) {
      this.clientsSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.loadClients();
  }

  private loadClients() {
    this.clientsSubscription = this.clientService.clients$.subscribe(
      (clients) => {
        this.clients = clients;
        this.filteredClients = [...clients];
      }
    );
    this.clientService.getAllClients().subscribe(
      (clients) => {
        this.clients = clients;
        this.filteredClients = [...clients];
      }
    );
  }

  searchClients(event: any) {
    const searchTerm = event.target.value?.toLowerCase() || '';
    if (searchTerm.trim() === '') {
      this.filteredClients = [...this.clients];
    } else {
      this.filteredClients = this.clients.filter(client =>
        client.nome.toLowerCase().includes(searchTerm) ||
        client.telefone.includes(searchTerm)
      );
    }
  }

  openClientDetails(client: Client) {
    this.router.navigate(['/client-details', client.id]);
  }

  addNewClient() {
    this.router.navigate(['/new-client']);
  }
}