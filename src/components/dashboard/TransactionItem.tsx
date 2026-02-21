import { TrendingUp } from "lucide-react";
import { Sale } from "@/lib/types";

interface TransactionItemProps {
    tx: Sale;
    isLast: boolean;
    fmt: (n: number) => string;
    fmtDate: (iso: string) => string;
}

export function TransactionItem({ tx, isLast, fmt, fmtDate }: TransactionItemProps) {
    return (
        <li className={`flex items-center gap-3 px-4 py-3.5 ${!isLast ? "border-b border-outline-variant" : ""}`}>
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
                <TrendingUp size={15} className="text-on-primary-container" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">
                    {tx.items.length} item{tx.items.length > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">{fmtDate(tx.timestamp)}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
                <p className="text-sm font-bold text-on-surface">{fmt(tx.totalAmount)}</p>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-surface-container text-on-surface-variant border border-outline-variant">
                    {tx.paymentMethod}
                </span>
            </div>
        </li>
    );
}
