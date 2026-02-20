"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Sale } from "@/lib/types";
import { BarChart2, TrendingUp, Receipt, DollarSign } from "lucide-react";

export default function ReportPage() {
    const [cashFlow, setCashFlow] = useState<{ totalSalesToday: number; totalSalesWeek: number; recentTransactions: Sale[] }>({ totalSalesToday: 0, totalSalesWeek: 0, recentTransactions: [] });

    useEffect(() => {
        api.getCashFlow().then(res => setCashFlow(res));
    }, []);

    const fmt = (n: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);


    const totalTransactions = cashFlow?.recentTransactions.length || 0;
    const avgPerTx = totalTransactions > 0
        ? (cashFlow!.recentTransactions.reduce((s, t) => s + t.totalAmount, 0) / totalTransactions)
        : 0;

    const byPayment = cashFlow?.recentTransactions.reduce<Record<string, number>>((acc, tx) => {
        acc[tx.paymentMethod] = (acc[tx.paymentMethod] || 0) + tx.totalAmount;
        return acc;
    }, {}) || {};

    const stats = [
        { label: "Today", value: fmt(cashFlow?.totalSalesToday || 0), icon: DollarSign },
        { label: "This Week", value: fmt(cashFlow?.totalSalesWeek || 0), icon: TrendingUp },
        { label: "Transactions", value: String(totalTransactions), icon: Receipt },
        { label: "Avg. Sale", value: fmt(avgPerTx), icon: BarChart2 },
    ];

    return (
        <div className="bg-surface">
            <div className="max-w-lg mx-auto px-4 pt-5 pb-4 space-y-6 animate-in fade-in duration-300">

                {/* Key Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {stats.map(({ label, value, icon: Icon }) => (
                        <div key={label} className="m3-card p-4 flex flex-col gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                                <Icon size={15} className="text-on-primary-container" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-on-surface">{value}</p>
                                <p className="text-[11px] text-on-surface-variant mt-0.5">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payment Breakdown */}
                {Object.keys(byPayment).length > 0 && (
                    <div className="space-y-3">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">By Payment Method</p>
                        <div className="m3-card overflow-hidden">
                            {Object.entries(byPayment).map(([method, amount], i, arr) => {
                                const total = Object.values(byPayment).reduce((s, v) => s + v, 0);
                                const pct = Math.round((amount / total) * 100);
                                return (
                                    <div
                                        key={method}
                                        className={`px-4 py-3.5 ${i < arr.length - 1 ? "border-b border-outline-variant" : ""}`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-semibold text-on-surface capitalize">{method}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-on-surface-variant">{pct}%</span>
                                                <span className="text-sm font-bold text-on-surface">{fmt(amount)}</span>
                                            </div>
                                        </div>
                                        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Recent Transactions */}
                {cashFlow && cashFlow.recentTransactions.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Transaction Log</p>
                        <div className="m3-card overflow-hidden">
                            {cashFlow.recentTransactions.map((tx, i) => (
                                <div
                                    key={tx.id}
                                    className={`flex items-center justify-between px-4 py-3.5 ${i < cashFlow.recentTransactions.length - 1 ? "border-b border-outline-variant" : ""}`}
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
                )}
            </div>
        </div>
    );
}
