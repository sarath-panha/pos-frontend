export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 rounded-full border-2 border-outline-variant border-t-primary animate-spin" />
        </div>
    );
}
