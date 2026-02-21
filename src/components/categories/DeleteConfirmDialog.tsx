"use client";

import { AlertTriangle } from "lucide-react";
import { Category } from "@/lib/types";

interface DeleteConfirmDialogProps {
    category: Category;
    productCount: number;
    deleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteConfirmDialog({ category, productCount, deleting, onConfirm, onCancel }: DeleteConfirmDialogProps) {
    return (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30" onClick={() => !deleting && onCancel()} />

            <div className="relative w-full max-w-lg mx-auto bg-surface rounded-t-3xl border-t border-outline-variant animate-in slide-in-from-bottom-4 duration-300 p-6 space-y-4">
                {/* Handle */}
                <div className="flex justify-center -mt-2 mb-1">
                    <div className="w-10 h-1 rounded-full bg-outline-variant" />
                </div>

                {/* Icon + Title */}
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-error-container flex items-center justify-center">
                        <AlertTriangle size={26} className="text-on-error-container" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-on-surface">Delete &ldquo;{category.name}&rdquo;?</h2>
                        <p className="text-sm text-on-surface-variant mt-1">
                            This action cannot be undone.
                        </p>
                    </div>
                </div>

                {/* Warning if products use this category */}
                {productCount > 0 && (
                    <div className="flex items-start gap-3 bg-surface-container border border-outline-variant rounded-xl px-4 py-3">
                        <AlertTriangle size={16} className="text-secondary shrink-0 mt-0.5" />
                        <p className="text-sm text-on-surface">
                            <span className="font-semibold">{productCount} {productCount === 1 ? "product" : "products"}</span> currently use this category. They will keep the old category name, but this category will no longer be selectable.
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                    <button
                        onClick={onCancel}
                        disabled={deleting}
                        className="flex-1 py-3 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors m3-press disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={deleting}
                        className="flex-1 py-3 rounded-xl bg-error text-on-error border border-error/20 text-sm font-bold flex items-center justify-center m3-press disabled:opacity-60"
                    >
                        {deleting
                            ? <div className="w-5 h-5 border-2 border-on-error border-t-transparent rounded-full animate-spin" />
                            : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
