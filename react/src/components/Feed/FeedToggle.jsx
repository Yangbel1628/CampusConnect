import { colors } from "../../styles/theme";

export default function FeedToggle({ active, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <div style={{ display: "flex", background: "white", borderRadius: 30, padding: 4, boxShadow: "0 2px 16px rgba(79,110,247,0.08)", border: `1px solid ${colors.border}` }}>
        {["✨ For You", "🏫 College Feed"].map((label, i) => (
          <button key={i} onClick={() => onChange(i)} style={{ padding: "8px 22px", borderRadius: 26, border: "none", background: active === i ? colors.primary : "transparent", fontFamily: "'Nunito',sans-serif", fontSize: "0.85rem", fontWeight: 800, color: active === i ? "white" : colors.textMuted, cursor: "pointer", boxShadow: active === i ? "0 3px 10px rgba(79,110,247,0.3)" : "none" }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {["🔽 Filter", "🔃 Sort"].map((label) => (
          <button key={label} style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${colors.border}`, background: "white", fontFamily: "'Nunito',sans-serif", fontSize: "0.78rem", fontWeight: 700, color: colors.textMuted, cursor: "pointer" }}>{label}</button>
        ))}
      </div>
    </div>
  );
}