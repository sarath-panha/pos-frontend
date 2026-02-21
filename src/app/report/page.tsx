"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Sale } from "@/lib/types";
import { BarChart2, TrendingUp, Receipt, DollarSign } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { PaymentBreakdown } from "@/components/report/PaymentBreakdown";
import { TransactionLog } from "@/components/report/TransactionLog";

export default function ReportPage() {
    const [cashFlow, setCashFlow] = useState<{ totalSalesToday: number; totalSalesWeek: number; recentTransactions: Sale[] }>({
        totalSalesToday: 0,
        totalSalesWeek: 0,
        recentTransactions: [],
    });

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
                    {stats.map(({ label, value, icon }) => (
                        <StatCard key={label} icon={icon} label={label} value={value} />
                    ))}
                </div>

                {/* Payment Breakdown */}
                <PaymentBreakdown byPayment={byPayment} fmt={fmt} />

                {/* Transaction Log */}
                <TransactionLog transactions={cashFlow?.recentTransactions ?? []} fmt={fmt} />
            </div>
        </div>
    );
}
