"use client";

import { X, CheckCircle2 } from "lucide-react";
import { CartItem } from "@/lib/types";
import { CartItemRow } from "./CartItemRow";
import { PaymentMethodPicker } from "./PaymentMethodPicker";

type PaymentMethod = "cash" | "card" | "qris";

interface CheckoutSheetProps {
    cart: CartItem[];
    totalAmount: number;
    paymentMethod: PaymentMethod;
    processing: boolean;
    success: boolean;
    onClose: () => void;
    onUpdateQty: (id: string, delta: number) => void;
    onPaymentMethodChange: (method: PaymentMethod) => void;
    onCheckout: () => void;
    fmt: (n: number) => string;
}

export function CheckoutSheet({
    cart,
    totalAmount,
    paymentMethod,
    processing,
    success,
    onClose,
    onUpdateQty,
    onPaymentMethodChange,
    onCheckout,
    fmt,
}: CheckoutSheetProps) {
    return (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
            <div
                className="absolute inset-0 bg-black/30"
                onClick={() => !processing && !success && onClose()}
            />
            <div className="relative w-full max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-300">
                {success ? (
                    <div className="bg-surface rounded-t-3xl border border-outline-variant px-6 py-12 flex flex-col items-center text-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center">
                            <CheckCircle2 size={40} className="text-on-primary-container" />
                        </div>
                        <h2 className="text-xl font-bold text-on-surface">Payment done!</h2>
                        <p className="text-sm text-on-surface-variant">Transaction recorded successfully.</p>
                    </div>
                ) : (
                    <div className="bg-surface rounded-t-3xl border-t border-outline-variant overflow-hidden max-h-[85vh] flex flex-col">
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-1 shrink-0">
                            <div className="w-10 h-1 rounded-full bg-outline-variant" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pb-3 border-b border-outline-variant shrink-0">
                            <h2 className="text-base font-bold text-on-surface">Order Summary</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container m3-press"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="overflow-y-auto flex-1 px-5 py-2 space-y-1">
                            {cart.map((item, i) => (
                                <CartItemRow
                                    key={item.id}
                                    item={item}
                                    onUpdateQty={onUpdateQty}
                                    fmt={fmt}
                                    isLast={i === cart.length - 1}
                                />
                            ))}
                        </div>

                        {/* Total */}
                        <div className="px-5 py-3 border-t border-outline-variant flex justify-between items-center shrink-0">
                            <span className="text-base font-semibold text-on-surface">Total</span>
                            <span className="text-xl font-bold text-primary">{fmt(totalAmount)}</span>
                        </div>

                        {/* Payment Method */}
                        <PaymentMethodPicker selected={paymentMethod} onSelect={onPaymentMethodChange} />

                        {/* CTA */}
                        <div className="px-5 py-4 shrink-0">
                            <button
                                onClick={onCheckout}
                                disabled={processing}
                                className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-bold text-sm flex items-center justify-center border border-primary/20 m3-press disabled:opacity-60"
                            >
                                {processing ? (
                                    <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                                ) : `Charge ${fmt(totalAmount)}`}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
