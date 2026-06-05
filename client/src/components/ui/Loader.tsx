interface LoaderProps {
    label?: string;
    className?: string;
}

const Loader = ({ label = "Loading…", className = "" }: LoaderProps) => {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`flex flex-col items-center justify-center gap-4 ${className}`}
        >
            <div
                aria-hidden="true"
                className="
                    h-8 w-8
                    border border-[#E5E5E5] border-t-[#000000]
                    rounded-full
                    animate-spin
                "
            />
            {label && (
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#767676]">
                    {label}
                </span>
            )}
        </div>
    );
};

export default Loader;
