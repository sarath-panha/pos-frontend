"use client";

import { ShoppingBag } from "lucide-react";

interface CartFABProps {
    totalQty: number;
    totalAmount: number;
    fmt: (n: number) => string;
    onClick: () => void;
}

export function CartFAB({ totalQty, totalAmount, fmt, onClick }: CartFABProps) {
    return (
        <div className="fixed bottom-[calc(72px+12px+env(safe-area-inset-bottom))] left-4 right-4 z-30 max-w-lg mx-auto">
            <button
                onClick={onClick}
                className="w-full bg-primary text-on-primary h-13 py-3.5 px-5 rounded-2xl border border-primary/20 flex items-center justify-between m3-press"
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <ShoppingBag size={20} />
                        <span className="absolute -top-1.5 -right-1.5 bg-error text-on-error text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                            {totalQty}
                        </span>
                    </div>
                    <span className="font-semibold text-sm">View Cart</span>
                </div>
                <span className="font-bold text-base">{fmt(totalAmount)}</span>
            </button>
        </div>
    );
}
