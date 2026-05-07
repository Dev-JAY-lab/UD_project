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
    // Pre-populate to avoid showing "DemoUser" during loading or errors
    if (currentUser.username) {
        document.getElementById("profileName").textContent = currentUser.username;
        document.getElementById("profileUsername").textContent = `@${currentUser.username}`;
        document.getElementById("avatarLetter").textContent = currentUser.username.charAt(0).toUpperCase();
    }

    try {
      const data = await api.getUserProfile(currentUser.id);
      const user = data.user;
      const blogs = data.blogs;

      document.getElementById("profileName").textContent = user.username;
      document.getElementById("profileUsername").textContent = `@${user.username}`;
      document.getElementById("profileBio").textContent = user.bio || "No bio yet.";

      const avatarLetterEl = document.getElementById("avatarLetter");
      const profileImageEl = document.getElementById("profileImage");

      if (user.profilePic) {
          // Prepend Render backend URL if it's a relative path
          const fullImageUrl = user.profilePic.startsWith('http') ? user.profilePic : 'https://ud-project.onrender.com' + user.profilePic;
          profileImageEl.src = fullImageUrl;
          profileImageEl.style.display = "block";
          avatarLetterEl.style.display = "none";
      } else {
          profileImageEl.style.display = "none";
          avatarLetterEl.style.display = "flex";
          avatarLetterEl.textContent = user.username.charAt(0).toUpperCase();
      }

      const instaLinkEl = document.getElementById("instaLink");
      if (user.instagramLink) {
          instaLinkEl.href = user.instagramLink;
          instaLinkEl.style.display = "inline-block";
      } else {
          instaLinkEl.style.display = "none";
      }

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
      let errorMsg = "An error occurred while publishing";
      
      try {
        // Try parsing if it's stringified JSON from express-validator
        const errObj = JSON.parse(err.message);
        if (errObj.errors && errObj.errors.length > 0) {
          errorMsg = errObj.errors.map(e => e.msg).join("\n");
        } else if (errObj.msg) {
          errorMsg = errObj.msg;
        }
      } catch(e) { 
        // If it's already a plain string (like from the rate limiter), use it directly
        if (err.message) {
            errorMsg = err.message;
        }
      }
      
      alert(errorMsg);
    }
  };

  // Edit Profile
  window.editProfile = async () => {
    const currentName = document.getElementById("profileName").textContent;
    let currentBio = document.getElementById("profileBio").textContent;
    if (currentBio === "No bio yet.") currentBio = "";
    
    const instaLinkEl = document.getElementById("instaLink");
    let currentInsta = instaLinkEl.style.display !== "none" ? instaLinkEl.href : "";

    const newUsername = prompt("Enter new username:", currentName);
    if (newUsername === null) return; 

    const newBio = prompt("Enter new bio:", currentBio);
    if (newBio === null) return; 

    const newInsta = prompt("Enter new Instagram URL (leave blank to remove):", currentInsta);
    if (newInsta === null) return;

    if (!newUsername.trim()) {
      alert("Username cannot be empty.");
      return;
    }

    try {
      const response = await api.updateUserProfile({ 
          username: newUsername, 
          bio: newBio, 
          instagramLink: newInsta 
      }, token);

      // Update local storage so other pages reflect the new username
      const updatedUser = { ...currentUser, username: response.username, bio: response.bio, instagramLink: response.instagramLink };
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

  // Generate AI Blog
  window.generateAI = async () => {
    const topic = document.getElementById("blogTitle").value;
    if (!topic) {
      alert("Please enter a Topic or Title first in the input box!");
      return;
    }

    const aiBtn = document.getElementById("aiBtn");
    const originalText = aiBtn.innerHTML;
    
    // Rotating messages to make it feel faster
    const messages = ["⏳ Thinking...", "✍️ Writing...", "🪄 Polishing..."];
    let msgIndex = 0;
    aiBtn.disabled = true;
    aiBtn.innerHTML = messages[0];
    
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      aiBtn.innerHTML = messages[msgIndex];
    }, 2000);

    try {
      const response = await api.generateAIBlog(topic, token);
      if (response && response.generatedContent) {
        document.getElementById("blogText").value = response.generatedContent;
      } else {
        alert(response?.msg || "Failed to generate blog. Please try later.");
      }
    } catch (err) {
      console.error("AI Generation Error:", err);
      // If error message is weird, show a cleaner one
      const displayError = err.message || "Disconnected or server busy";
      alert("Error generating content: " + displayError);
    } finally {
      clearInterval(interval);
      aiBtn.innerHTML = originalText;
      aiBtn.disabled = false;
    }
  };

  window.uploadProfilePic = async (input) => {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const response = await api.updateUserProfile(formData, token);
      
      // Update local storage
      const updatedUser = { ...currentUser, profilePic: response.profilePic };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      alert("Profile picture updated!");
      loadProfile();
    } catch (err) {
      console.error("Error uploading profile pic:", err);
      alert("Failed to upload profile picture.");
    }
  };

  loadProfile();
});
