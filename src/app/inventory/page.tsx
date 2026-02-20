"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Product } from "@/lib/types";
import { Plus, Minus, AlertTriangle, Search, X, PackageX } from "lucide-react";
import Image from "next/image";

export default function Inventory() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const loadData = () =>
        api.getProducts().then(res => { setProducts(res); setLoading(false); });

    useEffect(() => {
        loadData();
        const onFocus = () => loadData();
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, []);

    const updateStock = async (id: string, delta: number, current: number) => {
        const next = Math.max(0, current + delta);
        if (next === current) return;
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: next } : p));
        await api.updateProductStock(id, next);
    };

    const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === "All" || p.category === activeCategory;
        return matchSearch && matchCat;
    });

    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    if (loading && !products.length) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 rounded-full border-2 border-outline-variant border-t-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface">
            {/* ── Search & Filter Bar ── */}
            <div className="sticky top-14 z-10 bg-surface border-b border-outline-variant px-4 pt-3 pb-3 space-y-2.5">
                <div className="max-w-lg mx-auto space-y-2.5">
                    {/* Search */}
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
                            <button onClick={() => setSearch("")} className="text-on-surface-variant m3-press">
                                <X size={15} />
                            </button>
                        )}
                    </div>
                    {/* Category Chips */}
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

            <div className="max-w-lg mx-auto px-4 py-4 pb-8 space-y-4">
                {/* ── Stock Alerts ── */}
                {(outOfStock > 0 || lowStock > 0) && (
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
                )}

                {/* ── Product Grid ── */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 text-on-surface-variant text-sm">
                        No products found{search ? ` for "${search}"` : ""}.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {filtered.map(product => {
                            const isLow = product.stock > 0 && product.stock <= 5;
                            const isOut = product.stock === 0;
                            return (
                                <div
                                    key={product.id}
                                    className="m3-card overflow-hidden flex flex-col"
                                >
                                    {/* Product Image */}
                                    <div className="relative w-full aspect-square bg-surface-container-low border-b border-outline-variant overflow-hidden">
                                        {product.imageUrl ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, 200px"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-outline">
                                                <span className="text-4xl">📦</span>
                                            </div>
                                        )}
                                        {/* Stock badge */}
                                        <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${isOut
                                                ? "bg-error-container text-on-error-container border-error/20"
                                                : isLow
                                                    ? "bg-surface-container text-on-surface-variant border-outline-variant"
                                                    : "bg-primary-container text-on-primary-container border-primary/20"
                                            }`}>
                                            {isOut ? "Empty" : isLow ? `${product.stock} low` : `${product.stock}`}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-3 flex flex-col gap-2.5 flex-1">
                                        <div>
                                            <p className="text-sm font-semibold text-on-surface leading-tight">{product.name}</p>
                                            <p className="text-xs text-on-surface-variant mt-0.5">{product.category}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-base font-bold text-on-surface">${product.price.toFixed(2)}</span>
                                            <div className="flex items-center gap-0.5 bg-surface-container border border-outline-variant rounded-lg h-7 px-1">
                                                <button
                                                    onClick={() => updateStock(product.id, -1, product.stock)}
                                                    disabled={isOut}
                                                    className="w-5 h-5 flex items-center justify-center rounded-md text-on-surface-variant disabled:opacity-30 m3-press"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="w-7 text-center text-xs font-bold text-on-surface tabular-nums">
                                                    {product.stock}
                                                </span>
                                                <button
                                                    onClick={() => updateStock(product.id, 1, product.stock)}
                                                    className="w-5 h-5 flex items-center justify-center rounded-md text-on-surface-variant m3-press"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
