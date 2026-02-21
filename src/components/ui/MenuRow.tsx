"use client";

import { LucideIcon, ChevronRight } from "lucide-react";

interface MenuRowProps {
    icon: LucideIcon;
    label: string;
    value?: string;
    onClick?: () => void;
    isLast?: boolean;
}

export function MenuRow({ icon: Icon, label, value, onClick, isLast }: MenuRowProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-container-low active:bg-surface-container ${!isLast ? "border-b border-outline-variant" : ""
                }`}
        >
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                <Icon size={16} className="text-on-surface-variant" />
            </div>
            <span className="flex-1 text-sm font-medium text-on-surface">{label}</span>
            {value && (
                <span className="text-xs text-on-surface-variant mr-1">{value}</span>
            )}
            <ChevronRight size={16} className="text-outline shrink-0" />
        </button>
    );
}
