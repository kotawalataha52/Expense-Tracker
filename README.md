# ExpenseIQ 💸

**ExpenseIQ** is a modern, high-performance personal finance tracking web application built on the MERN stack (MongoDB, Express, React, Node.js). It provides users with a clean, minimalistic dark-theme dashboard to record incomes/expenses, filter transaction logs, and gain instant visual breakdowns of their spending habits.

---

## ✨ Features

- **🔐 Robust Authentication**:
  - Secure registration and login screens using `bcrypt` password hashing.
  - State management using React Context API (`AuthContext`) and secure `localStorage` JWT token storage.
  - Route guards (`ProtectedRoute`) to automatically redirect unauthenticated users back to login.
  - Clean client-side HTTP request/response interception via Axios.

- **📊 Dynamic Financial Dashboard**:
  - **Live Stat Cards**: Real-time totals for **Total Income**, **Total Expenses**, and **Net Balance** (color-coded based on positive/negative balance).
  - **Interactive Data Visualization**: Clean donut/pie charts built with `Recharts` showing spending distribution by category.
  - **Flexible Filter Controls**: Quick dropdown selectors to filter both charts and transaction tables by month or category.

- **📝 Complete Transaction CRUD**:
  - Create new incomes or expenses via a sleek pop-up modal.
  - Inline edit and delete capabilities (with confirmation modals to prevent accidental deletion).

- **🌱 Automatic Database Seeding**:
  - The API dynamically seeds standard default categories (*Salary*, *Freelance*, *Groceries*, *Rent*, *Utilities*, *Dining Out*, *Shopping*, etc.) specifically for new accounts when they first access their dashboard.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8 (fast hot-reloading & builds)
- **Styling**: Vanilla CSS Modules (custom glassmorphism, modern typography)
- **Charts**: Recharts (fully responsive SVG charts)
- **HTTP Client**: Axios (with automatic JWT authentication interceptors)
- **Routing**: React Router DOM v7

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) + Bcrypt.js
- **Environment**: Dotenv for configuration secrets

---

## 📂 Project Structure

```text
expense-tracker/
├── Backend/                 # Express backend server
│   ├── config/             # DB configurations
│   ├── controllers/        # Route controllers (auth, transaction, category)
│   ├── middlewares/        # Express middlewares (JWT validation, error handling)
│   ├── models/             # Mongoose schemas (User, Category, Transaction)
│   ├── routes/             # Express routes
│   ├── utils/              # Custom helper classes (ApiError, ApiResponse, asyncHandler)
│   ├── .env                # Backend environment configuration
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
├── frontend/               # React Vite frontend
│   ├── src/
│   │   ├── api/            # Axios instance configuration
│   │   ├── assets/         # AI-generated brand assets & illustrations
│   │   ├── components/     # Reusable UI (ConfirmDialog, SpendingChart, TransactionModal)
│   │   ├── context/        # React Auth Context
│   │   ├── pages/          # Page layouts (Login, Register, Dashboard)
│   │   ├── App.jsx         # App router wiring
│   │   └── main.jsx        # App entry point
│   ├── .env                # Frontend environment configuration
│   ├── package.json        # Frontend configuration
│   └── vite.config.js      # Vite build configuration
├── package.json            # Root configuration (handles backend scripts)
└── README.md               # You are here!
```

## 🌐 Deployment Instructions

### 1. Hosted Backend (Render)
- Deploy your backend directory as a Web Service on Render.
- Add all variables from your `Backend/.env` to the **Environment Variables** tab in your Render Dashboard.
- Enable auto-deploys from your Git branch.

### 2. Hosted Frontend (Vercel)
- Create a new project in Vercel.
- Select the `frontend` folder as the root directory for your build.
- Under **Environment Variables**, add:
  - `VITE_API_URL` = `https://<your-render-app>.onrender.com/api/v1`
- Click Deploy!
