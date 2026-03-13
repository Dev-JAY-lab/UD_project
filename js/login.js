console.log("Login JS Loaded");
import api from "./api.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");

  // small, non-blocking toast used instead of alert()
  function showToast(message, duration = 2500) {
    try {
      const toast = document.createElement('div');
      toast.className = 'app-toast';
      toast.textContent = message;
      Object.assign(toast.style, {
        position: 'fixed',
        right: '18px',
        bottom: '18px',
        background: 'rgba(0,0,0,0.82)',
        color: '#fff',
        padding: '10px 14px',
        borderRadius: '8px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.24)',
        zIndex: 99999,
        fontSize: '14px'
      });
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.transition = 'opacity 200ms ease';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 220);
      }, duration);
    } catch (e) {
      // fallback
      console.log(message);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';
    }

    try {
      const data = await api.login({ email, password });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        showToast('Login successful ✓');
        setTimeout(() => {
            window.location.href = "blog.html";
        }, 500);
      } else {
        throw new Error(data.msg || 'Login failed');
      }
    } catch (error) {
      showToast(error.message || 'Login failed');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign in';
      }
    }
  });

});