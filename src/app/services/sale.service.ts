import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, switchMap, forkJoin } from 'rxjs';
import { Sale, BackendSale } from '../models/sale.model';
import { Client, ClientService } from './client.service';
import { Product, ProductService } from './product.service';

@Injectable({
    providedIn: 'root'
})
export class SaleService {
    private apiUrl = 'http://localhost:8080/vendas';
    private _sales = new BehaviorSubject<Sale[]>([]);
    public sales$ = this._sales.asObservable();

    constructor(
        private http: HttpClient,
        private clientService: ClientService,
        private productService: ProductService
    ) { }

    getAllSales(): Observable<Sale[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
            switchMap(backendSales => {
                if (!backendSales || backendSales.length === 0) {
                    return of([]);
                }
                const salesWithDetails = backendSales.map(sale => this.getSaleDetailsFromBackend(sale));
                return forkJoin(salesWithDetails);
            }),
            tap(sales => {
                this._sales.next(sales);
            }),
            catchError(() => this._sales.asObservable())
        );
    }

    getSaleById(id: number): Observable<Sale | undefined> {
        const cachedSale = this._sales.value.find(s => s.id === id);
        if (cachedSale) {
            return of(cachedSale);
        }
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            switchMap(backendSale => this.getSaleDetailsFromBackend(backendSale)),
            catchError(() => of(undefined))
        );
    }

    createSale(newSale: BackendSale): Observable<Sale> {
        const optimisticSale: Sale = {
            id: Date.now(),
            cliente: this.clientService.getClientsCache().find((c: Client) => c.id === newSale.cliente.id)!,
            produtos: this.productService.getProductsCache().filter((p: Product) => newSale.produtos.some(sp => sp.id === p.id)),
            condicoes: newSale.condicoes,
            formaPagamento: newSale.formaPagamento,
            date: new Date().toLocaleDateString('pt-BR'),
            totalValue: 0
        };
        optimisticSale.totalValue = optimisticSale.produtos.reduce((sum, p) => sum + p.preco, 0);

        this.addSaleToCache(optimisticSale);

        return this.http.post<any>(this.apiUrl, newSale).pipe(
            switchMap(savedSale => this.getSaleDetailsFromBackend(savedSale)),
            tap(savedSale => this.updateSaleInCache(optimisticSale.id!, savedSale)),
            catchError(error => {
                this.removeSaleFromCache(optimisticSale.id!);
                return of(error);
            })
        );
    }

    updateSale(id: number, updatedSale: BackendSale): Observable<any> {
        const originalSales = this._sales.value;
        const originalSale = originalSales.find(s => s.id === id);

        if (!originalSale) {
            return of(null);
        }

        const optimisticUpdate: Sale = {
            ...originalSale,
            condicoes: updatedSale.condicoes,
            formaPagamento: updatedSale.formaPagamento,
            date: new Date().toLocaleDateString('pt-BR')
        };

        this.updateSaleInCache(id, optimisticUpdate);

        return this.http.put(`${this.apiUrl}/${id}`, updatedSale).pipe(
            tap(() => this.getAllSales().subscribe()),
            catchError(error => {
                if (originalSale) {
                    this.updateSaleInCache(id, originalSale);
                }
                return of(error);
            })
        );
    }

    deleteSale(id: number, saleBody: { cliente: { id: number }, produtos: { id: number }[] }): Observable<any> {
        const originalSales = this._sales.value;
        const saleToDelete = originalSales.find(s => s.id === id);
        if (!saleToDelete) {
            return of(null);
        }
        this.removeSaleFromCache(id);
        return this.http.request('delete', `${this.apiUrl}/${id}`, { body: saleBody }).pipe(
            catchError(error => {
                this.addSaleToCache(saleToDelete);
                return of(error);
            })
        );
    }

    private getSaleDetailsFromBackend(sale: any): Observable<Sale> {
        const client$ = this.clientService.getClientById(sale.cliente.id);
        const productRequests = (sale.produtos || []).map((p: any) => this.productService.getProductById(p.id));

        return forkJoin({
            cliente: client$,
            produtos: forkJoin(productRequests) as Observable<Product[]>
        }).pipe(
            switchMap(details => {
                const detailedSale: Sale = {
                    ...sale,
                    cliente: details.cliente,
                    produtos: details.produtos,
                    totalValue: details.produtos.reduce((sum, p) => sum + p.preco, 0),
                    date: new Date(sale.date).toLocaleDateString('pt-BR')
                };
                return of(detailedSale);
            })
        );
    }

    private addSaleToCache(sale: Sale) {
        const currentSales = this._sales.value;
        this._sales.next([...currentSales, sale]);
    }

    private updateSaleInCache(oldId: number, newSale: Sale) {
        const currentSales = this._sales.value.map(s => (s.id === oldId ? newSale : s));
        this._sales.next(currentSales);
    }

    private removeSaleFromCache(id: number) {
        const currentSales = this._sales.value.filter(s => s.id !== id);
        this._sales.next(currentSales);
    }
}