import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { colors } from "../styles/theme";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FORM SUBMITTED"); // 👈 ADD HERE
  console.log("Form data:", form); // 👈 optional (see email/password)


    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      console.log("LOGIN SUCCESS"); // 👈 also useful
    
      navigate("/");
    } catch (err) {
        console.log("LOGIN ERROR:", err); // 👈 VERY IMPORTANT

      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: colors.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Nunito', sans-serif", padding: 20,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lora:ital,wght@0,600;1,400&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Lora',serif", fontSize: "2rem", fontWeight: 600, color: colors.text }}>
            Campus<span style={{ fontStyle: "italic", color: colors.primary }}>Connect</span>
          </div>
          <div style={{ fontSize: "0.88rem", color: colors.textMuted, marginTop: 6 }}>
            Your university social network
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "white", borderRadius: 20, padding: "32px 36px",
          boxShadow: "0 8px 32px rgba(79,110,247,0.12)", border: `1px solid ${colors.border}`,
        }}>
          <div style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: 22, color: colors.text }}>
            Welcome back 👋
          </div>

          {error && (
            <div style={{ background: "#FEE2E2", color: "#991B1B", borderRadius: 10, padding: "10px 14px", fontSize: "0.83rem", fontWeight: 700, marginBottom: 18 }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 800, color: colors.textMuted, display: "block", marginBottom: 6 }}>
                College Email
              </label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} required
                placeholder="rahul@kjsce.edu"
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 800, color: colors.textMuted, display: "block", marginBottom: 6 }}>
                Password
              </label>
              <input
                name="password" type="password" value={form.password}
                onChange={handleChange} required
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: 13,
                background: loading ? colors.border : "linear-gradient(135deg,#4F6EF7,#7B61FF)",
                color: "white", border: "none", borderRadius: 12,
                fontFamily: "'Nunito',sans-serif", fontSize: "0.95rem", fontWeight: 900,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Logging in…" : "Login →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 18, fontSize: "0.85rem", color: colors.textMuted }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: colors.primary, fontWeight: 800, textDecoration: "none" }}>
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "11px 14px",
  border: `2px solid #e4e7f5`, borderRadius: 10,
  fontFamily: "'Nunito',sans-serif", fontSize: "0.9rem",
  outline: "none", color: "#1a1d2e", background: "#f0f2fc",
  boxSizing: "border-box",
};