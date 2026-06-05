import { useEffect, useCallback, useRef, useId } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

interface ApplePanelProps {
    isOpen: boolean;
    onClose: () => void;
    position?: "center" | "right";
    children: React.ReactNode;
    title?: string;
    showCloseButton?: boolean;
    maxWidth?: string;
    ariaLabel?: string;
}

const ApplePanel: React.FC<ApplePanelProps> = ({
    isOpen,
    onClose,
    position = "center",
    children,
    title,
    showCloseButton = true,
    maxWidth = "max-w-lg",
    ariaLabel,
}) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const titleId = useId();

    // ESC to close + scroll lock
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement | null;
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    // Restore focus on close
    useEffect(() => {
        if (!isOpen && previousFocusRef.current) {
            previousFocusRef.current.focus();
        }
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div
            className={[
                "fixed inset-0 z-[100]",
                "flex",
                position === "center" ? "items-center justify-center p-4" : "justify-end",
                "transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
                isOpen ? "visible opacity-100" : "invisible opacity-0",
            ].join(" ")}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#000000]/30"
                onClick={handleBackdropClick}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                aria-label={!title ? ariaLabel : undefined}
                className={[
                    "relative bg-white",
                    "border border-[#E5E5E5]",
                    "rounded-none",
                    "flex flex-col",
                    "transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    position === "center"
                        ? `w-full ${maxWidth} max-h-[90vh] ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"}`
                        : `h-full w-full max-w-[420px] ${isOpen ? "translate-x-0" : "translate-x-full"}`,
                ].join(" ")}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 md:px-8 h-16 shrink-0 border-b border-[#E5E5E5]">
                        {title ? (
                            <h2
                                id={titleId}
                                className="
                                    text-[14px] font-medium uppercase
                                    tracking-[0.1em]
                                    text-[#000000]
                                "
                            >
                                {title}
                            </h2>
                        ) : (
                            <span />
                        )}

                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close panel"
                                className="
                                    w-9 h-9
                                    inline-flex items-center justify-center
                                    text-[#222222] hover:text-[#000000]
                                    transition-colors duration-200
                                    focus-visible:outline focus-visible:outline-1
                                    focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                "
                            >
                                <HugeiconsIcon icon={Cancel01Icon} size={18} aria-hidden="true" />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-6 md:px-8 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ApplePanel;
