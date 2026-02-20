"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import {
    ShoppingBag, Plus, Minus, CreditCard,
    Banknote, QrCode, CheckCircle2, X, Search, ScanLine
} from "lucide-react";
import Image from "next/image";
import { BarcodeScanner } from "@/components/BarcodeScanner";

export default function POS() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "qris">("cash");
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [scannerOpen, setScannerOpen] = useState(false);
    const [scanFeedback, setScanFeedback] = useState("");

    const { cart, addToCart, updateQty, clearCart } = useCart();

    const handleBarcodeScan = (code: string) => {
        setScannerOpen(false);
        const found = products.find(p => p.barcode === code || p.sku === code);
        if (found && found.qty > 0) {
            addToCart({ ...found, quantity: 1 });
            setScanFeedback(`✓ ${found.name} added`);
        } else if (found) {
            setScanFeedback(`⚠ ${found.name} is out of stock`);
        } else {
            setScanFeedback(`Barcode not found: ${code}`);
        }
        setTimeout(() => setScanFeedback(""), 2500);
    };

    const loadData = () =>
        api.getProducts().then(res => { setProducts(res); setLoading(false); });

    useEffect(() => {
        loadData();
        const onFocus = () => loadData();
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, []);

    const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const totalQty = cart.reduce((s, i) => s + i.quantity, 0);

    const fmt = (n: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

    const handleCheckout = async () => {
        if (!cart.length) return;
        setProcessing(true);
        await api.createSale(cart, paymentMethod);
        setProcessing(false);
        setSuccess(true);
        clearCart();
        loadData();
        setTimeout(() => { setSuccess(false); setCheckoutOpen(false); }, 2200);
    };

    const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
    const displayed = products.filter(p => {
        const matchCat = activeCategory === "All" || p.category === activeCategory;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    if (loading && !products.length) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 rounded-full border-2 border-outline-variant border-t-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-surface">
            {/* Scanner */}
            {scannerOpen && (
                <BarcodeScanner onScan={handleBarcodeScan} onClose={() => setScannerOpen(false)} />
            )}

            {/* Scan feedback toast */}
            {scanFeedback && (
                <div className="fixed top-[116px] left-4 right-4 z-40 max-w-lg mx-auto">
                    <div className="bg-on-surface text-surface text-xs font-semibold px-4 py-3 rounded-xl text-center animate-in fade-in duration-200">
                        {scanFeedback}
                    </div>
                </div>
            )}
            {/* ── Search & Filter Bar ── */}
            <div className="sticky top-14 z-10 bg-surface border-b border-outline-variant px-4 pt-3 pb-3 space-y-2.5">
                <div className="max-w-lg mx-auto space-y-2.5">
                    <div className="flex items-center gap-2 h-10 bg-surface-container-low border border-outline-variant rounded-full px-3.5">
                        <Search size={15} className="text-on-surface-variant shrink-0" />
                        <input
                            type="text"
                            placeholder="Search products…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="text-on-surface-variant">
                                <X size={15} />
                            </button>
                        )}
                        <button
                            onClick={() => setScannerOpen(true)}
                            className="text-on-surface-variant hover:text-primary transition-colors ml-0.5"
                            aria-label="Scan barcode"
                        >
                            <ScanLine size={16} />
                        </button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold border transition-all m3-press ${activeCategory === cat
                                    ? "bg-primary text-on-primary border-primary"
                                    : "bg-transparent text-on-surface-variant border-outline-variant hover:border-outline"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Product Grid ── */}
            <div className="max-w-lg mx-auto px-4 py-4 pb-24">
                {displayed.length === 0 ? (
                    <div className="text-center py-16 text-on-surface-variant text-sm">
                        No products found.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {displayed.map(product => {
                            const cartItem = cart.find(c => c.id === product.id);
                            const oos = product.qty === 0;
                            const isSelected = Boolean(cartItem);

                            return (
                                <button
                                    key={product.id}
                                    onClick={() => !oos && addToCart({ ...product, quantity: 1 })}
                                    disabled={oos}
                                    className={`text-left flex flex-col rounded-2xl border overflow-hidden transition-all duration-150 m3-press ${oos
                                        ? "opacity-40 cursor-not-allowed border-outline-variant"
                                        : isSelected
                                            ? "border-primary/50 bg-primary-container/30"
                                            : "border-outline-variant bg-surface-container-lowest hover:border-outline"
                                        }`}
                                >
                                    {/* Image */}
                                    <div className="relative w-full aspect-[4/3] bg-surface-container-low border-b border-outline-variant overflow-hidden">
                                        {product.imageUrl ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, 200px"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-4xl">
                                                📦
                                            </div>
                                        )}
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 bg-primary text-on-primary text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full">
                                                {cartItem!.quantity}
                                            </div>
                                        )}
                                        {oos && (
                                            <div className="absolute inset-0 bg-surface/60 flex items-center justify-center">
                                                <span className="text-xs font-bold text-error bg-error-container px-2 py-1 rounded-full border border-error/20">
                                                    Out of stock
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 flex flex-col gap-1.5">
                                        <p className={`text-sm font-semibold leading-tight ${isSelected ? "text-on-primary-container" : "text-on-surface"}`}>
                                            {product.name}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-base font-bold ${isSelected ? "text-primary" : "text-on-surface"}`}>
                                                {fmt(product.price)}
                                            </span>
                                            {!oos && (
                                                <span className="text-[11px] text-on-surface-variant">{product.qty} left</span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Cart FAB ── */}
            {cart.length > 0 && !checkoutOpen && (
                <div className="fixed bottom-[calc(72px+12px+env(safe-area-inset-bottom))] left-4 right-4 z-30 max-w-lg mx-auto">
                    <button
                        onClick={() => setCheckoutOpen(true)}
                        className="w-full bg-primary text-on-primary h-13 py-3.5 px-5 rounded-2xl border border-primary/20 flex items-center justify-between m3-press"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <ShoppingBag size={20} />
                                <span className="absolute -top-1.5 -right-1.5 bg-error text-on-error text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {totalQty}
                                </span>
                            </div>
                            <span className="font-semibold text-sm">View Cart</span>
                        </div>
                        <span className="font-bold text-base">{fmt(totalAmount)}</span>
                    </button>
                </div>
            )}

            {/* ── Checkout Bottom Sheet ── */}
            {checkoutOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end">
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => !processing && !success && setCheckoutOpen(false)}
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

                                {/* Sheet Header */}
                                <div className="flex items-center justify-between px-5 pb-3 border-b border-outline-variant shrink-0">
                                    <h2 className="text-base font-bold text-on-surface">Order Summary</h2>
                                    <button
                                        onClick={() => setCheckoutOpen(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container m3-press"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Cart Items */}
                                <div className="overflow-y-auto flex-1 px-5 py-2 space-y-1">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center gap-3 py-2.5 border-b border-outline-variant last:border-0">
                                            {item.imageUrl && (
                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-outline-variant shrink-0">
                                                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="48px" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-on-surface truncate">{item.name}</p>
                                                <p className="text-xs text-on-surface-variant">{fmt(item.price)} each</p>
                                            </div>
                                            <div className="flex items-center gap-1 bg-surface-container border border-outline-variant rounded-xl h-8 px-1 shrink-0">
                                                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-on-surface-variant m3-press">
                                                    <Minus size={13} />
                                                </button>
                                                <span className="w-5 text-center text-sm font-bold text-on-surface">{item.quantity}</span>
                                                <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-on-surface-variant m3-press">
                                                    <Plus size={13} />
                                                </button>
                                            </div>
                                            <span className="w-16 text-right text-sm font-bold text-on-surface shrink-0">
                                                {fmt(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div className="px-5 py-3 border-t border-outline-variant flex justify-between items-center shrink-0">
                                    <span className="text-base font-semibold text-on-surface">Total</span>
                                    <span className="text-xl font-bold text-primary">{fmt(totalAmount)}</span>
                                </div>

                                {/* Payment Methods */}
                                <div className="px-5 py-3 shrink-0">
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Payment Method</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {([
                                            { id: "cash", label: "Cash", icon: Banknote },
                                            { id: "card", label: "Card", icon: CreditCard },
                                            { id: "qris", label: "QRIS", icon: QrCode },
                                        ] as const).map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => setPaymentMethod(m.id)}
                                                className={`flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all m3-press ${paymentMethod === m.id
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

                                {/* CTA */}
                                <div className="px-5 py-4 shrink-0">
                                    <button
                                        onClick={handleCheckout}
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
            )}
        </div>
    );
}
