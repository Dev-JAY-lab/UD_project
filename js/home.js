import api from "./api.js";

// Home page initialization
const feed = document.getElementById("blogFeed");
const searchInput = document.getElementById("searchInput");

let allBlogs = [];
let filteredBlogs = [];
let displayedCount = 0;
const BATCH_SIZE = 50; // Temporarily increase batch size to see all blogs
let isLoading = false;

const ICONS = {
  heart: `<svg class="icon-heart" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
  comment: `<svg class="icon-comment" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 0 0 1 2-2h14a2 0 0 1 2 2z"/></svg>`,
  share: `<svg class="icon-share" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>`,
  save: `<svg class="icon-save" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3H7a2 0 0 0-2 2v16l7-3 7 3V5a2 0 0 0-2-2z"/></svg>`,
};

function createCard(blog) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = blog._id;

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const authorName = blog.author?.username || "Anonymous";
  const isLiked = blog.likes?.some(
    (id) => id.toString() === (currentUser.id || currentUser._id)?.toString(),
  );

  card.innerHTML = `
      <div class="card-content">
        <span class="meta">${authorName}</span>
        <h2>${blog.title || "Untitled"}</h2>
        <p>${(blog.content || "").substring(0, 120)}...</p>

        <div class="actions">
          <button class="action-btn like-btn ${isLiked ? "active" : ""}">
            ${ICONS.heart} <span>${blog.likes?.length || 0}</span>
          </button>
          <button class="action-btn comment-btn">
            ${ICONS.comment} <span>${blog.comments?.length || 0}</span>
          </button>
          <button class="action-btn share-btn">
            ${ICONS.share}
          </button>
          <button class="action-btn save-btn">
            ${ICONS.save}
          </button>
        </div>

        <div class="meta">${new Date(blog.createdAt).toLocaleDateString()}</div>
      </div>

      <img src="${blog.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400"}" onerror="this.src='https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400'" loading="lazy">
      <div class="heart-popup">❤️</div>
    `;

  // Like Interaction
  const likeBtn = card.querySelector(".like-btn");
  likeBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    const data = await api.likeBlog(blog._id, token);
    const countSpan = likeBtn.querySelector("span");
    countSpan.textContent = data.length;

    // Animation
    const heartPopup = card.querySelector(".heart-popup");
    heartPopup.classList.add("animate");
    setTimeout(() => heartPopup.classList.remove("animate"), 800);

    likeBtn.classList.toggle("active");
  });

  // Save Interaction
  const saveBtn = card.querySelector(".save-btn");
  saveBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    await api.saveBlog(blog._id, token);
    saveBtn.classList.toggle("active");
    saveBtn.style.transform = "scale(1.2)";
    setTimeout(() => (saveBtn.style.transform = "scale(1)"), 200);
  });

  // Comment Interaction (Navigate to detail)
  card.addEventListener("click", () => {
    sessionStorage.setItem("selectedBlogId", blog._id);
    window.location.href = "blog-detail.html";
  });

  // Share Interaction
  const shareBtn = card.querySelector(".share-btn");
  shareBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/blog-detail.html?id=${blog._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title || "Check out this blog!",
          url: url
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  });

  return card;
}

// Utility to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function processFeed(blogs) {
  // Temporarily disable filtering to see all blogs
  // Return blogs sorted by creation date (newest first)
  return blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function renderNextBatch() {
  if (isLoading || displayedCount >= filteredBlogs.length) return;

  isLoading = true;
  console.log(
    "Rendering next batch. displayedCount:",
    displayedCount,
    "filteredBlogs.length:",
    filteredBlogs.length,
  );
  const loadingIndicator = document.createElement("div");
  loadingIndicator.className = "loading-spinner";
  loadingIndicator.innerHTML = "Loading more stories...";
  feed.appendChild(loadingIndicator);

  // Simulate small delay for "Real" feel
  await new Promise((r) => setTimeout(r, 600));

  const fragment = document.createDocumentFragment();
  const nextBatch = filteredBlogs.slice(
    displayedCount,
    displayedCount + BATCH_SIZE,
  );
  console.log(
    "NextBatch length:",
    nextBatch.length,
    "nextBatch items",
    nextBatch.map((b) => b._id),
  );

  nextBatch.forEach((blog) => {
    console.log("Creating card for blog:", blog._id);
    fragment.appendChild(createCard(blog));
  });

  loadingIndicator.remove();
  feed.appendChild(fragment);
  displayedCount += BATCH_SIZE;
  isLoading = false;
}

// Infinite Scroll Listener
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
    renderNextBatch();
  }
});

async function init() {
  try {
    const blogs = await api.getBlogs();
    console.log("Fetched blogs:", blogs);
    console.log("Number of blogs:", blogs.length);
    allBlogs = blogs;
    filteredBlogs = processFeed(allBlogs);
    console.log("Filtered blogs:", filteredBlogs);

    feed.innerHTML = "";
    renderNextBatch(); // Initial batch

    renderTrendingBlogs();
    renderRecentBlogs();
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
  }
}

function searchBlogs() {
  const query = searchInput.value.toLowerCase().trim();
  const matched = allBlogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(query) ||
      blog.content.toLowerCase().includes(query) ||
      blog.author.username.toLowerCase().includes(query),
  );

  displayedCount = 0;
  filteredBlogs = processFeed(matched);
  feed.innerHTML = "";
  renderNextBatch();
}

function renderTrendingBlogs() {
  const trendingSection = document.getElementById("trendingSection");
  if (!trendingSection || !allBlogs.length) return;

  // Safe sort with null checks for likes
  const trending = [...allBlogs]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 5);

  let html = "<h3>🔥 Trending</h3>";
  trending.forEach((blog) => {
    const authorName = blog.author?.username || "Anonymous";
    const title = blog.title || "Untitled";
    const likesCount = blog.likes?.length || 0;
    const commentsCount = blog.comments?.length || 0;

    html += `
      <div class="pick" style="cursor:pointer" onclick="sessionStorage.setItem('selectedBlogId', '${blog._id}'); window.location.href='blog-detail.html'">
        <h4>${title.substring(0, 40)}...</h4>
        <span>❤️ ${likesCount} • 💬 ${commentsCount}</span>
        <span style="color: var(--muted); font-size: 12px;">by ${authorName}</span>
      </div>
    `;
  });
  trendingSection.innerHTML = html;
}

function renderRecentBlogs() {
  const recentSection = document.getElementById("recentSection");
  if (!recentSection || !allBlogs.length) return;

  const recent = [...allBlogs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  let html = "<h3>📅 Recent Posts</h3>";
  recent.forEach((blog) => {
    const authorName = blog.author?.username || "Anonymous";
    const title = blog.title || "Untitled";

    html += `
      <div class="pick" style="cursor:pointer" onclick="sessionStorage.setItem('selectedBlogId', '${blog._id}'); window.location.href='blog-detail.html'">
        <h4>${title.substring(0, 40)}...</h4>
        <span>${new Date(blog.createdAt).toLocaleDateString()}</span>
        <span style="color: var(--muted); font-size: 12px;">by ${authorName}</span>
      </div>
    `;
  });
  recentSection.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", init);
searchInput.addEventListener("input", searchBlogs);
