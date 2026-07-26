import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// One-time migration: move old snake_case keys → camelCase keys
// const migrateTokenKeys = () => {
//     const oldAccess = localStorage.getItem("access_token");
//     const oldRefresh = localStorage.getItem("refresh_token");

//     if (oldAccess) {
//         localStorage.setItem("accessToken", oldAccess);
//         localStorage.removeItem("access_token");
//     }
//     if (oldRefresh) {
//         localStorage.setItem("refreshToken", oldRefresh);
//         localStorage.removeItem("refresh_token");
//     }
// };

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (token) {
                const res = await getProfile();
                setUser(res.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // migrateTokenKeys(); // run migration before fetchUser
        fetchUser();
    }, []);

    const login = async (responseData) => {
        const accessToken = responseData?.data.accessToken;
        const refreshToken = responseData?.data.refreshToken;

        if (!accessToken) {
            console.error("[AuthContext] accessToken not found in response");
            throw new Error("accessToken missing from server response");
        }

        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
        }
        await fetchUser();
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
