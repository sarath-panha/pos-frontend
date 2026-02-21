import { Product, Sale, CartItem, CashFlow, Category } from "./types";
import { products, sales, updateProducts, updateSales, categories, updateCategories } from "./mockData";
import { slugify, ensureUniqueSlug } from "./slugify";

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

    // ── Categories ──────────────────────────────────────────────

    getCategories: async (): Promise<Category[]> => {
        await delay(200);
        return [...categories];
    },

    addCategory: async (data: { name: string; slug: string; description: string }): Promise<Category> => {
        await delay(300);
        const base = data.slug || slugify(data.name);
        const slug = ensureUniqueSlug(base, categories);
        const cat: Category = {
            id: `cat_${Date.now()}`,
            name: data.name.trim(),
            slug,
            description: data.description.trim(),
            createdAt: new Date().toISOString(),
        };
        updateCategories([...categories, cat]);
        return cat;
    },

    updateCategory: async (id: string, data: { name: string; slug: string; description: string }): Promise<Category> => {
        await delay(300);
        const base = data.slug || slugify(data.name);
        const slug = ensureUniqueSlug(base, categories, id);
        const updated = categories.map(c =>
            c.id === id ? { ...c, name: data.name.trim(), slug, description: data.description.trim() } : c
        );
        updateCategories(updated);
        return updated.find(c => c.id === id)!;
    },

    deleteCategory: async (id: string): Promise<void> => {
        await delay(300);
        updateCategories(categories.filter(c => c.id !== id));
    },
};

