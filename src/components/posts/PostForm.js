import React, { useState } from 'react';

const PostForm = ({ post, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: post?.title || '',
        description: post?.description || '',
        fishName: post?.fishName || '',
        weight: post?.weight || '',
        length: post?.length || '',
        location: post?.location || '',
        catchDate: post?.catchDate ? new Date(post.catchDate).toISOString().slice(0, 16) : ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            weight: formData.weight ? parseFloat(formData.weight) : null,
            length: formData.length ? parseFloat(formData.length) : null,
            catchDate: formData.catchDate ? new Date(formData.catchDate).toISOString() : null
        };
        onSubmit(submitData);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
                {post ? 'Modifier la publication' : 'Nouvelle publication'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titre *
                    </label>
                    <input
                        type="text"
                        required
                        maxLength="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                    </label>
                    <textarea
                        required
                        maxLength="2000"
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Espèce de poisson *
                    </label>
                    <input
                        type="text"
                        required
                        maxLength="20"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.fishName}
                        onChange={(e) => setFormData({ ...formData, fishName: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Poids (kg)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Longueur (cm)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.length}
                            onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lieu de pêche
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de capture
                    </label>
                    <input
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.catchDate}
                        onChange={(e) => setFormData({ ...formData, catchDate: e.target.value })}
                    />
                </div>

                <div className="flex space-x-3">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        {post ? 'Modifier' : 'Publier'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;