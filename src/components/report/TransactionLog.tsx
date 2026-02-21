"use client";

import { Sale } from "@/lib/types";

interface TransactionLogProps {
    transactions: Sale[];
    fmt: (n: number) => string;
}

export function TransactionLog({ transactions, fmt }: TransactionLogProps) {
    if (transactions.length === 0) return null;

    return (
        <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                Transaction Log
            </p>
            <div className="m3-card overflow-hidden">
                {transactions.map((tx, i) => (
                    <div
                        key={tx.id}
                        className={`flex items-center justify-between px-4 py-3.5 ${i < transactions.length - 1 ? "border-b border-outline-variant" : ""
                            }`}
                    >
                        <div>
                            <p className="text-sm font-semibold text-on-surface">
                                {tx.items.length} item{tx.items.length > 1 ? "s" : ""}
                            </p>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                                {new Date(tx.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })} · {tx.paymentMethod.toUpperCase()}
                            </p>
                        </div>
                        <span className="text-sm font-bold text-on-surface">{fmt(tx.totalAmount)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
