"use client";

import { Product } from "@/lib/types";
import { CartItem } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
    products: Product[];
    cart: CartItem[];
    onAdd: (product: Product) => void;
    fmt: (n: number) => string;
}

export function ProductGrid({ products, cart, onAdd, fmt }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-16 text-on-surface-variant text-sm">
                No products found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            {products.map(product => {
                const cartItem = cart.find(c => c.id === product.id);
                return (
                    <ProductCard
                        key={product.id}
                        product={product}
                        cartItem={cartItem}
                        onAdd={() => onAdd(product)}
                        fmt={fmt}
                    />
                );
            })}
        </div>
    );
}
