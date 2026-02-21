"use client";

interface PaymentBreakdownProps {
    byPayment: Record<string, number>;
    fmt: (n: number) => string;
}

export function PaymentBreakdown({ byPayment, fmt }: PaymentBreakdownProps) {
    if (Object.keys(byPayment).length === 0) return null;

    const total = Object.values(byPayment).reduce((s, v) => s + v, 0);

    return (
        <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                By Payment Method
            </p>
            <div className="m3-card overflow-hidden">
                {Object.entries(byPayment).map(([method, amount], i, arr) => {
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
    );
}
