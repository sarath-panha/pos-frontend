"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ArrowLeft, Camera, Check } from "lucide-react";

const CATEGORIES = ["Café", "Pharmacy", "Retail", "Electronics", "Food", "Other"];

export default function AddProductPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
        category: CATEGORIES[0],
        imageUrl: "",
    });

    const [errors, setErrors] = useState<Partial<typeof form>>({});

    const set = (field: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const e: Partial<typeof form> = {};
        if (!form.name.trim()) e.name = "Product name is required";
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
            e.price = "Enter a valid price";
        if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
            e.stock = "Enter a valid stock quantity";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        await api.addProduct({
            name: form.name.trim(),
            price: parseFloat(form.price),
            stock: parseInt(form.stock, 10),
            category: form.category,
            imageUrl: form.imageUrl.trim() || `https://picsum.photos/seed/${Date.now()}/400/400`,
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => router.push("/inventory"), 900);
    };

    return (
        <div className="bg-surface min-h-screen">
            {/* ── Sticky Sub-header ── */}
            <div className="sticky top-14 z-10 bg-surface-container-lowest border-b border-outline-variant">
                <div className="max-w-lg mx-auto px-4 h-12 flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container active:opacity-70"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-base font-bold text-on-surface">Add New Product</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="max-w-lg mx-auto px-4 pt-5 pb-6 space-y-5">

                    {/* ── Image Preview / URL ── */}
                    <div className="m3-card overflow-hidden">
                        {form.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <div className="relative w-full aspect-video bg-surface-container-low">
                                <img
                                    src={form.imageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={e => (e.currentTarget.style.display = "none")}
                                />
                            </div>
                        ) : (
                            <div className="w-full aspect-video bg-surface-container-low flex flex-col items-center justify-center gap-2 text-on-surface-variant">
                                <Camera size={32} className="text-outline" />
                                <p className="text-xs">Add an image URL below to preview</p>
                            </div>
                        )}
                        <div className="px-4 py-3 border-t border-outline-variant">
                            <input
                                type="url"
                                placeholder="Image URL (optional)"
                                value={form.imageUrl}
                                onChange={e => set("imageUrl", e.target.value)}
                                className="w-full bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                            />
                        </div>
                    </div>

                    {/* ── Product Name ── */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Product Name <span className="text-error">*</span>
                        </label>
                        <div className={`flex items-center h-12 bg-surface-container-lowest border rounded-xl px-4 transition-colors ${errors.name ? "border-error" : "border-outline-variant focus-within:border-primary"}`}>
                            <input
                                type="text"
                                placeholder="e.g. Coffee Beans 1kg"
                                value={form.name}
                                onChange={e => set("name", e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                            />
                        </div>
                        {errors.name && <p className="text-xs text-error">{errors.name}</p>}
                    </div>

                    {/* ── Price & Stock ── */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                                Price (USD) <span className="text-error">*</span>
                            </label>
                            <div className={`flex items-center h-12 bg-surface-container-lowest border rounded-xl px-4 transition-colors ${errors.price ? "border-error" : "border-outline-variant focus-within:border-primary"}`}>
                                <span className="text-on-surface-variant text-sm mr-1">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={form.price}
                                    onChange={e => set("price", e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                                />
                            </div>
                            {errors.price && <p className="text-xs text-error">{errors.price}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                                Stock Qty <span className="text-error">*</span>
                            </label>
                            <div className={`flex items-center h-12 bg-surface-container-lowest border rounded-xl px-4 transition-colors ${errors.stock ? "border-error" : "border-outline-variant focus-within:border-primary"}`}>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={form.stock}
                                    onChange={e => set("stock", e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                                />
                            </div>
                            {errors.stock && <p className="text-xs text-error">{errors.stock}</p>}
                        </div>
                    </div>

                    {/* ── Category ── */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => set("category", cat)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:opacity-70 ${form.category === cat
                                            ? "bg-primary text-on-primary border-primary"
                                            : "bg-transparent text-on-surface-variant border-outline-variant hover:border-outline"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Submit ── */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={saving || saved}
                            className="w-full h-13 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition-all disabled:opacity-70 active:opacity-80 bg-primary text-on-primary border-primary/20"
                        >
                            {saved ? (
                                <>
                                    <Check size={18} />
                                    Product Added!
                                </>
                            ) : saving ? (
                                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Add Product"
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
