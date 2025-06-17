import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// Context pour l'authentification
const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Provider d'authentification
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const userData = await api.getCurrentUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const userData = await api.login(credentials);
        setUser(userData);
        return userData;
    };

    const register = async (userData) => {
        const newUser = await api.register(userData);
        // Après inscription, se connecter automatiquement
        await login({ email: userData.email, password: userData.password });
        return newUser;
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    const updateProfile = async (userData) => {
        const updatedUser = await api.updateUser(userData);
        setUser(updatedUser);
        return updatedUser;
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            updateProfile,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};