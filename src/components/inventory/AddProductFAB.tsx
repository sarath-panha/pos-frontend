import Link from "next/link";
import { Plus } from "lucide-react";

export function AddProductFAB() {
    return (
        <Link
            href="/inventory/new"
            className="fixed bottom-[calc(72px+16px+env(safe-area-inset-bottom))] right-4 w-14 h-14 rounded-full bg-primary text-on-primary border border-primary/20 flex items-center justify-center z-30 transition-opacity active:opacity-70"
            aria-label="Add product"
        >
            <Plus size={24} strokeWidth={2.5} />
        </Link>
    );
}
