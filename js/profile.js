import api from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  console.log("Current user:", currentUser);
  console.log("Token:", token);

  if (!token || !currentUser) {
    window.location.href = "login.html";
    return;
  }

  // Load Profile Data
  async function loadProfile() {
    try {
      const data = await api.getUserProfile(currentUser.id);
      const user = data.user;
      const blogs = data.blogs;

      document.getElementById("profileName").textContent = user.username;
      document.getElementById("profileUsername").textContent =
        `@${user.username}`;
      document.getElementById("profileBio").textContent =
        user.bio || "No bio yet.";
      document.getElementById("avatarLetter").textContent = user.username
        .charAt(0)
        .toUpperCase();

      // Render user's blogs
      const container = document.getElementById("blogContainer");
      container.innerHTML = "<h3>Your Blogs</h3>";

      if (blogs.length === 0) {
        container.innerHTML += "<p>You haven't written any blogs yet.</p>";
      }

      blogs.forEach((blog) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
                    <div class="card-content">
                        <h2>${blog.title}</h2>
                        <p>${blog.content.substring(0, 100)}...</p>
                        <div class="meta">${new Date(blog.createdAt).toLocaleDateString()}</div>
                    </div>
                `;
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
          sessionStorage.setItem("selectedBlogId", blog._id);
          window.location.href = "blog-detail.html";
        });
        container.appendChild(card);
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Publish Blog
  window.postBlog = async () => {
    const title = document.getElementById("blogTitle").value;
    const text = document.getElementById("blogText").value;
    const imageFile = document.getElementById("blogImage").files[0];

    if (!title || !text) {
      alert("Title and content are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", text);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      console.log("Creating blog with title:", title);
      const response = await api.createBlog(formData, token);
      console.log("Blog creation response:", response);

      if (response._id) {
        alert("Blog Published!");
        document.getElementById("blogTitle").value = "";
        document.getElementById("blogText").value = "";
        document.getElementById("blogImage").value = "";
        loadProfile();
      } else {
        alert(response.msg || "Failed to publish blog");
      }
    } catch (err) {
      console.error("Error creating blog:", err);
      alert("An error occurred while publishing");
    }
  };

  loadProfile();
});
