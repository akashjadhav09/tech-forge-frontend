const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Listens for localStorage changes from OTHER browser tabs.
 * When another tab removes an auth token (logout), calls onLogout().
 * NOTE: The `storage` event does NOT fire in the tab that made the change —
 * only in all other tabs.
 *
 * @param {Function} onLogout - Called when a logout is detected in another tab.
 * @returns {Function} cleanup - Remove the listener (use in useEffect cleanup).
 */
export function registerAuthSyncListener(onLogout) {
    const handleStorageChange = (event) => {
        const isTokenKey =
            event.key === ACCESS_TOKEN_KEY || event.key === REFRESH_TOKEN_KEY;

        if (isTokenKey && event.newValue === null) {
            onLogout();
        }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
}

/**
 * Listens for the tab becoming visible again (user switches back to this tab).
 * On each visibility restore, checks if the auth token is still present.
 * If not, calls onLoggedOut() to redirect to /login.
 *
 * This handles the case where the `storage` event fired while the tab was
 * hidden but React Router's navigate() didn't execute reliably in the background.
 *
 * @param {Function} onLoggedOut - Called when the tab becomes visible but token is gone.
 * @returns {Function} cleanup - Remove the listener (use in useEffect cleanup).
 */
export function registerVisibilityAuthCheck(onLoggedOut) {
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            const token = localStorage.getItem(ACCESS_TOKEN_KEY);
            if (!token) {
                onLoggedOut();
            }
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}
