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
    const isProtected = ['blog.html', 'profile.html', 'library.html', 'blog-detail.html', 'notifications.html'].some(p => path.includes(p));
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
    const initUI = () => {
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
            fetchUnreadNotifications();
        }

        const themes = ['light', 'dark', 'purple', 'pink'];
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && savedTheme !== 'light' && themes.includes(savedTheme)) document.body.classList.add(savedTheme);
    };

    const fetchUnreadNotifications = async () => {
        const notifBadge = document.getElementById('notifBadge');
        if (!notifBadge || !token) return;

        try {
            const apiRes = await fetch(`https://ud-project.onrender.com/api/notifications`, {
                headers: { 'x-auth-token': token }
            });
            const notifs = await apiRes.json();
            const unreadCount = notifs.filter(n => !n.isRead).length;
            
            if (unreadCount > 0) {
                notifBadge.textContent = unreadCount;
                notifBadge.style.display = 'inline-block';
            } else {
                notifBadge.style.display = 'none';
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", initUI);
    } else {
        initUI();
    }

    window.toggleDark = () => {
        const themes = ['light', 'dark', 'purple', 'pink'];
        let currentTheme = localStorage.getItem('theme') || 'light';
        if (!themes.includes(currentTheme)) currentTheme = 'light';
        let nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
        
        document.body.classList.remove('dark', 'purple', 'pink');
        if (nextTheme !== 'light') document.body.classList.add(nextTheme);
        localStorage.setItem('theme', nextTheme);
    };
})();