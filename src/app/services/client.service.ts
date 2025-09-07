import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

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
    
    private clientsCache: Client[] = [];
    private cacheLoaded = false;
    
    private clientsSubject = new BehaviorSubject<Client[]>([]);
    public clients$ = this.clientsSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadInitialData();
    }

    private loadInitialData() {
        this.http.get<Client[]>(this.API_URL).subscribe({
            next: (clients) => {
                this.clientsCache = clients;
                this.cacheLoaded = true;
                this.clientsSubject.next([...this.clientsCache]);
            },
            error: (error) => {
                console.error('Erro ao carregar dados iniciais:', error);
                this.cacheLoaded = true; 
                this.clientsSubject.next([]);
            }
        });
    }

    getAllClients(): Observable<Client[]> {
        if (this.cacheLoaded) {
            return of([...this.clientsCache]);
        } else {
            return this.clients$;
        }
    }

    getClientById(id: number): Observable<Client> {
        const cachedClient = this.clientsCache.find(client => client.id === id);
        
        if (cachedClient) {
            return of({ ...cachedClient });
        } else {
            return this.http.get<Client>(`${this.API_URL}/${id}`).pipe(
                tap(client => {
                    const index = this.clientsCache.findIndex(c => c.id === id);
                    if (index === -1) {
                        this.clientsCache.push(client);
                        this.clientsSubject.next([...this.clientsCache]);
                    }
                })
            );
        }
    }

    getClientByName(nome: string): Observable<Client[]> {
        if (this.cacheLoaded) {
            const filteredClients = this.clientsCache.filter(client => 
                client.nome.toLowerCase().includes(nome.toLowerCase())
            );
            return of(filteredClients);
        } else {
            return this.http.get<Client[]>(`${this.API_URL}/consultarnome?nome=${encodeURIComponent(nome)}`);
        }
    }

    createClient(client: Client): Observable<Client> {
        return this.http.post<Client>(this.API_URL, client).pipe(
            tap(newClient => {
                this.clientsCache.push(newClient);
                this.clientsSubject.next([...this.clientsCache]);
            }),
            catchError(error => {
                console.error('Erro ao criar cliente:', error);
                return throwError(error);
            })
        );
    }

    updateClient(id: number, client: Client): Observable<Client> {
        return this.http.put<Client>(`${this.API_URL}/${id}`, client).pipe(
            tap(updatedClient => {
                const index = this.clientsCache.findIndex(c => c.id === id);
                if (index !== -1) {
                    this.clientsCache[index] = updatedClient;
                    this.clientsSubject.next([...this.clientsCache]);
                }
            }),
            catchError(error => {
                console.error('Erro ao atualizar cliente:', error);
                return throwError(error);
            })
        );
    }

    deleteClient(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
            tap(() => {
                const index = this.clientsCache.findIndex(c => c.id === id);
                if (index !== -1) {
                    this.clientsCache.splice(index, 1);
                    this.clientsSubject.next([...this.clientsCache]);
                }
            }),
            catchError(error => {
                console.error('Erro ao excluir cliente:', error);
                return throwError(error);
            })
        );
    }

    refreshCache(): void {
        this.http.get<Client[]>(this.API_URL).subscribe({
            next: (clients) => {
                this.clientsCache = clients;
                this.clientsSubject.next([...this.clientsCache]);
            },
            error: (error) => {
                console.error('Erro ao atualizar cache:', error);
            }
        });
    }

    get isCacheLoaded(): boolean {
        return this.cacheLoaded;
    }
}