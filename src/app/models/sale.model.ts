import { Client } from '../services/client.service';
import { Product } from '../services/product.service';

export interface SaleProduct {
    id: number;
    unidades?: number;
}

export interface Sale {
    id?: number;
    cliente: Client;
    produtos: Product[];
    condicoes?: string;
    formaPagamento: string;
    totalValue: number;
    date: string;
}

export interface BackendSale {
    cliente: {
        id: number;
    };
    produtos: SaleProduct[];
    condicoes?: string;
    formaPagamento: string;
}

export interface SalesGroup {
    date: string;
    sales: Sale[];
}