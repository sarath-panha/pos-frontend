"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Category } from "@/lib/types";

interface CategoryRowProps {
    category: Category;
    productCount: number;
    onEdit: () => void;
    onDelete: () => void;
    isLast: boolean;
}

export function CategoryRow({ category, productCount, onEdit, onDelete, isLast }: CategoryRowProps) {
    return (
        <div className={`flex items-center gap-4 px-4 py-3.5 ${!isLast ? "border-b border-outline-variant" : ""}`}>
            {/* Text */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-on-surface">{category.name}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${productCount > 0
                        ? "bg-primary-container text-on-primary-container border-primary/20"
                        : "bg-surface-container text-on-surface-variant border-outline-variant"
                        }`}>
                        {productCount} {productCount === 1 ? "product" : "products"}
                    </span>
                </div>
                {category.description && (
                    <p className="text-xs text-on-surface-variant mt-0.5 truncate">{category.description}</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
                <button
                    onClick={onEdit}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors m3-press"
                    aria-label="Edit category"
                >
                    <Pencil size={15} />
                </button>
                <button
                    onClick={onDelete}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors m3-press"
                    aria-label="Delete category"
                >
                    <Trash2 size={15} />
                </button>
            </div>
        </div>
    );
}
