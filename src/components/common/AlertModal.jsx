import { useEffect, useRef } from 'react';

/**
 * AlertModal — a styled replacement for the browser's native alert().
 *
 * Props:
 *   isOpen   {boolean}  — whether the modal is visible
 *   message  {string}   — the message to display
 *   onClose  {function} — called when the user dismisses the modal (X, OK, or backdrop)
 */
export default function AlertModal({ isOpen, message, onClose }) {
    const okBtnRef = useRef(null);

    // Auto-focus the OK button when the modal opens (accessibility + keyboard UX)
    useEffect(() => {
        if (isOpen && okBtnRef.current) {
            okBtnRef.current.focus();
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        /* Backdrop */
        <div
            id="alert-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="alert-modal-message"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-[fadeIn_0.18s_ease]"
            onClick={onClose}
        >
            {/* Modal box — stop clicks from bubbling to backdrop */}
            <div
                id="alert-modal-box"
                className="relative w-[250px] h-[250px] bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-3 p-6 overflow-hidden animate-[slideUp_0.22s_cubic-bezier(0.34,1.56,0.64,1)] box-border"
                onClick={(e) => e.stopPropagation()}
            >
                {/* X close button */}
                <button
                    id="alert-modal-close-x"
                    aria-label="Close alert"
                    className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-sm leading-none p-1.5 rounded-md transition-colors duration-150 cursor-pointer border-none bg-transparent"
                    onClick={onClose}
                >
                    ✕
                </button>

                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6 text-violet-600"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>

                {/* Message */}
                <p
                    id="alert-modal-message"
                    className="m-0 text-center text-sm leading-snug text-gray-700 break-words max-h-20 overflow-y-auto"
                >
                    {message}
                </p>

                {/* OK button */}
                <button
                    id="alert-modal-ok"
                    ref={okBtnRef}
                    className="mt-auto w-full py-2.5 border-none rounded-xl bg-violet-600 text-white font-semibold text-sm cursor-pointer transition-all duration-150 hover:bg-violet-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
                    onClick={onClose}
                >
                    OK
                </button>
            </div>

            {/* Keyframe animations injected once */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: scale(0.85) translateY(16px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0);     }
                }
            `}</style>
        </div>
    );
}
