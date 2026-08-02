import { useEffect, useRef } from 'react';

export default function ConfirmationModal({
    isOpen,
    message,
    onClose,
    onConfirm,
    confirmText = 'Proceed',
    cancelText = 'Cancel'
}) {
    const confirmButtonRef = useRef(null);

    useEffect(() => {
        if (isOpen && confirmButtonRef.current) {
            confirmButtonRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="w-[92%] max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-6 text-center">
                    <p className="text-sm leading-6 text-gray-700">{message}</p>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        ref={confirmButtonRef}
                        onClick={onConfirm}
                        className="cursor-pointer flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
