"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CashFlow } from "@/lib/types";
import { Wallet, Activity, Receipt, TrendingUp } from "lucide-react";

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
    <div className="bg-surface min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-5 pb-8 space-y-6 animate-in fade-in duration-300">


        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="m3-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                <Wallet size={15} className="text-on-primary-container" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Today</span>
            </div>
            <div>
              <p className="text-xl font-bold text-on-surface">{fmt(data?.totalSalesToday || 0)}</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Total sales today</p>
            </div>
          </div>

          <div className="m3-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                <Activity size={15} className="text-on-primary-container" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">This Week</span>
            </div>
            <div>
              <p className="text-xl font-bold text-on-surface">{fmt(data?.totalSalesWeek || 0)}</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Total sales this week</p>
            </div>
          </div>
        </div>

        {/* ── Recent Transactions ── */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Recent Transactions</p>
          <div className="m3-card overflow-hidden">
            {!data || data.recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <Receipt size={32} className="text-outline" />
                <p className="text-sm text-on-surface-variant">No transactions yet.</p>
              </div>
            ) : (
              <ul>
                {data.recentTransactions.map((tx, i) => (
                  <li key={tx.id} className={`flex items-center gap-3 px-4 py-3.5 ${i < data.recentTransactions.length - 1 ? "border-b border-outline-variant" : ""}`}>
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
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
