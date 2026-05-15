import React, { useEffect, useCallback, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

interface ApplePanelProps {
    isOpen: boolean;
    onClose: () => void;
    position?: 'center' | 'right';
    children: React.ReactNode;
    title?: string;
    showCloseButton?: boolean;
    maxWidth?: string; // e.g., 'max-w-md', 'max-w-2xl'
}

const ApplePanel: React.FC<ApplePanelProps> = ({
    isOpen,
    onClose,
    position = 'center',
    children,
    title,
    showCloseButton = true,
    maxWidth = 'max-w-lg'
}) => {
    const panelRef = useRef<HTMLDivElement>(null);

    // --- ACCESSIBILITY: ESC KEY ---
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    // --- ACCESSIBILITY: SCROLL LOCK & FOCUS ---
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    // --- CLICK OUTSIDE HANDLER ---
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen && !panelRef.current) return null;

    return (
        <div
            className={`fixed inset-0 z-100 flex transition-all duration-500 ease-in-out ${position === 'center' ? 'items-center justify-center p-4' : 'justify-end'
                } ${isOpen ? 'visible' : 'invisible'}`}
        >
            {/* Backdrop with official Apple-style blur */}
            <div
                className={`absolute inset-0 bg-black/20 backdrop-blur-xl transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={handleBackdropClick}
                aria-hidden="true"
            />

            {/* Panel Content */}
            <div
                ref={panelRef}
                className={`relative bg-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden flex flex-col ${position === 'center'
                    ? `w-full ${maxWidth} rounded-[32px] ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`
                    : `h-full w-full max-w-[480px] rounded-l-[32px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
                    }`}
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-8 py-6 shrink-0 border-b border-gray-50/50">
                        {title ? (
                            <h2 className="text-[20px] font-semibold text-[#1d1d1f] tracking-tight">
                                {title}
                            </h2>
                        ) : <div />}

                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="h-8 w-8 flex items-center justify-center rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] transition-all active:scale-90"
                                aria-label="Close panel"
                            >
                                <HugeiconsIcon icon={Cancel01Icon} size={18} />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ApplePanel;
