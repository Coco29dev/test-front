import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                api.setToken(token);
                const userData = await api.getCurrentUser();
                setUser(userData);
            }
        } catch (error) {
            localStorage.removeItem('token');
            api.setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.login(credentials);
            if (response.user) {
                setUser(response.user);
            } else {
                setUser(response); // Au cas où la structure de réponse serait différente
            }
            return response;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.register(userData);
            // Auto-login après inscription réussie
            if (response.token || response.user) {
                // Si le register retourne un token, on set l'utilisateur
                if (response.user) {
                    setUser(response.user);
                } else {
                    // Sinon on fait un login automatique
                    const loginResponse = await api.login({
                        userName: userData.userName,
                        password: userData.password
                    });
                    setUser(loginResponse.user || loginResponse);
                }
            }
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        api.setToken(null);
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};