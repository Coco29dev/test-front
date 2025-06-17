import React, { useState, useEffect, useCallback } from 'react';
import { Fish, Calendar, MapPin, Scale, Ruler, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const UserPosts = ({ userName, onEditPost, onDeletePost }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isOwner = user?.userName === userName;

    const loadUserPosts = useCallback(async () => {
        try {
            setLoading(true);
            const userPosts = await api.getUserPosts(userName);
            setPosts(userPosts);
            setError('');
        } catch (err) {
            setError('Erreur lors du chargement des publications');
        } finally {
            setLoading(false);
        }
    }, [userName]);

    useEffect(() => {
        loadUserPosts();
    }, [loadUserPosts]);

    const loadUserPosts = async () => {
        try {
            setLoading(true);
            const userPosts = await api.getUserPosts(userName);
            setPosts(userPosts);
            setError('');
        } catch (err) {
            setError('Erreur lors du chargement des publications');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) return;

        try {
            await api.deletePost(postId);
            loadUserPosts(); // Recharger la liste
            if (onDeletePost) onDeletePost(postId);
        } catch (err) {
            alert('Erreur lors de la suppression du post');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des publications...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
                <button
                    onClick={loadUserPosts}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-8">
                <Fish className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isOwner ? 'Vous n\'avez pas encore publié de prise' : 'Aucune publication'}
                </h3>
                <p className="text-gray-600">
                    {isOwner ? 'Partagez vos premières prises !' : 'Cet utilisateur n\'a pas encore partagé de prise.'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                Publications ({posts.length})
            </h2>

            {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow border">
                    <div className="p-6">
                        {/* En-tête du post */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{formatDate(post.createdAt)}</span>
                            </div>
                            {isOwner && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEditPost && onEditPost(post)}
                                        className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"
                                        title="Modifier"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Contenu du post */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                        <p className="text-gray-700 mb-4">{post.description}</p>

                        {/* Informations de pêche */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Fish className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium">{post.fishName}</span>
                            </div>

                            {post.weight && (
                                <div className="flex items-center space-x-2">
                                    <Scale className="h-4 w-4 text-green-600" />
                                    <span className="text-sm">{post.weight} kg</span>
                                </div>
                            )}

                            {post.length && (
                                <div className="flex items-center space-x-2">
                                    <Ruler className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm">{post.length} cm</span>
                                </div>
                            )}

                            {post.location && (
                                <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-red-600" />
                                    <span className="text-sm">{post.location}</span>
                                </div>
                            )}

                            {post.catchDate && (
                                <div className="flex items-center space-x-2 col-span-full">
                                    <Calendar className="h-4 w-4 text-orange-600" />
                                    <span className="text-sm">Pêché le {formatDate(post.catchDate)}</span>
                                </div>
                            )}
                        </div>

                        {/* Nombre de commentaires */}
                        {post.comments && post.comments.length > 0 && (
                            <div className="flex items-center space-x-2 mt-4 text-gray-600">
                                <MessageCircle className="h-4 w-4" />
                                <span className="text-sm">
                  {post.comments.length} commentaire{post.comments.length > 1 ? 's' : ''}
                </span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserPosts;