"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Check, ChevronRight, ScanLine } from "lucide-react";
import { BarcodeScanner } from "@/components/BarcodeScanner";

const CATEGORIES = ["Café", "Pharmacy", "Retail", "Electronics", "Food & Beverage", "Other"];
const UNITS = ["pcs", "kg", "gram", "liter", "ml", "box", "pack", "bottle", "tube", "bag"];

type RawForm = {
    name: string; description: string; category: string;
    sku: string; barcode: string;
    price: string; cost: string;
    qty: string; low_stock_level: string; unit: string;
    expiry_date: string; supplier: string;
};
type FieldErrors = Partial<Record<keyof RawForm, string>>;

const DEFAULTS: RawForm = {
    name: "", description: "", category: CATEGORIES[0],
    sku: "", barcode: "", price: "", cost: "",
    qty: "", low_stock_level: "5", unit: "pcs",
    expiry_date: "", supplier: "",
};

export default function AddProductPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [form, setForm] = useState<RawForm>(DEFAULTS);
    const [errors, setErrors] = useState<FieldErrors>({});

    const set = (field: keyof RawForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validate = (): boolean => {
        const e: FieldErrors = {};
        if (!form.name.trim()) e.name = "Required";
        if (!form.price || parseFloat(form.price) <= 0) e.price = "Enter a valid price";
        if (form.qty === "" || parseInt(form.qty, 10) < 0) e.qty = "Enter a valid quantity";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        await api.addProduct({
            name: form.name.trim(),
            description: form.description.trim(),
            category: form.category,
            sku: form.sku.trim() || undefined,
            barcode: form.barcode.trim() || undefined,
            price: parseFloat(form.price),
            cost: form.cost ? parseFloat(form.cost) : undefined,
            qty: parseInt(form.qty, 10),
            low_stock_level: parseInt(form.low_stock_level, 10) || 5,
            unit: form.unit,
            expiry_date: form.expiry_date || undefined,
            supplier: form.supplier.trim() || undefined,
            is_active: true,
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => router.push("/inventory"), 900);
    };

    // Shared input container class
    const box = (err?: string) =>
        `flex items-center h-11 bg-surface-container-lowest border rounded-xl px-3.5 transition-colors ${err ? "border-error" : "border-outline-variant focus-within:border-primary"}`;

    return (
        <div className="bg-surface">
            {/* Scanner modal */}
            {showScanner && (
                <BarcodeScanner
                    onScan={code => set("barcode", code)}
                    onClose={() => setShowScanner(false)}
                />
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className="max-w-lg mx-auto px-4 pt-4 pb-6 space-y-4 animate-in fade-in duration-300">


                    {/* Image placeholder */}
                    <div className="w-full aspect-video bg-surface-container-low border border-outline-variant rounded-2xl flex flex-col items-center justify-center gap-1.5 text-on-surface-variant">
                        <ScanLine size={24} className="text-outline" />
                        <p className="text-xs">Image upload coming soon (Cloudflare)</p>
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Product Name <span className="text-error">*</span>
                        </label>
                        <div className={box(errors.name)}>
                            <input type="text" placeholder="e.g. Coffee Beans 1kg" value={form.name}
                                onChange={e => set("name", e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant" />
                        </div>
                        {errors.name && <p className="text-xs text-error">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Description</label>
                        <textarea placeholder="Short description (optional)" value={form.description}
                            onChange={e => set("description", e.target.value)} rows={2}
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant outline-none resize-none focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Price — full width */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Price <span className="text-error">*</span>
                        </label>
                        <div className={box(errors.price)}>
                            <span className="text-on-surface-variant text-sm mr-1">$</span>
                            <input type="number" step="0.01" min="0" placeholder="0.00" value={form.price}
                                onChange={e => set("price", e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant" />
                        </div>
                        {errors.price && <p className="text-xs text-error">{errors.price}</p>}
                    </div>

                    {/* Qty — full width */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Quantity <span className="text-error">*</span>
                        </label>
                        <div className={box(errors.qty)}>
                            <input type="number" min="0" placeholder="0" value={form.qty}
                                onChange={e => set("qty", e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant" />
                        </div>
                        {errors.qty && <p className="text-xs text-error">{errors.qty}</p>}
                    </div>

                    {/* Category — single scrollable row */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {CATEGORIES.map(cat => (
                                <button key={cat} type="button" onClick={() => set("category", cat)}
                                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:opacity-70 ${form.category === cat
                                        ? "bg-primary text-on-primary border-primary"
                                        : "bg-transparent text-on-surface-variant border-outline-variant"
                                        }`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Details — link style */}
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(v => !v)}
                        className="flex items-center gap-1 text-primary text-sm font-semibold active:opacity-70"
                    >
                        <ChevronRight
                            size={15}
                            className={`transition-transform duration-200 ${showAdvanced ? "rotate-90" : ""}`}
                        />
                        {showAdvanced ? "Hide advanced details" : "Advanced details"}
                    </button>

                    {showAdvanced && (
                        <>
                            {/* Cost + Unit */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Cost Price</label>
                                    <div className={box()}>
                                        <span className="text-on-surface-variant text-sm mr-1">$</span>
                                        <input type="number" step="0.01" min="0" placeholder="0.00" value={form.cost}
                                            onChange={e => set("cost", e.target.value)}
                                            className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Unit</label>
                                    <div className={box()}>
                                        <select value={form.unit} onChange={e => set("unit", e.target.value)}
                                            className="flex-1 bg-transparent outline-none text-sm text-on-surface">
                                            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* SKU + Barcode */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">SKU</label>
                                    <div className={box()}>
                                        <input type="text" placeholder="e.g. CAF-001" value={form.sku}
                                            onChange={e => set("sku", e.target.value)}
                                            className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Barcode</label>
                                    <div className={box()}>
                                        <input type="text" placeholder="Scan or enter" value={form.barcode}
                                            onChange={e => set("barcode", e.target.value)}
                                            className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant" />
                                        <button type="button" onClick={() => setShowScanner(true)}
                                            className="text-primary ml-1 active:opacity-70">
                                            <ScanLine size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Low Stock + Supplier */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Low Stock Alert</label>
                                    <div className={box()}>
                                        <input type="number" min="0" placeholder="5" value={form.low_stock_level}
                                            onChange={e => set("low_stock_level", e.target.value)}
                                            className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Supplier</label>
                                    <div className={box()}>
                                        <input type="text" placeholder="Supplier name" value={form.supplier}
                                            onChange={e => set("supplier", e.target.value)}
                                            className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant" />
                                    </div>
                                </div>
                            </div>

                            {/* Expiry Date */}
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Expiry Date</label>
                                <div className={box()}>
                                    <input type="date" value={form.expiry_date}
                                        onChange={e => set("expiry_date", e.target.value)}
                                        className="flex-1 bg-transparent outline-none text-sm text-on-surface" />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Submit */}
                    <div className="pt-1">
                        <button type="submit" disabled={saving || saved}
                            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition-all disabled:opacity-70 active:opacity-80 bg-primary text-on-primary border-primary/20">
                            {saved ? (
                                <><Check size={17} /> Product Added!</>
                            ) : saving ? (
                                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                            ) : "Add Product"}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}
