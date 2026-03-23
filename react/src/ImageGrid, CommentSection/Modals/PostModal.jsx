import { colors } from "../../styles/theme";

export default function PostModal({ onClose }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(26,29,46,0.55)",
        backdropFilter: "blur(3px)", zIndex: 400,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div style={{
        background: "white", borderRadius: 16, width: 520, maxWidth: "95vw",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", borderBottom: `1px solid ${colors.border}`,
          fontWeight: 900, fontSize: "1rem", textAlign: "center", position: "relative",
        }}>
          Create Post
          <button
            onClick={onClose}
            style={{
              position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
              width: 30, height: 30, borderRadius: "50%", border: "none",
              background: colors.bg, cursor: "pointer", fontSize: "0.9rem",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(135deg, #4F6EF7, #7B61FF)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
            }}>
              🧑‍🎓
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>Rahul Sharma</div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.78rem",
                fontWeight: 700, color: colors.primary, padding: "4px 10px", borderRadius: 20,
                border: `1.5px solid ${colors.primary}`, background: colors.primaryLight,
                cursor: "pointer", marginTop: 4,
              }}>
                🌐 Everyone ▾
              </div>
            </div>
          </div>
          <textarea
            placeholder="What's on your mind, Rahul? Share a thought, ask a question, or start a discussion…"
            style={{
              width: "100%", minHeight: 100, border: "none", outline: "none",
              fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem",
              resize: "none", color: colors.text,
            }}
          />
        </div>

        {/* Footer */}
        <div style={{
          borderTop: `1px solid ${colors.border}`, padding: "12px 20px",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          {["🖼️", "📊", "📄", "📅", "👥"].map((icon, i) => (
            <button key={i} style={{
              width: 36, height: 36, borderRadius: "50%", border: "none",
              background: colors.bg, cursor: "pointer", fontSize: "1rem",
            }}>
              {icon}
            </button>
          ))}
          <button style={{
            marginLeft: "auto", padding: "9px 28px", background: colors.primary,
            color: "white", border: "none", borderRadius: 20,
            fontFamily: "'Nunito', sans-serif", fontSize: "0.88rem", fontWeight: 800, cursor: "pointer",
          }}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
