import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fish, User, LogOut, Settings, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Fermer le menu quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate(`/profile/${user.userName}`);
        setShowUserMenu(false);
    };

    return (
        <header className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo et nom de l'app */}
                    <Link to="/" className="flex items-center space-x-2">
                        <Fish className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">FishOn</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-6">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Fil d'actualité
                        </Link>
                        <Link
                            to={`/profile/${user?.userName}`}
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Mon profil
                        </Link>
                    </nav>

                    {/* Menu utilisateur */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications (placeholder) */}
                        <button className="p-2 text-gray-600 hover:text-gray-800 relative">
                            <Bell className="h-5 w-5" />
                            {/* Badge de notification (exemple) */}
                            <span className="absolute top-0 right-0 block h-2 w-2 bg-red-400 rounded-full"></span>
                        </button>

                        {/* Menu utilisateur */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                            >
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <span className="hidden md:block font-medium">@{user?.userName}</span>
                            </button>

                            {/* Menu déroulant */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">@{user?.userName}</p>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                    </div>

                                    <button
                                        onClick={handleProfileClick}
                                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <User className="h-4 w-4" />
                                        <span>Mon profil</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            alert('Fonctionnalité à venir');
                                            setShowUserMenu(false);
                                        }}
                                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span>Paramètres</span>
                                    </button>

                                    <hr className="my-1" />

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Se déconnecter</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation mobile */}
            <div className="md:hidden bg-gray-50 border-t border-gray-200">
                <div className="px-4 py-2 space-y-1">
                    <Link
                        to="/"
                        className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Fil d'actualité
                    </Link>
                    <Link
                        to={`/profile/${user?.userName}`}
                        className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Mon profil
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;