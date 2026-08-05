import { createContext, useContext, useEffect, useState } from 'react';
import {
    destroyNetworkMonitor,
    getIsOnline,
    initNetworkMonitor,
    subscribeToNetworkChange,
    unsubscribeFromNetworkChange,
} from '../utils/networkMonitor';
import { useToast } from './ToastContext';

const NetworkContext = createContext(true);

export function NetworkProvider({ children }) {
    const [isOnline, setIsOnline] = useState(getIsOnline);
    const toast = useToast();

    useEffect(() => {
        const showToast = ({ type, title, message, duration }) => {
            toast[type]?.(title, message, duration);
        };

        // Wire the singleton to the toast system and attach browser event listeners.
        initNetworkMonitor(showToast);

        // Subscribe this component so it re-renders on connectivity change.
        subscribeToNetworkChange(setIsOnline);

        return () => {
            // Unsubscribe to avoid calling setState on an unmounted component.
            unsubscribeFromNetworkChange(setIsOnline);
            destroyNetworkMonitor();
        };
    }, []);

    return (
        <NetworkContext.Provider value={isOnline}>
            {children}
        </NetworkContext.Provider>
    );
}

export function useNetwork() {
    return useContext(NetworkContext);
}
