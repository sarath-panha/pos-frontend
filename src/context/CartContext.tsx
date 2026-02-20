"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";
import { CartItem } from "@/lib/types";

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    updateQty: (id: string, delta: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: CartItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                if (existing.quantity >= product.qty) return prev;
                return prev.map(i =>
                    i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQty = (id: string, delta: number) => {
        setCart(prev =>
            prev
                .map(i => {
                    if (i.id !== id) return i;
                    const q = i.quantity + delta;
                    return q <= 0 ? null as unknown as CartItem : { ...i, quantity: Math.min(q, i.qty) };
                })
                .filter(Boolean)
        );
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQty, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
}
