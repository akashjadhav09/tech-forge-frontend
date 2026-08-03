import { useEffect, useRef, useState } from 'react';

const ICONS = {
    success: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M20 6L9 17l-5-5" />
        </svg>
    ),
    error: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    ),
    warning: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    info: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="8.01" />
            <line x1="12" y1="12" x2="12" y2="16" />
        </svg>
    ),
};

const THEMES = {
    success: {
        container: 'bg-white border-l-4 border-emerald-500',
        icon: 'bg-emerald-100 text-emerald-600',
        progress: 'bg-emerald-500',
        title: 'text-emerald-700',
        msg: 'text-gray-600',
    },
    error: {
        container: 'bg-white border-l-4 border-red-500',
        icon: 'bg-red-100 text-red-600',
        progress: 'bg-red-500',
        title: 'text-red-700',
        msg: 'text-gray-600',
    },
    warning: {
        container: 'bg-white border-l-4 border-amber-400',
        icon: 'bg-amber-100 text-amber-600',
        progress: 'bg-amber-400',
        title: 'text-amber-700',
        msg: 'text-gray-600',
    },
    info: {
        container: 'bg-white border-l-4 border-violet-500',
        icon: 'bg-violet-100 text-violet-600',
        progress: 'bg-violet-500',
        title: 'text-violet-700',
        msg: 'text-gray-600',
    },
};

function ToastItem({ id, type = 'info', title, message, duration = 4000, onRemove }) {
    const theme = THEMES[type] ?? THEMES.info;
    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [progress, setProgress] = useState(100);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);
    const remainingRef = useRef(duration);
    const isPausedRef = useRef(false);

    useEffect(() => {
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, []);

    const dismiss = () => {
        if (leaving) return;
        setLeaving(true);
        setVisible(false);
        setTimeout(() => onRemove(id), 350);
    };

    const startTimer = () => {
        isPausedRef.current = false;
        startTimeRef.current = Date.now();
        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            remainingRef.current = Math.max(0, remainingRef.current - elapsed);
            startTimeRef.current = Date.now();
            setProgress((remainingRef.current / duration) * 100);
            if (remainingRef.current <= 0) {
                clearInterval(intervalRef.current);
                dismiss();
            }
        }, 30);
    };

    const pauseTimer = () => {
        if (isPausedRef.current) return;
        isPausedRef.current = true;
        clearInterval(intervalRef.current);
    };

    useEffect(() => {
        startTimer();
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div
            role="alert"
            aria-live="assertive"
            onMouseEnter={pauseTimer}
            onMouseLeave={startTimer}
            style={{
                transition: 'all 0.35s cubic-bezier(0.34, 1.2, 0.64, 1)',
                transform: visible && !leaving ? 'translateX(0) scale(1)' : 'translateX(110%) scale(0.92)',
                opacity: visible && !leaving ? 1 : 0,
                marginBottom: '0.75rem',
            }}
            className={`relative w-80 rounded-xl shadow-xl overflow-hidden pointer-events-auto ${theme.container}`}
        >
            <div className="flex items-start gap-3 px-4 py-3.5">
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${theme.icon}`}>
                    {ICONS[type]}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                    {title && (
                        <p className={`text-sm font-semibold leading-tight mb-0.5 ${theme.title}`}>{title}</p>
                    )}
                    {message && (
                        <p className={`text-xs leading-snug ${theme.msg}`}>{message}</p>
                    )}
                </div>
                <button
                    onClick={dismiss}
                    aria-label="Dismiss notification"
                    className="flex-shrink-0 mt-0.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-md p-0.5 hover:bg-gray-100"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" className="w-4 h-4">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
            <div className="h-0.5 w-full bg-gray-100">
                <div
                    className={`h-full ${theme.progress}`}
                    style={{ width: `${progress}%`, transition: 'none' }}
                />
            </div>
        </div>
    );
}

export default function NotificationToastPopup({ toasts, onRemove }) {
    return (
        <div
            aria-label="Notifications"
            className="fixed top-5 right-5 z-[99999] flex flex-col items-end pointer-events-none"
            style={{ maxWidth: '20rem' }}
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} {...toast} onRemove={onRemove} />
            ))}
        </div>
    );
}