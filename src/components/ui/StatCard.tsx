import { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
    return (
        <div className="m3-card p-4 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                <Icon size={15} className="text-on-primary-container" />
            </div>
            <div>
                <p className="text-xl font-bold text-on-surface">{value}</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{label}</p>
            </div>
        </div>
    );
}
