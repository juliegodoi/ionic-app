import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
    id?: number;
    nome: string;
    telefone: string;
    endereco?: string;
    observacoes?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private readonly API_URL = 'http://localhost:8080/clientes';

    constructor(private http: HttpClient) { }

    // GET - Listar todos os clientes
    getAllClients(): Observable<Client[]> {
        return this.http.get<Client[]>(this.API_URL);
    }

    // GET - Buscar cliente por ID
    getClientById(id: number): Observable<Client> {
        return this.http.get<Client>(`${this.API_URL}/${id}`);
    }

    // GET - Buscar cliente por nome
    getClientByName(nome: string): Observable<Client[]> {
        return this.http.get<Client[]>(`${this.API_URL}/consultarnome?nome=${encodeURIComponent(nome)}`);
    }

    // POST - Criar novo cliente
    createClient(client: Client): Observable<Client> {
        return this.http.post<Client>(this.API_URL, client);
    }

    // PUT - Atualizar cliente
    updateClient(id: number, client: Client): Observable<Client> {
        return this.http.put<Client>(`${this.API_URL}/${id}`, client);
    }

    // DELETE - Remover cliente
    deleteClient(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}