"use client";

import { Moon } from "lucide-react";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

interface AppearanceSectionProps {
    isDark: boolean;
    onToggle: () => void;
}

export function AppearanceSection({ isDark, onToggle }: AppearanceSectionProps) {
    return (
        <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant px-1">
                Appearance
            </p>
            <div className="m3-card overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3.5">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                        <Moon size={16} className="text-on-surface-variant" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-on-surface">Dark Mode</span>
                    <ToggleSwitch
                        checked={isDark}
                        onChange={onToggle}
                        aria-label="Toggle dark mode"
                    />
                </div>
            </div>
        </div>
    );
}
