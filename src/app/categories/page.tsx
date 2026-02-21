"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Category, Product } from "@/lib/types";
import { Plus, Tag } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CategoryRow } from "@/components/categories/CategoryRow";
import { CategoryFormSheet } from "@/components/categories/CategoryFormSheet";
import { DeleteConfirmDialog } from "@/components/categories/DeleteConfirmDialog";

type SheetState =
    | { mode: "add" }
    | { mode: "edit"; category: Category };

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sheet, setSheet] = useState<SheetState | null>(null);
    const [toDelete, setToDelete] = useState<Category | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadData = async () => {
        const [cats, prods] = await Promise.all([api.getCategories(), api.getProducts()]);
        setCategories(cats);
        setProducts(prods);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const productCountFor = (catName: string) =>
        products.filter(p => p.category === catName).length;

    const handleSave = async (data: { name: string; slug: string; description: string }) => {
        if (!sheet) return;
        if (sheet.mode === "add") {
            await api.addCategory(data);
        } else {
            await api.updateCategory(sheet.category.id, data);
        }
        setSheet(null);
        await loadData();
    };

    const handleDelete = async () => {
        if (!toDelete) return;
        setDeleting(true);
        await api.deleteCategory(toDelete.id);
        setDeleting(false);
        setToDelete(null);
        await loadData();
    };

    const existingSlugs = categories.map(c => ({ id: c.id, slug: c.slug }));
    const totalProducts = products.length;

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-surface">
            <div className="max-w-lg mx-auto px-4 pt-5 pb-28 space-y-5 animate-in fade-in duration-300">

                {/* ── Summary header ── */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
                        <Tag size={18} className="text-on-primary-container" />
                    </div>
                    <div>
                        <p className="text-base font-bold text-on-surface">Product Categories</p>
                        <p className="text-xs text-on-surface-variant">
                            {categories.length} {categories.length === 1 ? "category" : "categories"} · {totalProducts} total products
                        </p>
                    </div>
                </div>

                {/* ── Category list ── */}
                {categories.length === 0 ? (
                    <div className="m3-card flex flex-col items-center justify-center py-16 gap-3 text-center">
                        <Tag size={32} className="text-outline" />
                        <p className="text-sm text-on-surface-variant">No categories yet.</p>
                        <button
                            onClick={() => setSheet({ mode: "add" })}
                            className="text-sm font-semibold text-primary hover:underline"
                        >
                            Add your first category
                        </button>
                    </div>
                ) : (
                    <div className="m3-card overflow-hidden">
                        {categories.map((cat, i) => (
                            <CategoryRow
                                key={cat.id}
                                category={cat}
                                productCount={productCountFor(cat.name)}
                                isLast={i === categories.length - 1}
                                onEdit={() => setSheet({ mode: "edit", category: cat })}
                                onDelete={() => setToDelete(cat)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── FAB ── */}
            <button
                onClick={() => setSheet({ mode: "add" })}
                className="fixed bottom-[calc(72px+16px+env(safe-area-inset-bottom))] right-4 w-14 h-14 rounded-full bg-primary text-on-primary border border-primary/20 flex items-center justify-center z-30 transition-opacity active:opacity-70 shadow-lg"
                aria-label="Add category"
            >
                <Plus size={24} strokeWidth={2.5} />
            </button>

            {/* ── Add / Edit Sheet ── */}
            {sheet && (
                <CategoryFormSheet
                    mode={sheet.mode}
                    initial={sheet.mode === "edit" ? sheet.category : undefined}
                    existingSlugs={existingSlugs}
                    onSave={handleSave}
                    onClose={() => setSheet(null)}
                />
            )}

            {/* ── Delete Confirmation ── */}
            {toDelete && (
                <DeleteConfirmDialog
                    category={toDelete}
                    productCount={productCountFor(toDelete.name)}
                    deleting={deleting}
                    onConfirm={handleDelete}
                    onCancel={() => setToDelete(null)}
                />
            )}
        </div>
    );
}
