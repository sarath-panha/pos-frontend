export interface Product {
    id: string;
    name: string;
    description?: string;
    category: string;
    sku?: string;           // stock keeping unit
    barcode?: string;        // EAN-13, QR code, Code-128, etc.
    price: number;          // selling price
    cost?: number;          // purchase/cost price
    qty: number;            // current stock quantity
    low_stock_level: number; // alert threshold (default 5)
    unit: string;           // pcs, kg, liter, gram, box, pack, bottle
    expiry_date?: string;   // ISO date string
    supplier?: string;
    imageUrl?: string;
    is_active: boolean;
    created_at: string;     // ISO datetime
    updated_at: string;     // ISO datetime
}

export interface CartItem extends Product {
    quantity: number;  // quantity in cart (separate from qty/stock)
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
