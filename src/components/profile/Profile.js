import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Calendar, Edit, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../layout/Header';
import UserPosts from './UserPosts';
import PostForm from '../posts/PostForm';
import api from '../../services/api';

const Profile = () => {
    const { userName } = useParams(); // Récupère le userName depuis l'URL
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingPost, setEditingPost] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');

    const isOwner = user?.userName === userName;

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            const profileData = await api.getUserProfile(userName);
            setProfile(profileData);
            setError('');
        } catch (err) {
            setError('Utilisateur non trouvé');
        } finally {
            setLoading(false);
        }
    }, [userName]);

    useEffect(() => {
        if (userName) {
            loadProfile();
        }
    }, [loadProfile]);

    const handleEditPost = async (postData) => {
        try {
            await api.updatePost(editingPost.id, postData);
            setEditingPost(null);
            // Rafraîchir la liste des posts
            window.location.reload();
        } catch (err) {
            alert('Erreur lors de la modification du post');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!userName) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-yellow-800 mb-4">Aucun utilisateur spécifié</h2>
                        <p className="text-yellow-600">Veuillez vous connecter ou spécifier un nom d'utilisateur.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Chargement du profil...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-red-800 mb-4">Profil non trouvé</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Retour à l'accueil
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Bouton retour */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Retour</span>
                </button>

                {/* Formulaire d'édition de post */}
                {editingPost && (
                    <div className="mb-6">
                        <PostForm
                            post={editingPost}
                            onSubmit={handleEditPost}
                            onCancel={() => setEditingPost(null)}
                        />
                    </div>
                )}

                {/* En-tête du profil */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="h-10 w-10 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">@{profile.userName}</h1>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600">
                                        {profile.email && (
                                            <div className="flex items-center space-x-1">
                                                <Mail className="h-4 w-4" />
                                                <span className="text-sm">{profile.email}</span>
                                            </div>
                                        )}
                                        {profile.location && (
                                            <div className="flex items-center space-x-1">
                                                <MapPin className="h-4 w-4" />
                                                <span className="text-sm">{profile.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm">Membre depuis {formatDate(profile.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isOwner && (
                                <button
                                    onClick={() => alert('Fonctionnalité à venir : modifier le profil')}
                                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                                >
                                    <Edit className="h-4 w-4" />
                                    <span>Modifier le profil</span>
                                </button>
                            )}
                        </div>

                        {/* Bio/Description */}
                        {profile.bio && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-700">{profile.bio}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Onglets */}
                <div className="bg-white rounded-lg shadow">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('posts')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'posts'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Publications
                            </button>
                            <button
                                onClick={() => setActiveTab('stats')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'stats'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Statistiques
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'posts' && (
                            <UserPosts
                                userName={userName}
                                onEditPost={setEditingPost}
                                onDeletePost={() => {
                                    // Callback optionnel pour rafraîchir d'autres parties si nécessaire
                                }}
                            />
                        )}

                        {activeTab === 'stats' && (
                            <div className="text-center py-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Statistiques de pêche
                                </h3>
                                <p className="text-gray-600">
                                    Fonctionnalité à venir : statistiques détaillées des prises, espèces favorites, lieux de pêche, etc.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;