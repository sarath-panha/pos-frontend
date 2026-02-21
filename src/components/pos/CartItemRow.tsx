"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { CartItem } from "@/lib/types";

interface CartItemRowProps {
    item: CartItem;
    onUpdateQty: (id: string, delta: number) => void;
    fmt: (n: number) => string;
    isLast: boolean;
}

export function CartItemRow({ item, onUpdateQty, fmt, isLast }: CartItemRowProps) {
    return (
        <div className={`flex items-center gap-3 py-2.5 ${!isLast ? "border-b border-outline-variant" : ""}`}>
            {item.imageUrl && (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-outline-variant shrink-0">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="48px" />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{item.name}</p>
                <p className="text-xs text-on-surface-variant">{fmt(item.price)} each</p>
            </div>
            <div className="flex items-center gap-1 bg-surface-container border border-outline-variant rounded-xl h-8 px-1 shrink-0">
                <button onClick={() => onUpdateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-on-surface-variant m3-press">
                    <Minus size={13} />
                </button>
                <span className="w-5 text-center text-sm font-bold text-on-surface">{item.quantity}</span>
                <button onClick={() => onUpdateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-on-surface-variant m3-press">
                    <Plus size={13} />
                </button>
            </div>
            <span className="w-16 text-right text-sm font-bold text-on-surface shrink-0">
                {fmt(item.price * item.quantity)}
            </span>
        </div>
    );
}
