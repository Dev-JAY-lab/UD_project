# 🌆 UrbanDiary

<p align="center">
  A simple and practical blogging platform with authentication, user interaction, and AI-powered content generation.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-Framework-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/AI-Gemini-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
</p>

---

## 📌 About the Project

UrbanDiary is a full-stack blogging platform built to practice real-world development.  
Instead of making just a basic CRUD app, this project focuses on features that actually matter — like authentication, user interaction, and AI-generated content.

It allows users to write blogs, explore others’ posts, and interact through likes and comments.

---

## ✨ Features

- 🔐 User Signup & Login (with secure password hashing)
- ✍️ Create, edit, and delete blog posts
- 🤖 AI-powered blog generation
- ❤️ Like system
- 💬 Comment system
- 🖼️ User profile support
- 🗄️ MongoDB database integration

---

## 🛠️ Tech Stack

| Category   | Tech |
|------------|------|
| Frontend   | HTML, CSS, JavaScript |
| Backend    | Node.js, Express.js |
| Database   | MongoDB |
| Security   | Bcrypt |
| AI         | Gemini API |

---

## 📁 Project Structure

UD_project/

├── public/        
├── views/         
├── routes/        
├── models/        
├── controllers/   
├── config/        
├── app.js         
└── package.json

---

## ⚙️ Setup Instructions

### 1. Clone the repository
git clone https://github.com/Dev-JAY-lab/UD_project.git
cd UD_project

### 2. Install dependencies
npm install

### 3. Create `.env` file
PORT=5000  
MONGO_URI=your_mongodb_connection  
JWT_SECRET=your_secret_key  
GEMINI_API_KEY=your_api_key  

### 4. Run the project
npm start

### 5. Open in browser
http://localhost:5000

---

## 🔐 Security

- Passwords are hashed using bcrypt  
- Basic input validation implemented  
- Authentication system in place  

---

## 🧪 Testing

- Manually tested login/signup  
- Checked for common vulnerabilities  
- API routes tested during development  

---

## 🚧 Future Improvements

- 🔍 Search & filter blogs  
- 📱 Better responsive UI  
- 🔔 Notifications  
- 🌐 Deployment  

---

## 👨‍💻 Author / Contributors

Jay (Dev-JAY-lab)  / Chirag (chirag2507)

---

## ⭐ Support

If you liked this project, consider giving it a star ⭐
