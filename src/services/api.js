const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    async handleResponse(response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    // Auth endpoints
    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(userData),
        });
        return this.handleResponse(response);
    }

    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(credentials),
        });
        const data = await this.handleResponse(response);
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async getCurrentUser() {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    // User endpoints
    async getUserProfile(userName) {
        const response = await fetch(`${API_BASE_URL}/users/${userName}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    async updateUserProfile(userData) {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(userData),
        });
        return this.handleResponse(response);
    }

    // Posts endpoints
    async getFeed() {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    async getUserPosts(userName) {
        const response = await fetch(`${API_BASE_URL}/posts/user/${userName}`, {
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    async createPost(postData) {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(postData),
        });
        return this.handleResponse(response);
    }

    async updatePost(postId, postData) {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(postData),
        });
        return this.handleResponse(response);
    }

    async deletePost(postId) {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    // Comments endpoints
    async createComment(postId, content) {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ content }),
        });
        return this.handleResponse(response);
    }

    async updateComment(commentId, content) {
        const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify({ content }),
        });
        return this.handleResponse(response);
    }

    async deleteComment(commentId) {
        const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse(response);
    }

    logout() {
        this.setToken(null);
    }
}

const api = new ApiService();
export default api;