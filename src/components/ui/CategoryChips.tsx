"use client";

interface CategoryChipsProps {
    categories: string[];
    active: string;
    onSelect: (cat: string) => void;
}

export function CategoryChips({ categories, active, onSelect }: CategoryChipsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold border transition-all m3-press ${active === cat
                            ? "bg-primary text-on-primary border-primary"
                            : "bg-transparent text-on-surface-variant border-outline-variant hover:border-outline"
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
