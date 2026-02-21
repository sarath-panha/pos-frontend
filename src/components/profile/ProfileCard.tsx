import { User } from "lucide-react";

export function ProfileCard() {
    return (
        <div className="m3-card p-5 flex items-center gap-4 relative overflow-hidden">
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
    );
}
