interface SectionLabelProps {
    children: React.ReactNode;
    className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
    return (
        <p className={`text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ${className}`}>
            {children}
        </p>
    );
}
