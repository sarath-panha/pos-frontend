"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { CartItem } from "@/lib/types";

interface ProductCardProps {
    product: Product;
    cartItem?: CartItem;
    onAdd: () => void;
    fmt: (n: number) => string;
}

export function ProductCard({ product, cartItem, onAdd, fmt }: ProductCardProps) {
    const oos = product.qty === 0;
    const isSelected = Boolean(cartItem);

    return (
        <button
            onClick={() => !oos && onAdd()}
            disabled={oos}
            className={`text-left flex flex-col rounded-2xl border overflow-hidden transition-all duration-150 m3-press ${oos
                    ? "opacity-40 cursor-not-allowed border-outline-variant"
                    : isSelected
                        ? "border-primary/50 bg-primary-container/30"
                        : "border-outline-variant bg-surface-container-lowest hover:border-outline"
                }`}
        >
            {/* Image */}
            <div className="relative w-full aspect-[4/3] bg-surface-container-low border-b border-outline-variant overflow-hidden">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 200px"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                        📦
                    </div>
                )}
                {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-on-primary text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full">
                        {cartItem!.quantity}
                    </div>
                )}
                {oos && (
                    <div className="absolute inset-0 bg-surface/60 flex items-center justify-center">
                        <span className="text-xs font-bold text-error bg-error-container px-2 py-1 rounded-full border border-error/20">
                            Out of stock
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-1.5">
                <p className={`text-sm font-semibold leading-tight ${isSelected ? "text-on-primary-container" : "text-on-surface"}`}>
                    {product.name}
                </p>
                <div className="flex items-center justify-between">
                    <span className={`text-base font-bold ${isSelected ? "text-primary" : "text-on-surface"}`}>
                        {fmt(product.price)}
                    </span>
                    {!oos && (
                        <span className="text-[11px] text-on-surface-variant">{product.qty} left</span>
                    )}
                </div>
            </div>
        </button>
    );
}
