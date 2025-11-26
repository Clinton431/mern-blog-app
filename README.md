Here is the cleaned-up README with all sensitive/private credentials removed.
Everything now uses placeholders and safe examples only.

---

# 🚀 MyBlog — A Full-Stack MERN Blogging Platform

MyBlog is a modern, full-stack blogging platform where authenticated users can create, edit, and publish posts with images.
It’s built using MERN technologies, deployed across Vercel (frontend) and Render (backend), and styled for a clean and intuitive user experience.

This project demonstrates real-world full-stack development: authentication, protected routes, API consumption, image uploads, and responsive UI.

---

## 🌟 Features

### 🔐 Authentication

- Secure login and registration
- HTTP-only cookies for JWT tokens
- Protected routes
- Auto-authenticated user sessions

### 📝 Blog Post Management

- Create posts with title, summary, content & featured images
- Display posts on homepage
- Clean and responsive UI
- Toast-based user notifications

### 📤 Image Uploads

- Multer-powered image uploads
- Server-side storage and accessible image URLs

### 🌐 Deployment

- Frontend: Vercel
- Backend: Render
- `.env`-based environment setup
- Fully configured CORS + cookie handling

---

## 🛠 Tech Stack

### Frontend

- React (Vite)
- React Router
- React Toastify
- Context API
- Modern CSS styling

### Backend

- Node.js + Express
- MongoDB + Mongoose
- Multer (image upload)
- JWT-based authentication
- Cookie Parser
- CORS with credentials

### Deployment

- Vercel (client)
- Render (server)
- MongoDB Atlas (database)

---

## 📁 Project Structure

```
/frontend
   /src
      components/
      pages/
      UserContext.jsx
      main.jsx
   .env
   vite.config.js

/backend
   models/
   routes/
   uploads/
   index.js
   .env
```

---

## ⚙️ Environment Variables

### Frontend (`/frontend/.env`)

```
VITE_API_URL=<YOUR_BACKEND_API_URL>
```

---

## 🚀 unning Project Locally

### Clone repository

```bash
git clone <your-repo-url>
cd your-project-folder
```

### Run Backend

```bash
cd backend
npm install
npm start
```

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Deployment Instructions

### Backend (Render)

1. Create a new Web Service
2. Point it to the `/backend` directory
3. Add required environment variables
4. Deploy

### Frontend (Vercel)

1. Import project
2. Set root directory to `/frontend`
3. Add `VITE_API_URL` environment variable
4. Deploy

---

## 🧪 API Endpoints Overview

### Authentication

| Method | Endpoint    | Description      |
| ------ | ----------- | ---------------- |
| POST   | `/register` | Register user    |
| POST   | `/login`    | Login user       |
| GET    | `/profile`  | Get current user |
| POST   | `/logout`   | Logout user      |

### Posts

| Method | Endpoint    | Description       |
| ------ | ----------- | ----------------- |
| POST   | `/post`     | Create post       |
| GET    | `/post`     | Get all posts     |
| GET    | `/post/:id` | Get specific post |

---

## 🧩 Future Improvements

- Rich text editor
- Comments
- User profiles
- Tags & categories
- Dark mode
- Admin dashboard

---

## 🤝 Contributing

Contributions are welcome.
Open an issue before making major changes.

---

## 📄 License

Licensed under the MIT License.

---

## ⭐ Support the Project

If you like this project, consider starring it on GitHub! ⭐

---

If you want a GitHub badge version, a minimal version, or a more professional corporate style, I can generate those too.

