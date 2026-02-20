import { Product, Sale, CartItem, CashFlow } from "./types";
import { products, sales, updateProducts, updateSales } from "./mockData";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    getProducts: async (): Promise<Product[]> => {
        await delay(300);
        return [...products];
    },

    getProduct: async (id: string): Promise<Product | undefined> => {
        await delay(100);
        return products.find(p => p.id === id);
    },

    updateProductStock: async (id: string, newStock: number): Promise<void> => {
        await delay(300);
        const updated = products.map(p => p.id === id ? { ...p, stock: newStock } : p);
        updateProducts(updated);
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

        // Deduct stock
        const updatedProducts = products.map(p => {
            const soldItem = items.find(i => i.id === p.id);
            if (soldItem) {
                return { ...p, stock: Math.max(0, p.stock - soldItem.quantity) };
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

        // Sum today's sales
        const totalSalesToday = sales
            .filter(s => s.timestamp.startsWith(today))
            .reduce((sum, s) => sum + s.totalAmount, 0);

        // Sum week's sales
        const totalSalesWeek = sales
            .filter(s => new Date(s.timestamp) >= oneWeekAgo)
            .reduce((sum, s) => sum + s.totalAmount, 0);

        return {
            totalSalesToday,
            totalSalesWeek,
            recentTransactions: [...sales].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5),
        };
    },

    addProduct: async (data: Omit<Product, "id">): Promise<Product> => {
        await delay(400);
        const newProduct: Product = {
            ...data,
            id: `p${Date.now()}`,
        };
        updateProducts([...products, newProduct]);
        return newProduct;
    },
};
