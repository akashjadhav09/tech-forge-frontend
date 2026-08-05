
let isOnline = navigator.onLine;

//Array of resolve functions from Promises returned by waitUntilOnline().

let _onlineWaiters = [];
//Set of callbacks registered by React components (for re-renders).
const listeners = new Set();
let _showToast = () => { };

let _initialized = false;

function _notifyListeners() {
    listeners.forEach((fn) => fn(isOnline));
}

function _handleOffline() {
    if (!isOnline) return;

    isOnline = false;
    _notifyListeners();
    _showToast({
        type: 'warning',
        title: 'You are offline',
        message: 'Check your internet connection. Pending requests will retry automatically.',
        duration: 6000,
    });
}

function _handleOnline() {
    if (isOnline) return;

    isOnline = true;
    _notifyListeners();
    _showToast({
        type: 'success',
        title: 'You are online',
        message: 'Connection restored. Retrying pending requests\u2026',
        duration: 4000,
    });

    // Unblock every Axios request that is waiting inside waitUntilOnline().
    const waiters = [..._onlineWaiters];
    _onlineWaiters = [];
    waiters.forEach((resolve) => resolve());
}

export function initNetworkMonitor(showToastFn) {
    if (typeof showToastFn === 'function') {
        _showToast = showToastFn;
    }

    if (_initialized) return; // Guard: only attach listeners once.
    _initialized = true;

    window.addEventListener('offline', _handleOffline);
    window.addEventListener('online', _handleOnline);
}

export function destroyNetworkMonitor() {
    window.removeEventListener('offline', _handleOffline);
    window.removeEventListener('online', _handleOnline);
    _initialized = false;
    _onlineWaiters = [];
    listeners.clear();
}

export function getIsOnline() {
    return isOnline;
}

export function waitUntilOnline() {
    return new Promise((resolve) => {
        _onlineWaiters.push(resolve);
    });
}

export function subscribeToNetworkChange(fn) {
    listeners.add(fn);
}

export function unsubscribeFromNetworkChange(fn) {
    listeners.delete(fn);
}
