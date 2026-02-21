import React from "react";

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

export function FormField({ label, required, error, children }: FormFieldProps) {
    return (
        <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                {label} {required && <span className="text-error">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-error">{error}</p>}
        </div>
    );
}

/** Shared bordered input container — pass `error` to highlight red */
export function InputBox({
    error,
    className = "",
    children,
}: {
    error?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`flex items-center h-11 bg-surface-container-lowest border rounded-xl px-3.5 transition-colors ${error
                    ? "border-error"
                    : "border-outline-variant focus-within:border-primary"
                } ${className}`}
        >
            {children}
        </div>
    );
}
