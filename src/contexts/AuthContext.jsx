import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (token) {
                const res = await getProfile();
                setUser(res.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (responseData) => {
        const accessToken = responseData?.data.accessToken;
        const refreshToken = responseData?.data.refreshToken;

        if (!accessToken) {
            console.error("[AuthContext] access_token not found in response");
            throw new Error("access_token missing from server response");
        }

        localStorage.setItem("access_token", accessToken);
        if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
        }
        await fetchUser();
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        navigate('/login')
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
