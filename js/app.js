// Custom User State Management
document.getElementById('aiBtn').disabled = true; // Disable AI button 
let currentUser = null;

try {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  window.currentUser = currentUser;
} catch (e) {
  console.error("Error reading currentUser from localStorage", e);
}

// Initial UI Update
document.addEventListener("DOMContentLoaded", () => {
  if (currentUser) {
    updateNavUser(currentUser);
  }
});

// Update nav bar user text and logout visibility
function updateNavUser(user) {
  const userNameEl = document.getElementById('userName');
  const logoutBtn = document.getElementById('logoutBtn');

  if (userNameEl) {
    userNameEl.textContent = user ? 'Welcome, ' + (user.username || user.name) : '';
  }

  if (logoutBtn) {
    logoutBtn.style.display = user ? '' : 'none';
    
    if (!logoutBtn.dataset.listener) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
        logoutBtn.dataset.listener = 'true';
    }
  }
  fetchUnreadNotifications();
}

async function fetchUnreadNotifications() {
    const notifBadge = document.getElementById('notifBadge');
    const token = localStorage.getItem('token');
    if (!notifBadge || !token) return;

    try {
        const apiRes = await fetch(`https://ud-project.onrender.com/api/notifications`, {
            headers: { 'x-auth-token': token }
        });
        const notifs = await apiRes.json();
        const unreadCount = (notifs && Array.isArray(notifs)) ? notifs.filter(n => !n.isRead).length : 0;
        
        if (unreadCount > 0) {
            notifBadge.textContent = unreadCount;
            notifBadge.style.display = 'inline-block';
        } else {
            notifBadge.style.display = 'none';
        }
    } catch (err) {
        console.error('Failed to fetch notifications:', err);
    }
}

/* ================= MAIN ================= */
document.addEventListener("DOMContentLoaded", () => {

  /* ================= THEME CYCLE ================= */
  const themes = ["light", "dark", "purple", "pink"];
  window.toggleDark = function () {
    let currentTheme = localStorage.getItem("theme") || "light";
    if (!themes.includes(currentTheme)) currentTheme = "light";
    let nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
    
    document.body.classList.remove("dark", "purple", "pink");
    if (nextTheme !== "light") document.body.classList.add(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme && savedTheme !== "light" && themes.includes(savedTheme)) {
    document.body.classList.add(savedTheme);
  }

  /* ================= NAVIGATION & LOGOUT ================= */
  // Logout logic is now handled in updateNavUser with dataset.listener check

});
