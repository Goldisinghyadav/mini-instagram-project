<img width="1913" height="916" alt="image" src="https://github.com/user-attachments/assets/c2d8f501-abc0-4502-9b67-004a1692880d" />
<img width="1917" height="964" alt="Screenshot 2026-02-21 120654" src="https://github.com/user-attachments/assets/15c57743-401e-470f-8d16-a3241e83ffbf" />


# Pixgram — Mini Instagram Clone

A full-stack, responsive "Mini Instagram" web application built to allow users to register, log in, share photos with captions, and view a paginated feed of posts from the community.

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) stored in HTTP-only cookies, bcryptjs for password hashing
- **File Uploads:** Multer (local disk storage)
- **Frontend Template Engine:** EJS (Embedded JavaScript)
- **Styling:** Custom CSS (Modern, responsive, glassmorphism UI elements)

## ✨ Core Features

1. **User Authentication & Security**
   - Secure User Registration and Login.
   - Passwords hashed using `bcryptjs` before hitting the database.
   - Seamless authentication using JWT stored in secure `httpOnly` cookies to protect against XSS attacks.
   - Protected routes using custom authentication middleware.

2. **Post Module (Create, Read, Update, Delete)**
   - Upload new photos with captions.
   - Image uploads handled robustly by `multer` (saving to the `/uploads/` directory).
   - Edit your own post captions and delete your own posts (with proper ownership verification in the backend).
   - "10-post limit" system per user to prevent storage abuse.

3. **Feed & Pagination**
   - A clean, responsive feed displaying the latest posts from all users.
   - Server-side pagination API serving exactly 4 posts per page to maintain performance and reduce bandwidth.
   
4. **User Profiles**
   - Public profile pages showing user information, post count, and a beautiful grid of all the user's uploaded photos (`/posts/profile/:username`).

5. **Flash Messages**
   - Beautiful, auto-dismissing toast notifications for login success, registration, errors, and access denials using `connect-flash`.

## 📂 Project Structure

```text
mini-instagram-project/
├── config/
│   └── db.js               # MongoDB Mongoose connection string setup
├── middleware/
│   └── auth.js             # JWT verification middleware (route protection)
├── models/
│   ├── User.js             # Mongoose User schema & password hashing hooks
│   └── Post.js             # Mongoose Post schema (caption, image, user ref)
├── routes/
│   ├── auth.js             # /register, /login, /logout endpoints
│   └── posts.js            # /posts CRUD endpoints and pagination logic
├── public/                 
│   └── css/style.css       # Complete UI design system and responsive grid
├── uploads/                # Directory where user uploaded images are saved
├── views/                  # EJS Template files
│   ├── auth/               # register.ejs, login.ejs
│   ├── partials/           # header, navbar, footer (reusable UI)
│   ├── posts/              # index (feed), create, edit views
│   ├── profile.ejs         # User profile grid page
│   └── 404.ejs             # Custom 'Page Not Found'
├── .env                    # Environment variables (Mongo URI, JWT Secret)
├── app.js                  # Main Express server entry point
└── package.json            # Dependencies and npm scripts
```

## 🛠️ How to Run Locally

### 1. Prerequisites
- Node.js installed on your machine.
- A MongoDB cluster (Atlas cloud) or a local MongoDB instance running.

### 2. Installation
Clone the project or navigate to the project directory, then install the required npm packages:
```bash
npm install
```

### 3. Environment Variables
Ensure you have an `.env` file in the root directory. You can use the provided `.env.example` as a template.
```ini
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster...
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
SESSION_SECRET=your_super_secret_session_key
```

### 4. Start the Application
Run the local development server:
```bash
npm run dev
```

### 5. View in Browser
Open your web browser and go to:
`http://localhost:3000`

---
*Built with ❤️ utilizing Node.js, Express, MongoDB, and EJS.*
