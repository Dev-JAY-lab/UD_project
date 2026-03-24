const API_URL = "http://localhost:5000/api";

const api = {
  async signup(userData) {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP error! status: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    } else {
      throw new Error("Server returned non-JSON response");
    }
  },

  async login(userData) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP error! status: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    } else {
      throw new Error("Server returned non-JSON response");
    }
  },

  async getBlogs() {
    const res = await fetch(`${API_URL}/blogs`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  async createBlog(formData, token) {
    const res = await fetch(`${API_URL}/blogs`, {
      method: "POST",
      headers: { "x-auth-token": token },
      body: formData,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  async likeBlog(id, token) {
    const res = await fetch(`${API_URL}/blogs/like/${id}`, {
      method: "PUT",
      headers: { "x-auth-token": token },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  async commentOnBlog(id, text, token) {
    const res = await fetch(`${API_URL}/blogs/comment/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  async saveBlog(id, token) {
    const res = await fetch(`${API_URL}/blogs/save/${id}`, {
      method: "PUT",
      headers: { "x-auth-token": token },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  async getUserProfile(userId) {
    const res = await fetch(`${API_URL}/users/profile/${userId}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  async getCurrentUser(token) {
    const res = await fetch(`${API_URL}/users/me`, {
      headers: { "x-auth-token": token },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  async updateUserProfile(userData, token) {
    const res = await fetch(`${API_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  async updateOwnBlog(id, blogData, token) {
    const res = await fetch(`${API_URL}/blogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(blogData),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  async deleteOwnBlog(id, token) {
    const res = await fetch(`${API_URL}/blogs/${id}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": token,
      },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  },
};

export default api;
