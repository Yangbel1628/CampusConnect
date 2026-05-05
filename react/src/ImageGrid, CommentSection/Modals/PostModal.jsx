import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { postAPI } from "../../api/services";
import { colors } from "../../styles/theme";

export default function PostModal({ onClose, onPostCreated }) {
  const { user }                  = useAuth();
  const [text, setText]           = useState("");
  const [type, setType]           = useState("general");
  const [audience, setAudience]   = useState("everyone");
  const [images, setImages]       = useState([]);
  const [previews, setPreviews]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    if (!text.trim() && images.length === 0) { setError("Write something or add an image."); return; }
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("text", text);
      fd.append("type", type);
      fd.append("audience", audience);
      images.forEach((img) => fd.append("images", img));
      const { data } = await postAPI.createPost(fd);
      onPostCreated(data);
    } catch (err) { setError(err.response?.data?.message || "Failed to post."); }
    finally { setLoading(false); }
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(26,29,46,0.55)", backdropFilter: "blur(3px)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: 16, width: 520, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${colors.border}`, fontWeight: 900, fontSize: "1rem", textAlign: "center", position: "relative" }}>
          Create Post
          <button onClick={onClose} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, borderRadius: "50%", border: "none", background: colors.bg, cursor: "pointer" }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: user?.avatar ? `url(${user.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
              {!user?.avatar && "🧑‍🎓"}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>{user?.name}</div>
              <select value={audience} onChange={(e) => setAudience(e.target.value)} style={{ fontSize: "0.75rem", fontWeight: 700, color: colors.primary, border: `1.5px solid ${colors.primary}`, borderRadius: 20, padding: "3px 10px", background: colors.primaryLight, marginTop: 4, outline: "none", cursor: "pointer" }}>
                <option value="everyone">🌐 Everyone</option>
                <option value="friends">👥 Friends</option>
                <option value="department">🏫 Department</option>
              </select>
            </div>
          </div>

          {/* Post type */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {[["general","💬"],["academic","📚"],["social","✨"],["event","🎉"]].map(([t, icon]) => (
              <button key={t} onClick={() => setType(t)} style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${type === t ? colors.primary : colors.border}`, background: type === t ? colors.primaryLight : "white", fontFamily: "'Nunito',sans-serif", fontSize: "0.75rem", fontWeight: 700, color: type === t ? colors.primary : colors.textMuted, cursor: "pointer" }}>
                {icon} {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder={`What's on your mind, ${user?.name?.split(" ")[0] || ""}?`}
            style={{ width: "100%", minHeight: 100, border: "none", outline: "none", fontFamily: "'Nunito',sans-serif", fontSize: "0.95rem", resize: "none", color: colors.text }}
          />

          {previews.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginTop: 8 }}>
              {previews.map((src, i) => (
                <div key={i} style={{ aspectRatio: "1", borderRadius: 8, overflow: "hidden", position: "relative" }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button onClick={() => { setImages((p) => p.filter((_,j) => j!==i)); setPreviews((p) => p.filter((_,j) => j!==i)); }}
                    style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "white", fontSize: "0.7rem", cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {error && <div style={{ color: colors.accent, fontSize: "0.82rem", marginTop: 8, fontWeight: 700 }}>❌ {error}</div>}
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${colors.border}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ width: 36, height: 36, borderRadius: "50%", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", cursor: "pointer" }}>
            🖼️<input type="file" accept="image/*" multiple onChange={handleImages} style={{ display: "none" }} />
          </label>
          {["📊","📄","📅","👥"].map((icon,i) => (
            <button key={i} style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: colors.bg, cursor: "pointer", fontSize: "1rem" }}>{icon}</button>
          ))}
          <button onClick={handleSubmit} disabled={loading} style={{ marginLeft: "auto", padding: "9px 28px", background: loading ? colors.border : colors.primary, color: "white", border: "none", borderRadius: 20, fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}