"use client";

import { Banknote, CreditCard, QrCode } from "lucide-react";

type PaymentMethod = "cash" | "card" | "qris";

const METHODS = [
    { id: "cash" as const, label: "Cash", icon: Banknote },
    { id: "card" as const, label: "Card", icon: CreditCard },
    { id: "qris" as const, label: "QRIS", icon: QrCode },
];

interface PaymentMethodPickerProps {
    selected: PaymentMethod;
    onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodPicker({ selected, onSelect }: PaymentMethodPickerProps) {
    return (
        <div className="px-5 py-3 shrink-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                Payment Method
            </p>
            <div className="grid grid-cols-3 gap-2">
                {METHODS.map(m => (
                    <button
                        key={m.id}
                        onClick={() => onSelect(m.id)}
                        className={`flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all m3-press ${selected === m.id
                                ? "bg-primary-container border-primary text-on-primary-container"
                                : "bg-surface-container-low border-outline-variant text-on-surface-variant"
                            }`}
                    >
                        <m.icon size={18} />
                        {m.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
