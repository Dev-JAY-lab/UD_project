import api from "./api.js";

const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const data = await api.signup({ username, email, password });
    if (data.token) {
        alert("Account created successfully! Welcome to UrbanDiary.");
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        window.location.href = "blog.html";
    } else {
        alert(data.msg || "Signup failed");
    }
  } catch (error) {
    alert(error.message);
  }
});
