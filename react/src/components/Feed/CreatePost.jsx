import { colors } from "../../styles/theme";

export default function CreatePost({ onOpenModal }) {
  return (
    <div style={{
      background: "white", borderRadius: 16, padding: 16, marginBottom: 16,
      boxShadow: "0 2px 16px rgba(79,110,247,0.08)", border: `1px solid ${colors.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "linear-gradient(135deg, #4F6EF7, #7B61FF)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1rem", flexShrink: 0,
        }}>
          🧑‍🎓
        </div>
        <input
          type="text"
          placeholder="What's on your mind, Rahul?"
          onClick={onOpenModal}
          readOnly
          style={{
            flex: 1, padding: "10px 16px", border: `2px solid ${colors.border}`,
            borderRadius: 30, fontFamily: "'Nunito', sans-serif", fontSize: "0.88rem",
            color: colors.textMuted, background: colors.bg, cursor: "pointer", outline: "none",
          }}
        />
      </div>
      <div style={{
        display: "flex", gap: 4, borderTop: `1px solid ${colors.border}`, paddingTop: 12,
      }}>
        {[["🖼️", "Photo"], ["📊", "Poll"], ["📄", "Resource"], ["📅", "Event"]].map(([icon, label]) => (
          <button
            key={label}
            onClick={onOpenModal}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              gap: 7, padding: "8px 4px", borderRadius: 10, border: "none",
              background: "transparent", fontFamily: "'Nunito', sans-serif",
              fontSize: "0.8rem", fontWeight: 700, color: colors.textMuted, cursor: "pointer",
            }}
          >
            <span>{icon}</span> {label}
          </button>
        ))}
      </div>
    </div>
  );
}
