import React, { useState } from 'react';
import { User, Edit, Trash2, MessageCircle, Fish, Scale, Ruler, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const PostCard = ({ post, onEdit, onDelete, onRefresh }) => {
    const { user } = useAuth();
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await api.createComment(post.id, newComment);
            setNewComment('');
            setShowCommentForm(false);
            onRefresh();
        } catch (error) {
            alert('Erreur lors de l\'ajout du commentaire');
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editCommentText.trim()) return;

        try {
            await api.updateComment(commentId, editCommentText);
            setEditingComment(null);
            setEditCommentText('');
            onRefresh();
        } catch (error) {
            alert('Erreur lors de la modification du commentaire');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return;

        try {
            await api.deleteComment(commentId);
            onRefresh();
        } catch (error) {
            alert('Erreur lors de la suppression du commentaire');
        }
    };

    const isOwner = user?.userName === post.userName;

    return (
        <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
                {/* En-tête du post */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">@{post.userName}</h3>
                            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                        </div>
                    </div>
                    {isOwner && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => onEdit(post)}
                                className="p-2 text-gray-600 hover:text-blue-600"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => onDelete(post.id)}
                                className="p-2 text-gray-600 hover:text-red-600"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Contenu du post */}
                <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-4">{post.description}</p>

                {/* Informations de pêche */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
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
                        <div className="flex items-center space-x-2 col-span-2 md:col-span-4">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">{formatDate(post.catchDate)}</span>
                        </div>
                    )}
                </div>

                {/* Section commentaires */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                            Commentaires ({post.comments?.length || 0})
                        </h4>
                        <button
                            onClick={() => setShowCommentForm(!showCommentForm)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                            <MessageCircle className="h-4 w-4" />
                            <span>Commenter</span>
                        </button>
                    </div>

                    {/* Formulaire de nouveau commentaire */}
                    {showCommentForm && (
                        <form onSubmit={handleAddComment} className="mb-4">
              <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Écrivez votre commentaire..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  maxLength="1000"
                  required
              />
                            <div className="flex space-x-2 mt-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Publier
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCommentForm(false);
                                        setNewComment('');
                                    }}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Liste des commentaires */}
                    <div className="space-y-3">
                        {post.comments?.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                            <User className="h-3 w-3 text-gray-600" />
                                        </div>
                                        <span className="font-medium text-sm">@{comment.userName}</span>
                                        <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                                    </div>
                                    {user?.userName === comment.userName && (
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => {
                                                    setEditingComment(comment.id);
                                                    setEditCommentText(comment.content);
                                                }}
                                                className="p-1 text-gray-500 hover:text-blue-600"
                                            >
                                                <Edit className="h-3 w-3" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="p-1 text-gray-500 hover:text-red-600"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {editingComment === comment.id ? (
                                    <div>
                    <textarea
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                        maxLength="1000"
                    />
                                        <div className="flex space-x-2 mt-2">
                                            <button
                                                onClick={() => handleEditComment(comment.id)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingComment(null);
                                                    setEditCommentText('');
                                                }}
                                                className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400 text-sm"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-700 text-sm">{comment.content}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;