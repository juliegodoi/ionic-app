import { Client } from '../services/client.service';
import { Product } from '../services/product.service';

export interface SaleProduct {
    id: number;
    unidades?: number;
}

export interface Payment {
    id?: number;
    valor: number;
    formaPagamento: string;
    observacoes?: string;
    date?: string;
}

export interface Sale {
    id?: number;
    cliente: Client;
    produtos: Product[];
    condicoes?: string;
    formaPagamento: string;
    totalValue: number;
    date: string;
    paidValue: number;
    payments?: Payment[];
}

export interface BackendSale {
    cliente: {
        id: number;
    };
    produtos: SaleProduct[];
    condicoes?: string;
    formaPagamento: string;
    date: string;
}

export interface SalesGroup {
    date: string;
    sales: Sale[];
}