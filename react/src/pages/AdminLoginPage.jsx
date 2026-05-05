import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Use fetch directly so NO axios interceptors interfere ──────────────────────
// Your api axios instance likely attaches the regular user token automatically,
// which can cause the admin login to fail. fetch() has no interceptors.
const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminLoginPage() {
  const navigate              = useNavigate();
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res  = await fetch(`${BACKEND}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      // ── Wrong credentials or server error
      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // ── Logged in but not admin
      if (data.user?.role !== "admin") {
        setError("Access denied. This account is not an admin.");
        return;
      }

      // ── Success — store admin token separately from normal user token
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser",  JSON.stringify(data.user));
      navigate("/cc-admin/dashboard");

    } catch (err) {
      console.error(err);
      setError("Cannot reach server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: "100%", padding: "13px 16px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 12, color: "white",
    fontFamily: "'Nunito',sans-serif", fontSize: "0.92rem",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)", fontFamily: "'Nunito',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 22, padding: "44px 38px", width: 390, maxWidth: "95vw", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: "2.8rem", marginBottom: 12 }}>🔐</div>
          <div style={{ color: "white", fontWeight: 900, fontSize: "1.4rem", letterSpacing: "-0.3px" }}>Admin Panel</div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", marginTop: 5 }}>CampusConnect · Restricted Access</div>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)", color: "#fca5a5", borderRadius: 10, padding: "10px 14px", fontSize: "0.83rem", fontWeight: 700, marginBottom: 20, textAlign: "center" }}>
            ⛔ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              required
              autoComplete="off"
              style={inp}
            />
          </div>

          <div style={{ marginBottom: 26, position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Password"
              required
              style={{ ...inp, paddingRight: 44 }}
            />
            <span
              onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: "1rem", color: "rgba(255,255,255,0.4)" }}
            >
              {showPass ? "🙈" : "👁"}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "14px", background: loading ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg,#4F6EF7,#7B61FF)", border: "none", borderRadius: 12, color: "white", fontFamily: "'Nunito',sans-serif", fontSize: "0.95rem", fontWeight: 900, cursor: loading ? "default" : "pointer" }}
          >
            {loading ? "Verifying…" : "🔓 Enter Admin Panel"}
          </button>
        </form>

        <div style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.68rem", textAlign: "center", marginTop: 28 }}>
          Unauthorized access is strictly prohibited
        </div>
      </div>
    </div>
  );
}