export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Sale {
    id: string;
    items: CartItem[];
    totalAmount: number;
    paymentMethod: "cash" | "card" | "qris";
    timestamp: string;
}

export interface CashFlow {
    totalSalesToday: number;
    totalSalesWeek: number;
    recentTransactions: Sale[];
}
