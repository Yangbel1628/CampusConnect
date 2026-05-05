import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NoticesPage from "./pages/NoticesPage";
import ProfilePage from "./pages/ProfilePage";
import EventsPage from "./pages/EventsPage";
import CareerPage from "./pages/CareerPage";
import MessagesPage from "./pages/MessagesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AcademicHubPage from "./pages/AcademicHubPage";

// ✅ Admin imports
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 Admin routes (keep ABOVE or BELOW doesn't matter) */}
        <Route path="/cc-admin" element={<AdminLoginPage />} />
        <Route path="/cc-admin/dashboard" element={<AdminDashboard />} />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute><HomePage /></ProtectedRoute>
        } />
        <Route path="/notices" element={
          <ProtectedRoute><NoticesPage /></ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/profile/:id" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />

        <Route path="/events" element={
          <ProtectedRoute><EventsPage /></ProtectedRoute>
        } />
        <Route path="/career" element={
          <ProtectedRoute><CareerPage /></ProtectedRoute>
        } />

        <Route path="/messages" element={
          <ProtectedRoute><MessagesPage /></ProtectedRoute>
        } />

        <Route path="/academic" element={
          <ProtectedRoute><AcademicHubPage /></ProtectedRoute>
        } />

        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><RegisterPage /></PublicRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}