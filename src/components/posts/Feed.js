import React, { useState, useEffect } from 'react';
import { Plus, Fish } from 'lucide-react';
import Header from '../layout/Header';
import PostForm from './PostForm';
import PostCard from './PostCard';
import api from '../../services/api';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPostForm, setShowPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadFeed();
    }, []);

    const loadFeed = async () => {
        try {
            setLoading(true);
            const feedData = await api.getFeed();
            setPosts(feedData);
            setError('');
        } catch (err) {
            setError('Erreur lors du chargement du fil d\'actualité');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (postData) => {
        try {
            await api.createPost(postData);
            setShowPostForm(false);
            loadFeed();
        } catch (err) {
            alert('Erreur lors de la création du post');
        }
    };

    const handleEditPost = async (postData) => {
        try {
            await api.updatePost(editingPost.id, postData);
            setEditingPost(null);
            loadFeed();
        } catch (err) {
            alert('Erreur lors de la modification du post');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) return;

        try {
            await api.deletePost(postId);
            loadFeed();
        } catch (err) {
            alert('Erreur lors de la suppression du post');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Chargement du fil d'actualité...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Bouton pour créer un nouveau post */}
                {!showPostForm && !editingPost && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <button
                            onClick={() => setShowPostForm(true)}
                            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Partager une nouvelle prise</span>
                        </button>
                    </div>
                )}

                {/* Formulaire de création de post */}
                {showPostForm && (
                    <PostForm
                        onSubmit={handleCreatePost}
                        onCancel={() => setShowPostForm(false)}
                    />
                )}

                {/* Formulaire d'édition de post */}
                {editingPost && (
                    <PostForm
                        post={editingPost}
                        onSubmit={handleEditPost}
                        onCancel={() => setEditingPost(null)}
                    />
                )}

                {/* Messages d'erreur */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={loadFeed}
                            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Réessayer
                        </button>
                    </div>
                )}

                {/* Liste des posts */}
                {posts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <Fish className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucune publication pour le moment
                        </h3>
                        <p className="text-gray-600">
                            Soyez le premier à partager vos prises !
                        </p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onEdit={setEditingPost}
                            onDelete={handleDeletePost}
                            onRefresh={loadFeed}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Feed;