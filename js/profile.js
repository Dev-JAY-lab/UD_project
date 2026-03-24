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
        card.style.position = "relative"; // for absolute positioning of dropdown
        
        const cardContent = document.createElement("div");
        cardContent.className = "card-content";
        cardContent.style.cursor = "pointer";
        cardContent.innerHTML = `
            <div style="padding-right: 30px;">
                <h2>${blog.title}</h2>
            </div>
            <p>${blog.content.substring(0, 100)}...</p>
            <div class="meta">${new Date(blog.createdAt).toLocaleDateString()}</div>
        `;
        
        cardContent.addEventListener("click", () => {
          sessionStorage.setItem("selectedBlogId", blog._id);
          window.location.href = "blog-detail.html";
        });
        card.appendChild(cardContent);

        // Three Dot Menu Container
        const menuContainer = document.createElement("div");
        menuContainer.className = "menu-options";
        menuContainer.style.position = "absolute";
        menuContainer.style.top = "15px";
        menuContainer.style.right = "15px";

        const dotBtn = document.createElement("button");
        dotBtn.className = "menu-dot-btn";
        dotBtn.innerHTML = "⋮";
        
        const dropdown = document.createElement("div");
        dropdown.className = "menu-dropdown";

        const editOpt = document.createElement("button");
        editOpt.innerHTML = "✏️ Edit";
        editOpt.onclick = async (e) => {
          e.stopPropagation();
          dropdown.classList.remove("show"); // hide menu
          const newTitle = prompt("Edit Title:", blog.title);
          if (newTitle === null) return;
          
          const newContent = prompt("Edit Content:", blog.content);
          if (newContent === null) return;

          if (!newTitle.trim() || !newContent.trim()) {
            alert("Title and content cannot be empty.");
            return;
          }

          try {
            await api.updateOwnBlog(blog._id, { title: newTitle, content: newContent }, token);
            alert("Blog updated successfully!");
            loadProfile(); 
          } catch (err) {
            console.error(err);
            alert("Failed to update blog.");
          }
        };

        const deleteOpt = document.createElement("button");
        deleteOpt.className = "delete-opt";
        deleteOpt.innerHTML = "🗑️ Delete";
        deleteOpt.onclick = async (e) => {
          e.stopPropagation();
          dropdown.classList.remove("show"); // hide menu
          if (!confirm("Are you sure you want to delete this blog?")) return;
          
          try {
            await api.deleteOwnBlog(blog._id, token);
            alert("Blog deleted successfully!");
            loadProfile(); 
          } catch (err) {
            console.error(err);
            alert("Failed to delete blog.");
          }
        };

        dropdown.appendChild(editOpt);
        dropdown.appendChild(deleteOpt);

        dotBtn.onclick = (e) => {
           e.stopPropagation();
           // Hide all other dropdowns
           document.querySelectorAll(".menu-dropdown.show").forEach(el => {
               if (el !== dropdown) el.classList.remove("show");
           });
           dropdown.classList.toggle("show");
        };

        // Close dropdown when clicking outside
        document.addEventListener("click", () => {
             dropdown.classList.remove("show");
        });

        menuContainer.appendChild(dotBtn);
        menuContainer.appendChild(dropdown);
        card.appendChild(menuContainer);

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

  // Edit Profile
  window.editProfile = async () => {
    const currentName = document.getElementById("profileName").textContent;
    let currentBio = document.getElementById("profileBio").textContent;
    if (currentBio === "No bio yet.") currentBio = "";

    const newUsername = prompt("Enter new username:", currentName);
    if (newUsername === null) return; 

    const newBio = prompt("Enter new bio:", currentBio);
    if (newBio === null) return; 

    if (!newUsername.trim()) {
      alert("Username cannot be empty.");
      return;
    }

    try {
      const response = await api.updateUserProfile({ username: newUsername, bio: newBio }, token);

      // Update local storage so other pages reflect the new username
      const updatedUser = { ...currentUser, username: response.username, bio: response.bio };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Reload profile data on page
      loadProfile();
      
      // Update the navbar
      const userNameEl = document.getElementById('userName');
      if (userNameEl) {
          userNameEl.textContent = 'Welcome, ' + response.username;
      }

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile: " + (err.message || ""));
    }
  };

  loadProfile();
});
