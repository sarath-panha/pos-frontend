"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { Product } from "@/lib/types";

interface InventoryProductCardProps {
    product: Product;
    onUpdateQty: (id: string, delta: number, current: number) => void;
}

export function InventoryProductCard({ product, onUpdateQty }: InventoryProductCardProps) {
    const isLow = product.qty > 0 && product.qty <= product.low_stock_level;
    const isOut = product.qty === 0;

    return (
        <div className="m3-card overflow-hidden flex flex-col">
            {/* Image */}
            <div className="relative w-full aspect-square bg-surface-container-low border-b border-outline-variant overflow-hidden">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 200px"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-outline">
                        <span className="text-4xl">📦</span>
                    </div>
                )}
                {/* Stock badge */}
                <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${isOut
                        ? "bg-error-container text-on-error-container border-error/20"
                        : isLow
                            ? "bg-surface-container text-on-surface-variant border-outline-variant"
                            : "bg-primary-container text-on-primary-container border-primary/20"
                    }`}>
                    {isOut ? "Empty" : isLow ? `${product.qty} low` : `${product.qty}`}
                </div>
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col gap-2.5 flex-1">
                <div>
                    <p className="text-sm font-semibold text-on-surface leading-tight">{product.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{product.category} · {product.unit}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-base font-bold text-on-surface">${product.price.toFixed(2)}</span>
                    <div className="flex items-center gap-0.5 bg-surface-container border border-outline-variant rounded-lg h-7 px-1">
                        <button
                            onClick={() => onUpdateQty(product.id, -1, product.qty)}
                            disabled={isOut}
                            className="w-5 h-5 flex items-center justify-center rounded-md text-on-surface-variant disabled:opacity-30 m3-press"
                        >
                            <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-on-surface tabular-nums">
                            {product.qty}
                        </span>
                        <button
                            onClick={() => onUpdateQty(product.id, 1, product.qty)}
                            className="w-5 h-5 flex items-center justify-center rounded-md text-on-surface-variant m3-press"
                        >
                            <Plus size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
