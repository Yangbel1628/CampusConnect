import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { colors } from "../styles/theme";

const DEPARTMENTS = ["CSE", "ECE", "Mechanical", "Civil", "Chemical", "IT", "Other"];
const YEARS       = ["1st", "2nd", "3rd", "4th"];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]       = useState({ name: "", email: "", password: "", department: "", year: "1st", studentId: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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

      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "'Lora',serif", fontSize: "2rem", fontWeight: 600 }}>
            Campus<span style={{ fontStyle: "italic", color: colors.primary }}>Connect</span>
          </div>
          <div style={{ fontSize: "0.88rem", color: colors.textMuted, marginTop: 6 }}>Create your student account</div>
        </div>

        {/* Card */}
        <div style={{
          background: "white", borderRadius: 20, padding: "32px 36px",
          boxShadow: "0 8px 32px rgba(79,110,247,0.12)", border: `1px solid ${colors.border}`,
        }}>
          <div style={{ fontSize: "1.2rem", fontWeight: 900, marginBottom: 22 }}>Join your campus 🎓</div>

          {error && (
            <div style={{ background: "#FEE2E2", color: "#991B1B", borderRadius: 10, padding: "10px 14px", fontSize: "0.83rem", fontWeight: 700, marginBottom: 18 }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <Field label="Full Name" name="name" placeholder="Rahul Sharma" value={form.name} onChange={handleChange} required />
              <Field label="Student ID" name="studentId" placeholder="CS2021045" value={form.studentId} onChange={handleChange} />
            </div>

            <Field label="College Email" name="email" type="email" placeholder="rahul@kjsce.edu" value={form.email} onChange={handleChange} required style={{ marginBottom: 14 }} />
            <Field label="Password" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required style={{ marginBottom: 14 }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
              {/* Department */}
              <div>
                <label style={labelStyle}>Department</label>
                <select name="department" value={form.department} onChange={handleChange} style={inputStyle}>
                  <option value="">Select dept…</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {/* Year */}
              <div>
                <label style={labelStyle}>Year</label>
                <select name="year" value={form.year} onChange={handleChange} style={inputStyle}>
                  {YEARS.map((y) => <option key={y} value={y}>{y} Year</option>)}
                </select>
              </div>
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
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 18, fontSize: "0.85rem", color: colors.textMuted }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: colors.primary, fontWeight: 800, textDecoration: "none" }}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, style, ...props }) {
  return (
    <div style={style}>
      <label style={labelStyle}>{label}</label>
      <input {...props} style={inputStyle} />
    </div>
  );
}

const labelStyle = { fontSize: "0.8rem", fontWeight: 800, color: "#7a7f99", display: "block", marginBottom: 6 };
const inputStyle = {
  width: "100%", padding: "11px 14px", border: "2px solid #e4e7f5", borderRadius: 10,
  fontFamily: "'Nunito',sans-serif", fontSize: "0.9rem", outline: "none",
  color: "#1a1d2e", background: "#f0f2fc", boxSizing: "border-box",
};