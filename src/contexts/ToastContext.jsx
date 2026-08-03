import { createContext, useCallback, useContext, useState } from 'react';
import NotificationToastPopup from '../components/common/NotificationToastPopup';

const ToastContext = createContext(null);

let _nextId = 1;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
        const id = _nextId++;
        setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    /* Convenience shortcuts */
    const toast = {
        success: (title, message, duration) => showToast({ type: 'success', title, message, duration }),
        error:   (title, message, duration) => showToast({ type: 'error',   title, message, duration }),
        warning: (title, message, duration) => showToast({ type: 'warning', title, message, duration }),
        info:    (title, message, duration) => showToast({ type: 'info',    title, message, duration }),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <NotificationToastPopup toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
};