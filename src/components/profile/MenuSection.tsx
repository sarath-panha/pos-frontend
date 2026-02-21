import { LucideIcon } from "lucide-react";
import { MenuRow } from "@/components/ui/MenuRow";

interface MenuItem {
    label: string;
    icon: LucideIcon;
    value?: string;
}

interface MenuSectionProps {
    title: string;
    items: MenuItem[];
}

export function MenuSection({ title, items }: MenuSectionProps) {
    return (
        <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant px-1">
                {title}
            </p>
            <div className="m3-card overflow-hidden">
                {items.map((item, i) => (
                    <MenuRow
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        value={item.value}
                        isLast={i === items.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}
