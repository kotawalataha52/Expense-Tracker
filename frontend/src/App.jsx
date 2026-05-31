import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/login";
import Register from "./pages/register";

// Placeholder – replace with your real Dashboard component later
function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b1120",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "20px",
      fontFamily: "Inter, sans-serif",
      color: "#e2e8f8"
    }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>
        Welcome, {user?.name} 👋
      </h1>
      <p style={{ color: "#6b7a9e" }}>Your dashboard is coming soon.</p>
      <button
        onClick={logout}
        style={{
          padding: "12px 28px",
          background: "linear-gradient(135deg, #1a8c6e, #2bde9e)",
          border: "none",
          borderRadius: "10px",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.95rem",
          cursor: "pointer"
        }}
      >
        Sign out
      </button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
