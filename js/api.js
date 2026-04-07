// const API_URL = "http://localhost:5000/api";
const API_URL = window.location.origin + "/api";
// Global response handler
async function handleResponse(res) {
  if (!res.ok) {
    const errorText = await res.text();
    if (res.status === 401 || (res.status === 404 && errorText.includes("User not found"))) {
      localStorage.clear();
      window.location.href = "login.html";
      return;
    }
    throw new Error(errorText || `HTTP error! status: ${res.status}`);
  }
  
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  } else {
    // some endpoints like delete return raw text or empty json 
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  }
}

const api = {
  async signup(userData) {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  async login(userData) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  async getBlogs() {
    const res = await fetch(`${API_URL}/blogs`);
    return handleResponse(res);
  },

  async createBlog(formData, token) {
    const res = await fetch(`${API_URL}/blogs`, {
      method: "POST",
      headers: { "x-auth-token": token },
      body: formData,
    });
    return handleResponse(res);
  },

  async likeBlog(id, token) {
    const res = await fetch(`${API_URL}/blogs/like/${id}`, {
      method: "PUT",
      headers: { "x-auth-token": token },
    });
    return handleResponse(res);
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
    return handleResponse(res);
  },

  async saveBlog(id, token) {
    const res = await fetch(`${API_URL}/blogs/save/${id}`, {
      method: "PUT",
      headers: { "x-auth-token": token },
    });
    return handleResponse(res);
  },

  async getUserProfile(userId) {
    const res = await fetch(`${API_URL}/users/profile/${userId}`);
    return handleResponse(res);
  },

  async getCurrentUser(token) {
    const res = await fetch(`${API_URL}/users/me`, {
      headers: { "x-auth-token": token },
    });
    return handleResponse(res);
  },

  async updateUserProfile(userData, token) {
    const isFormData = userData instanceof FormData;
    const headers = { "x-auth-token": token };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_URL}/users/me`, {
      method: "PUT",
      headers,
      body: isFormData ? userData : JSON.stringify(userData),
    });
    return handleResponse(res);
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
    return handleResponse(res);
  },

  async deleteOwnBlog(id, token) {
    const res = await fetch(`${API_URL}/blogs/${id}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": token,
      },
    });
    return handleResponse(res);
  },

  async generateAIBlog(topic, token) {
    const res = await fetch(`${API_URL}/blogs/ai-generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ topic }),
    });
    return handleResponse(res);
  },

  async getNotifications(token) {
    const res = await fetch(`${API_URL}/notifications`, {
      headers: { "x-auth-token": token },
    });
    return handleResponse(res);
  },

  async markNotifAsRead(id, token) {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: { "x-auth-token": token },
    });
    return handleResponse(res);
  },

  async markAllNotifsAsRead(token) {
    const res = await fetch(`${API_URL}/notifications/read-all`, {
      method: "PUT",
      headers: { "x-auth-token": token },
    });
    return handleResponse(res);
  },
};

export default api;
