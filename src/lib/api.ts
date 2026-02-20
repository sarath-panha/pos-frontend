import { Product, Sale, CartItem, CashFlow } from "./types";
import { products, sales, updateProducts, updateSales } from "./mockData";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    getProducts: async (): Promise<Product[]> => {
        await delay(300);
        return [...products.filter(p => p.is_active)];
    },

    getProduct: async (id: string): Promise<Product | undefined> => {
        await delay(100);
        return products.find(p => p.id === id);
    },

    updateProductQty: async (id: string, newQty: number): Promise<void> => {
        await delay(300);
        const updated = products.map(p =>
            p.id === id
                ? { ...p, qty: newQty, updated_at: new Date().toISOString() }
                : p
        );
        updateProducts(updated);
    },

    addProduct: async (data: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product> => {
        await delay(400);
        const ts = new Date().toISOString();
        const newProduct: Product = {
            ...data,
            id: `p${Date.now()}`,
            created_at: ts,
            updated_at: ts,
        };
        updateProducts([...products, newProduct]);
        return newProduct;
    },

    createSale: async (items: CartItem[], paymentMethod: Sale["paymentMethod"]): Promise<Sale> => {
        await delay(500);
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const newSale: Sale = {
            id: `s${Date.now()}`,
            items,
            totalAmount,
            paymentMethod,
            timestamp: new Date().toISOString(),
        };

        // Deduct qty
        const updatedProducts = products.map(p => {
            const soldItem = items.find(i => i.id === p.id);
            if (soldItem) {
                return { ...p, qty: Math.max(0, p.qty - soldItem.quantity), updated_at: new Date().toISOString() };
            }
            return p;
        });

        updateProducts(updatedProducts);
        updateSales([newSale, ...sales]);
        return newSale;
    },

    getCashFlow: async (): Promise<CashFlow> => {
        await delay(400);
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const totalSalesToday = sales
            .filter(s => s.timestamp.startsWith(today))
            .reduce((sum, s) => sum + s.totalAmount, 0);

        const totalSalesWeek = sales
            .filter(s => new Date(s.timestamp) >= oneWeekAgo)
            .reduce((sum, s) => sum + s.totalAmount, 0);

        return {
            totalSalesToday,
            totalSalesWeek,
            recentTransactions: [...sales]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 5),
        };
    },
};
