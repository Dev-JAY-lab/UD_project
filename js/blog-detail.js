import api from "./api.js";
const ICONS = {
  heart: `<svg class="icon-heart" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
  comment: `<svg class="icon-comment" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  share: `<svg class="icon-share" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>`,
  save: `<svg class="icon-save" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z"/></svg>`
};

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get('id') || sessionStorage.getItem("selectedBlogId");

  if (!token || !currentUser || !blogId) {
    window.location.href = "blog.html";
    return;
  }

  const container = document.getElementById("blogContent");
  if (!container) return;

  try {
    const blogs = await api.getBlogs();
    const blog = blogs.find(b => b._id === blogId);

    if (!blog) {
      container.innerHTML = '<p style="padding:20px;text-align:center;color:var(--muted);">Blog not found.</p>';
      return;
    }

    const isLiked = blog.likes.includes(currentUser.id);

    container.innerHTML = `
      <article class="blog-detail" style="position:relative">
        <h1>${blog.title}</h1>
        <div class="meta" style="display:flex; align-items:center; gap:8px;">
            <img src="${blog.author && blog.author.profilePic ? blog.author.profilePic : `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author ? blog.author.username : 'User')}&background=random&color=fff`}" 
                 alt="${blog.author ? blog.author.username : 'Author'}" 
                 style="width:30px; height:30px; border-radius:50%; object-fit:cover;">
            By ${blog.author ? blog.author.username : 'Unknown'} • ${new Date(blog.createdAt).toLocaleDateString()}
        </div>
        <img src="${blog.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}" alt="${blog.title}" style="width:100%; border-radius:12px; margin:20px 0;">
        <div class="content blog-post-content">
            ${marked.parse(blog.content)}
        </div>

        <div class="actions detail-actions" style="border-top:1px solid #eee; padding-top:20px; margin-bottom:40px;">
           <button class="action-btn like-btn ${isLiked ? 'active' : ''}">${ICONS.heart} <span>${blog.likes.length}</span></button>
           <button class="action-btn comment-btn">${ICONS.comment} <span>${blog.comments.length}</span></button>
           <button class="action-btn share-btn">${ICONS.share} <span>Share</span></button>
           <button class="action-btn save-btn">${ICONS.save} <span>Save</span></button>
        </div>

        <section class="comment-section">
            <h3>Comments (${blog.comments.length})</h3>
            <div id="commentList" style="margin:20px 0;">
                ${blog.comments.map(c => {
                    const user = c.user || { username: 'Unknown User' };
                    let avatarUrl = user.profilePic ? user.profilePic : "";
                    
                    // Ensure the URL starts with / if it's a relative path
                    if (avatarUrl && !avatarUrl.startsWith('http') && !avatarUrl.startsWith('/')) {
                        avatarUrl = '/' + avatarUrl;
                    }

                    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random&color=fff`;
                    const src = avatarUrl || fallbackUrl;
                    
                    return `
                    <div class="comment-item" style="display:flex; gap:12px; padding:15px; border-bottom:1px solid var(--border); align-items: flex-start;">
                        <img src="${src}" 
                             onerror="this.src='${fallbackUrl}'"
                             alt="${user.username}"
                             style="width:42px; height:42px; border-radius:50%; object-fit:cover; border: 2px solid var(--border); flex-shrink:0; background: var(--card);">
                        <div style="flex-grow:1;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-weight:700; color:var(--text); font-size:14px;">${user.username}</span>
                                <small style="color:var(--muted); font-size:11px;">${new Date(c.createdAt).toLocaleDateString()}</small>
                            </div>
                            <p style="margin-top:4px; color:var(--text); line-height: 1.5; font-size:15px;">${c.text}</p>
                        </div>
                    </div>
                `}).join('')}
            </div>
            
            <div class="add-comment" style="margin-top:20px;">
                <textarea id="commentInput" placeholder="Add a comment..." style="width:100%; padding:15px; border-radius:12px; border:1px solid #ddd; background:var(--card); color:var(--text); min-height:100px;"></textarea>
                <button id="postComment" class="btn primary" style="margin-top:10px;">Post Comment</button>
            </div>
        </section>

        <div style="margin-top:50px;">
          <a href="blog.html" class="btn ghost">&larr; Back to blogs</a>
        </div>
        <div class="heart-popup">❤️</div>
      </article>
    `;

    // Interactions
    const likeBtn = container.querySelector('.like-btn');
    likeBtn.addEventListener('click', async () => {
      const data = await api.likeBlog(blog._id, token);
      likeBtn.querySelector('span').textContent = data.length;
      likeBtn.classList.toggle('active');

      const popup = container.querySelector('.heart-popup');
      popup.classList.add('animate');
      setTimeout(() => popup.classList.remove('animate'), 800);
    });

    const shareBtn = container.querySelector('.share-btn');
    shareBtn.addEventListener('click', async () => {
      const shareUrl = `${window.location.origin}/blog-detail.html?id=${blog._id}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: blog.title,
            url: shareUrl
          });
        } catch (err) {
          console.error("Error sharing:", err);
        }
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert("Link copied to clipboard!");
        }).catch(err => {
          console.error("Failed to copy link: ", err);
        });
      }
    });

    const postBtn = document.getElementById('postComment');
    postBtn.addEventListener('click', async () => {
      const text = document.getElementById('commentInput').value;
      if (!text) return;

      postBtn.disabled = true;
      postBtn.textContent = 'Posting...';

      await api.commentOnBlog(blog._id, text, token);
      location.reload();
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Something went wrong.</p>';
  }
});

