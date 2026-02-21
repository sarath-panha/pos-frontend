"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Check, ScanLine } from "lucide-react";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { FormField, InputBox } from "@/components/ui/FormField";
import { FormAdvancedSection } from "@/components/inventory/FormAdvancedSection";

const CATEGORIES = ["Café", "Pharmacy", "Retail", "Electronics", "Food & Beverage", "Other"];

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
                    <FormField label="Product Name" required error={errors.name}>
                        <InputBox error={errors.name}>
                            <input
                                type="text" placeholder="e.g. Coffee Beans 1kg" value={form.name}
                                onChange={e => set("name", e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                            />
                        </InputBox>
                    </FormField>

                    {/* Description */}
                    <FormField label="Description">
                        <textarea
                            placeholder="Short description (optional)" value={form.description}
                            onChange={e => set("description", e.target.value)} rows={2}
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant outline-none resize-none focus:border-primary transition-colors"
                        />
                    </FormField>

                    {/* Price + Quantity */}
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Price" required error={errors.price}>
                            <InputBox error={errors.price}>
                                <span className="text-on-surface-variant text-sm mr-1">$</span>
                                <input
                                    type="number" step="0.01" min="0" placeholder="0.00" value={form.price}
                                    onChange={e => set("price", e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                                />
                            </InputBox>
                        </FormField>
                        <FormField label="Quantity" required error={errors.qty}>
                            <InputBox error={errors.qty}>
                                <input
                                    type="number" min="0" placeholder="0" value={form.qty}
                                    onChange={e => set("qty", e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                                />
                            </InputBox>
                        </FormField>
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Category
                        </label>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat} type="button" onClick={() => set("category", cat)}
                                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:opacity-70 ${form.category === cat
                                            ? "bg-primary text-on-primary border-primary"
                                            : "bg-transparent text-on-surface-variant border-outline-variant"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Details */}
                    <FormAdvancedSection
                        visible={showAdvanced}
                        onToggle={() => setShowAdvanced(v => !v)}
                        values={{
                            cost: form.cost,
                            unit: form.unit,
                            sku: form.sku,
                            barcode: form.barcode,
                            low_stock_level: form.low_stock_level,
                            supplier: form.supplier,
                            expiry_date: form.expiry_date,
                        }}
                        onChange={set}
                        onScanBarcode={() => setShowScanner(true)}
                    />

                    {/* Submit */}
                    <div className="pt-1">
                        <button
                            type="submit" disabled={saving || saved}
                            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition-all disabled:opacity-70 active:opacity-80 bg-primary text-on-primary border-primary/20"
                        >
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
