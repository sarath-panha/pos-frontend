"use client";

interface ScanFeedbackToastProps {
    message: string;
}

export function ScanFeedbackToast({ message }: ScanFeedbackToastProps) {
    if (!message) return null;
    return (
        <div className="fixed top-[116px] left-4 right-4 z-40 max-w-lg mx-auto">
            <div className="bg-on-surface text-surface text-xs font-semibold px-4 py-3 rounded-xl text-center animate-in fade-in duration-200">
                {message}
            </div>
        </div>
    );
}
