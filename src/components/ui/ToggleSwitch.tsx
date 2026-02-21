"use client";

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
    "aria-label"?: string;
}

export function ToggleSwitch({ checked, onChange, "aria-label": ariaLabel }: ToggleSwitchProps) {
    return (
        <button
            onClick={onChange}
            aria-checked={checked}
            aria-label={ariaLabel}
            role="switch"
            className={`relative w-12 h-6 rounded-full border-2 transition-all duration-300 focus:outline-none ${checked ? "bg-primary border-primary" : "bg-surface-container border-outline"
                }`}
        >
            <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${checked ? "left-[calc(100%-18px)]" : "left-0.5"
                    }`}
            />
        </button>
    );
}
