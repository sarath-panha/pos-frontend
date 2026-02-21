"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Product } from "@/lib/types";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { StockAlerts } from "@/components/inventory/StockAlerts";
import { InventoryProductCard } from "@/components/inventory/InventoryProductCard";
import { AddProductFAB } from "@/components/inventory/AddProductFAB";

export default function Inventory() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [scannerOpen, setScannerOpen] = useState(false);

    const loadData = () =>
        api.getProducts().then(res => { setProducts(res); setLoading(false); });

    useEffect(() => {
        loadData();
        const onFocus = () => loadData();
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, []);

    const handleUpdateQty = async (id: string, delta: number, current: number) => {
        const next = Math.max(0, current + delta);
        if (next === current) return;
        setProducts(prev => prev.map(p => p.id === id ? { ...p, qty: next } : p));
        await api.updateProductQty(id, next);
    };

    const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === "All" || p.category === activeCategory;
        return matchSearch && matchCat;
    });

    const lowStock = products.filter(p => p.qty > 0 && p.qty <= p.low_stock_level).length;
    const outOfStock = products.filter(p => p.qty === 0).length;

    if (loading && !products.length) return <LoadingSpinner />;

    return (
        <div className="bg-surface">
            {/* Scanner */}
            {scannerOpen && (
                <BarcodeScanner
                    onScan={code => {
                        const found = products.find(p => p.barcode === code || p.sku === code);
                        if (found) setSearch(found.name);
                        setScannerOpen(false);
                    }}
                    onClose={() => setScannerOpen(false)}
                />
            )}

            {/* Search & Filter */}
            <SearchFilterBar
                search={search}
                onSearchChange={setSearch}
                onScanClick={() => setScannerOpen(true)}
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            <div className="max-w-lg mx-auto px-4 py-4 pb-4 space-y-4">
                {/* Stock Alerts */}
                <StockAlerts outOfStock={outOfStock} lowStock={lowStock} />

                {/* Product Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-on-surface-variant text-sm">
                        No products found{search ? ` for "${search}"` : ""}.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {filtered.map(product => (
                            <InventoryProductCard
                                key={product.id}
                                product={product}
                                onUpdateQty={handleUpdateQty}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Add Product FAB */}
            <AddProductFAB />
        </div>
    );
}
