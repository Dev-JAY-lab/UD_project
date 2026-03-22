// UrbanDiary Auth Guard (Server Version)
(function() {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('currentUser');
    let currentUser = null;

    try {
        if (userRaw) currentUser = JSON.parse(userRaw);
    } catch (e) {
        localStorage.clear();
    }

    const path = window.location.pathname.toLowerCase();
    
    // Check if we are on a page that requires hiding auth elements
    const isProtected = ['blog.html', 'profile.html', 'library.html', 'blog-detail.html'].some(p => path.includes(p));
    const isAuthPage = ['login.html', 'signin.html'].some(p => path.includes(p));

    // Redirect logic
    if (isProtected && (!token || !currentUser)) {
        window.location.href = "/login.html";
        return;
    }

    if (isAuthPage && token && currentUser) {
        window.location.href = "/blog.html";
        return;
    }

    // UI Setup
    document.addEventListener("DOMContentLoaded", () => {
        const userNameEl = document.getElementById('userName');
        const logoutBtn = document.getElementById('logoutBtn');

        if (currentUser) {
            if (userNameEl) userNameEl.textContent = 'Welcome, ' + (currentUser.username || 'User');
            if (logoutBtn) {
                logoutBtn.style.display = 'inline-block';
                logoutBtn.onclick = (e) => {
                    e.preventDefault();
                    localStorage.clear();
                    window.location.href = "/login.html";
                };
            }
        }

        if (localStorage.getItem('theme') !== 'light') document.body.classList.add('dark');
    });

    window.toggleDark = () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    };
})();