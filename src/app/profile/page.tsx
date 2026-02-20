"use client";

import {
    User, Store, Bell, Shield, Globe,
    ChevronRight, HelpCircle, Moon, LogOut
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const INFO_SECTIONS = [
    {
        title: "Business",
        items: [
            { label: "Store Name", value: "My Shop", icon: Store },
            { label: "Notifications", icon: Bell },
        ],
    },
    {
        title: "Preferences",
        items: [
            { label: "Language", value: "English", icon: Globe },
        ],
    },
    {
        title: "Support",
        items: [
            { label: "Privacy & Security", icon: Shield },
            { label: "Help & Support", icon: HelpCircle },
        ],
    },
];

export default function ProfilePage() {
    const { isDark, toggleDark } = useTheme();

    return (
        <div className="min-h-screen bg-surface">
            <div className="max-w-lg mx-auto px-4 py-5 pb-8 space-y-5 animate-in fade-in duration-300">

                {/* ── Avatar Card ── */}
                <div className="m3-card p-5 flex items-center gap-4 relative overflow-hidden">
                    {/* Pro Plan badge — top right */}
                    <span className="absolute top-3.5 right-4 text-[10px] font-bold px-2 py-0.5 bg-primary-container text-on-primary-container rounded-full border border-primary/20">
                        Pro Plan
                    </span>

                    <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center shrink-0">
                        <User size={28} className="text-on-primary-container" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-on-surface">Business Owner</p>
                        <p className="text-sm text-on-surface-variant">owner@myshop.com</p>
                    </div>
                </div>

                {/* ── Appearance (Dark Mode) ── */}
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
                            {/* Toggle Switch */}
                            <button
                                onClick={toggleDark}
                                aria-checked={isDark}
                                role="switch"
                                className={`relative w-12 h-6 rounded-full border-2 transition-all duration-300 focus:outline-none ${isDark
                                        ? "bg-primary border-primary"
                                        : "bg-surface-container border-outline"
                                    }`}
                            >
                                <span
                                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${isDark ? "left-[calc(100%-18px)]" : "left-0.5"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Menu Sections ── */}
                {INFO_SECTIONS.map(section => (
                    <div key={section.title} className="space-y-2">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant px-1">
                            {section.title}
                        </p>
                        <div className="m3-card overflow-hidden">
                            {section.items.map((item, i) => (
                                <button
                                    key={item.label}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-container-low active:bg-surface-container ${i < section.items.length - 1 ? "border-b border-outline-variant" : ""
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                                        <item.icon size={16} className="text-on-surface-variant" />
                                    </div>
                                    <span className="flex-1 text-sm font-medium text-on-surface">{item.label}</span>
                                    {(item as any).value && (
                                        <span className="text-xs text-on-surface-variant mr-1">{(item as any).value}</span>
                                    )}
                                    <ChevronRight size={16} className="text-outline shrink-0" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* ── Sign Out — standalone danger button ── */}
                <div className="pt-2">
                    <button className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border border-error/30 bg-error-container text-on-error-container font-semibold text-sm transition-colors hover:bg-error hover:text-on-error active:opacity-80">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>

                <p className="text-center text-[11px] text-on-surface-variant pb-2">
                    SMEApp v1.0.0
                </p>
            </div>
        </div>
    );
}
