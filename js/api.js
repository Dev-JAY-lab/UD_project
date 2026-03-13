const API_URL = 'http://127.0.0.1:5000/api';

const api = {
    async signup(userData) {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return res.json();
    },

    async login(userData) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return res.json();
    },

    async getBlogs() {
        const res = await fetch(`${API_URL}/blogs`);
        return res.json();
    },

    async createBlog(formData, token) {
        const res = await fetch(`${API_URL}/blogs`, {
            method: 'POST',
            headers: { 'x-auth-token': token },
            body: formData
        });
        return res.json();
    },

    async likeBlog(id, token) {
        const res = await fetch(`${API_URL}/blogs/like/${id}`, {
            method: 'PUT',
            headers: { 'x-auth-token': token }
        });
        return res.json();
    },

    async commentOnBlog(id, text, token) {
        const res = await fetch(`${API_URL}/blogs/comment/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ text })
        });
        return res.json();
    },

    async saveBlog(id, token) {
        const res = await fetch(`${API_URL}/blogs/save/${id}`, {
            method: 'PUT',
            headers: { 'x-auth-token': token }
        });
        return res.json();
    },

    async getUserProfile(userId) {
        const res = await fetch(`${API_URL}/users/profile/${userId}`);
        return res.json();
    },

    async getCurrentUser(token) {
        const res = await fetch(`${API_URL}/users/me`, {
            headers: { 'x-auth-token': token }
        });
        return res.json();
    }
};

export default api;
