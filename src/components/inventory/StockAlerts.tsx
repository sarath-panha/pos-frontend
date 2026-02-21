"use client";

import { PackageX, AlertTriangle } from "lucide-react";

interface StockAlertsProps {
    outOfStock: number;
    lowStock: number;
}

export function StockAlerts({ outOfStock, lowStock }: StockAlertsProps) {
    if (outOfStock === 0 && lowStock === 0) return null;

    return (
        <div className="flex gap-2">
            {outOfStock > 0 && (
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-error-container border border-error/20 rounded-xl">
                    <PackageX size={15} className="text-on-error-container shrink-0" />
                    <p className="text-xs font-semibold text-on-error-container">
                        {outOfStock} out of stock
                    </p>
                </div>
            )}
            {lowStock > 0 && (
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-surface-container border border-outline-variant rounded-xl">
                    <AlertTriangle size={15} className="text-secondary shrink-0" />
                    <p className="text-xs font-semibold text-on-surface">
                        {lowStock} low stock
                    </p>
                </div>
            )}
        </div>
    );
}
