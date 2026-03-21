console.log("Login JS Loaded");
import api from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  // Password visibility toggle
  document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      // Update icon
      const svg = this.querySelector("svg");
      if (isPassword) {
        // Show eye-off icon
        svg.innerHTML =
          '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
      } else {
        // Show eye icon
        svg.innerHTML =
          '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
      }
    });
  });

  // small, non-blocking toast used instead of alert()
  function showToast(message, duration = 2500) {
    try {
      const toast = document.createElement("div");
      toast.className = "app-toast";
      toast.textContent = message;
      Object.assign(toast.style, {
        position: "fixed",
        right: "18px",
        bottom: "18px",
        background: "rgba(0,0,0,0.82)",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: "8px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.24)",
        zIndex: 99999,
        fontSize: "14px",
      });
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.transition = "opacity 200ms ease";
        toast.style.opacity = "0";
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
      submitBtn.textContent = "Signing in...";
    }

    try {
      const data = await api.login({ email, password });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        showToast("Login successful ✓");
        setTimeout(() => {
          window.location.href = "blog.html";
        }, 500);
      } else {
        throw new Error(data.msg || "Login failed");
      }
    } catch (error) {
      showToast(error.message || "Login failed");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Sign in";
      }
    }
  });
});
