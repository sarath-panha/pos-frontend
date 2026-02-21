"use client";

import { SearchBar } from "./SearchBar";
import { CategoryChips } from "./CategoryChips";

interface SearchFilterBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    onScanClick: () => void;
    categories: string[];
    activeCategory: string;
    onCategoryChange: (cat: string) => void;
    placeholder?: string;
}

export function SearchFilterBar({
    search,
    onSearchChange,
    onScanClick,
    categories,
    activeCategory,
    onCategoryChange,
    placeholder,
}: SearchFilterBarProps) {
    return (
        <div className="sticky top-14 z-10 bg-surface border-b border-outline-variant px-4 pt-3 pb-3 space-y-2.5">
            <div className="max-w-lg mx-auto space-y-2.5">
                <SearchBar
                    value={search}
                    onChange={onSearchChange}
                    onScanClick={onScanClick}
                    placeholder={placeholder}
                />
                <CategoryChips
                    categories={categories}
                    active={activeCategory}
                    onSelect={onCategoryChange}
                />
            </div>
        </div>
    );
}
