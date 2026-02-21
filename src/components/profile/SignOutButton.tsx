"use client";

import { LogOut } from "lucide-react";

export function SignOutButton() {
    return (
        <div className="pt-2">
            <button className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border border-error/30 bg-error-container text-on-error-container font-semibold text-sm transition-colors hover:bg-error hover:text-on-error active:opacity-80">
                <LogOut size={18} />
                Sign Out
            </button>
        </div>
    );
}
