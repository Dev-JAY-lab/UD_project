import api from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!token || !currentUser) {
        window.location.href = "login.html";
        return;
    }

    // Load User Data to get Saved Blogs
    async function loadLibrary() {
        try {
            const user = await api.getCurrentUser(token);
            const savedSection = document.getElementById('your-lists');
            
            // For now, let's just render saved blogs here
            savedSection.innerHTML = '<h2>Saved Stories</h2>';
            
            if (!user.savedBlogs || user.savedBlogs.length === 0) {
                savedSection.innerHTML += '<p>No stories saved yet.</p>';
                return;
            }

            // Fetch all blogs to filter saved ones
            const allBlogs = await api.getBlogs();
            const savedBlogs = allBlogs.filter(b => user.savedBlogs.includes(b._id));

            savedBlogs.forEach(blog => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-content">
                        <h2>${blog.title}</h2>
                        <p>${blog.content.substring(0, 100)}...</p>
                        <div class="meta">By ${blog.author.username}</div>
                    </div>
                `;
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    sessionStorage.setItem('selectedBlogId', blog._id);
                    window.location.href = 'blog-detail.html';
                });
                savedSection.appendChild(card);
            });
        } catch (err) {
            console.error(err);
        }
    }

    loadLibrary();
});

// Tab switching logic
window.openTab = (event, tabName) => {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(c => c.classList.remove('active'));
    
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
};
