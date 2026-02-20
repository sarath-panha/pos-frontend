"use client";

import Link from "next/link";

export function Header() {
    return (
        <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant h-14 flex items-center px-4">
            <div className="flex items-center justify-between w-full max-w-lg mx-auto">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-on-primary text-xs font-black">S</span>
                    </div>
                    <span className="font-bold text-base text-on-surface tracking-tight">
                        SME<span className="text-primary">App</span>
                    </span>
                </Link>

                {/* User Avatar → Profile */}
                <Link
                    href="/profile"
                    className="w-9 h-9 rounded-full bg-primary-container border border-primary/20 flex items-center justify-center text-on-primary-container font-bold text-sm transition-opacity active:opacity-70"
                    aria-label="Profile"
                >
                    BO
                </Link>
            </div>
        </header>
    );
}
