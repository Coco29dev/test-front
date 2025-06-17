import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Feed from './components/posts/Feed';
import Profile from './components/profile/Profile';

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

// Composant pour rediriger les utilisateurs connectés
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return user ? <Navigate to="/" /> : children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Routes publiques */}
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />

                        {/* Routes protégées */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Feed />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile/:userName"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Route par défaut */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;