import { Receipt } from "lucide-react";
import { Sale } from "@/lib/types";
import { TransactionItem } from "./TransactionItem";

interface RecentTransactionsListProps {
    transactions: Sale[];
    fmt: (n: number) => string;
    fmtDate: (iso: string) => string;
}

export function RecentTransactionsList({ transactions, fmt, fmtDate }: RecentTransactionsListProps) {
    return (
        <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                Recent Transactions
            </p>
            <div className="m3-card overflow-hidden">
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                        <Receipt size={32} className="text-outline" />
                        <p className="text-sm text-on-surface-variant">No transactions yet.</p>
                    </div>
                ) : (
                    <ul>
                        {transactions.map((tx, i) => (
                            <TransactionItem
                                key={tx.id}
                                tx={tx}
                                isLast={i === transactions.length - 1}
                                fmt={fmt}
                                fmtDate={fmtDate}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
