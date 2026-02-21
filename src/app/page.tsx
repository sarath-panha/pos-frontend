"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CashFlow } from "@/lib/types";
import { Wallet, Activity } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { RecentTransactionsList } from "@/components/dashboard/RecentTransactionsList";

export default function Dashboard() {
  const [data, setData] = useState<CashFlow>({ totalSalesToday: 0, totalSalesWeek: 0, recentTransactions: [] });

  const loadData = () =>
    api.getCashFlow().then(res => setData(res));

  useEffect(() => {
    loadData();
    const onFocus = () => loadData();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " · " + d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-surface">
      <div className="max-w-lg mx-auto px-4 pt-5 pb-4 space-y-6 animate-in fade-in duration-300">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Wallet} label="Total sales today" value={fmt(data?.totalSalesToday || 0)} />
          <StatCard icon={Activity} label="Total sales this week" value={fmt(data?.totalSalesWeek || 0)} />
        </div>

        {/* ── Recent Transactions ── */}
        <RecentTransactionsList
          transactions={data?.recentTransactions ?? []}
          fmt={fmt}
          fmtDate={fmtDate}
        />
      </div>
    </div>
  );
}
