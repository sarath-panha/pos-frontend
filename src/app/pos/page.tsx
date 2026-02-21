"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { CartFAB } from "@/components/pos/CartFAB";
import { CheckoutSheet } from "@/components/pos/CheckoutSheet";
import { ScanFeedbackToast } from "@/components/pos/ScanFeedbackToast";

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

    const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const totalQty = cart.reduce((s, i) => s + i.quantity, 0);

    if (loading && !products.length) return <LoadingSpinner />;

    return (
        <div className="bg-surface">
            {/* Scanner */}
            {scannerOpen && (
                <BarcodeScanner onScan={handleBarcodeScan} onClose={() => setScannerOpen(false)} />
            )}

            {/* Scan Feedback */}
            <ScanFeedbackToast message={scanFeedback} />

            {/* Search & Filter */}
            <SearchFilterBar
                search={search}
                onSearchChange={setSearch}
                onScanClick={() => setScannerOpen(true)}
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            {/* Product Grid */}
            <div className="max-w-lg mx-auto px-4 py-4 pb-24">
                <ProductGrid
                    products={displayed}
                    cart={cart}
                    onAdd={product => addToCart({ ...product, quantity: 1 })}
                    fmt={fmt}
                />
            </div>

            {/* Cart FAB */}
            {cart.length > 0 && !checkoutOpen && (
                <CartFAB
                    totalQty={totalQty}
                    totalAmount={totalAmount}
                    fmt={fmt}
                    onClick={() => setCheckoutOpen(true)}
                />
            )}

            {/* Checkout Sheet */}
            {checkoutOpen && (
                <CheckoutSheet
                    cart={cart}
                    totalAmount={totalAmount}
                    paymentMethod={paymentMethod}
                    processing={processing}
                    success={success}
                    onClose={() => setCheckoutOpen(false)}
                    onUpdateQty={updateQty}
                    onPaymentMethodChange={setPaymentMethod}
                    onCheckout={handleCheckout}
                    fmt={fmt}
                />
            )}
        </div>
    );
}
