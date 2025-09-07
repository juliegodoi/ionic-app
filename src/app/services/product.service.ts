// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Product {
    id?: number;
    nome: string;
    preco: number;
    unidades: number;
    observacoes?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly API_URL = 'http://localhost:8080/produtos';

    private productsCache: Product[] = [];
    private cacheLoaded = false;

    private productsSubject = new BehaviorSubject<Product[]>([]);
    public products$ = this.productsSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadInitialData();
    }

    private loadInitialData() {
        this.http.get<Product[]>(this.API_URL).subscribe({
            next: (products) => {
                this.productsCache = products.map(p => ({
                    ...p,
                    preco: parseFloat(p.preco as any)
                }));
                this.cacheLoaded = true;
                this.productsSubject.next([...this.productsCache]);
            },
            error: () => {
                this.cacheLoaded = true;
                this.productsSubject.next([]);
            }
        });
    }

    getAllProducts(): Observable<Product[]> {
        if (this.cacheLoaded) {
            return of([...this.productsCache]);
        } else {
            return this.products$;
        }
    }

    public getProductsCache(): Product[] {
        return this.productsCache;
    }

    getProductById(id: number): Observable<Product> {
        const cachedProduct = this.productsCache.find(product => product.id === id);

        if (cachedProduct) {
            return of({ ...cachedProduct });
        } else {
            return this.http.get<Product>(`${this.API_URL}/${id}`).pipe(
                tap(product => {
                    const index = this.productsCache.findIndex(p => p.id === id);
                    if (index === -1) {
                        this.productsCache.push({
                            ...product,
                            preco: parseFloat(product.preco as any)
                        });
                        this.productsSubject.next([...this.productsCache]);
                    }
                })
            );
        }
    }

    getProductByName(nome: string): Observable<Product[]> {
        if (this.cacheLoaded) {
            const filteredProducts = this.productsCache.filter(product =>
                product.nome.toLowerCase().includes(nome.toLowerCase())
            );
            return of(filteredProducts);
        } else {
            return this.http.get<Product[]>(`${this.API_URL}/consultarnome?nome=${encodeURIComponent(nome)}`).pipe(
                tap(products => {
                    return products.map(p => ({ ...p, preco: parseFloat(p.preco as any) }))
                })
            );
        }
    }

    createProduct(product: Product): Observable<Product> {
        const productToSend = {
            ...product,
            preco: product.preco.toFixed(2)
        };
        return this.http.post<Product>(this.API_URL, productToSend).pipe(
            tap(newProduct => {
                this.productsCache.push({ ...newProduct, preco: parseFloat(newProduct.preco as any) });
                this.productsSubject.next([...this.productsCache]);
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    }

    updateProduct(id: number, product: Product): Observable<Product> {
        const productToSend = {
            ...product,
            preco: product.preco.toFixed(2)
        };
        return this.http.put<Product>(`${this.API_URL}/${id}`, productToSend).pipe(
            tap(updatedProduct => {
                const index = this.productsCache.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.productsCache[index] = { ...updatedProduct, preco: parseFloat(updatedProduct.preco as any) };
                    this.productsSubject.next([...this.productsCache]);
                }
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
            tap(() => {
                const index = this.productsCache.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.productsCache.splice(index, 1);
                    this.productsSubject.next([...this.productsCache]);
                }
            }),
            catchError(error => {
                return throwError(error);
            })
        );
    }
}