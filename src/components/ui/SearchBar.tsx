"use client";

import { Search, X, ScanLine } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onScanClick: () => void;
    placeholder?: string;
}

export function SearchBar({ value, onChange, onScanClick, placeholder = "Search products…" }: SearchBarProps) {
    return (
        <div className="flex items-center gap-2 h-10 bg-surface-container-low border border-outline-variant rounded-full px-3.5">
            <Search size={15} className="text-on-surface-variant shrink-0" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
            />
            {value && (
                <button onClick={() => onChange("")} className="text-on-surface-variant m3-press">
                    <X size={15} />
                </button>
            )}
            <button
                onClick={onScanClick}
                className="text-on-surface-variant hover:text-primary transition-colors ml-0.5"
                aria-label="Scan barcode"
            >
                <ScanLine size={16} />
            </button>
        </div>
    );
}
