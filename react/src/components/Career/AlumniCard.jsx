import { useState } from "react";
import { colors } from "../../styles/theme";

export default function AlumniCard({ alumni }) {
  const [connected, setConnected] = useState(false);

  return (
    <div style={{
      background: "white", borderRadius: 16, border: `1px solid ${colors.border}`,
      boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
      padding: 16, display: "flex", gap: 14, alignItems: "center", cursor: "pointer",
      transition: "box-shadow 0.2s, transform 0.1s",
    }}>
      <div style={{
        width: 54, height: 54, borderRadius: "50%", background: alumni.grad,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.5rem", flexShrink: 0, border: `2px solid ${colors.border}`,
      }}>{alumni.emoji}</div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.95rem", fontWeight: 900 }}>{alumni.name}</div>
        <div style={{ fontSize: "0.8rem", color: colors.textMuted, marginTop: 2 }}>
          {alumni.role} · <strong>{alumni.company}</strong>
        </div>
        <div style={{ fontSize: "0.72rem", color: colors.textMuted, marginTop: 4 }}>{alumni.batch}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
          {alumni.tags.map((tag, i) => (
            <span key={i} style={{
              padding: "3px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 800,
              background: colors.bg, border: `1px solid ${colors.border}`, color: colors.textMuted,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); setConnected(true); }}
        style={{
          padding: "7px 18px", borderRadius: 20, border: "none",
          background: connected ? colors.success : colors.primary,
          color: "white", fontFamily: "'Nunito', sans-serif",
          fontSize: "0.78rem", fontWeight: 800, cursor: connected ? "default" : "pointer",
          flexShrink: 0, whiteSpace: "nowrap",
        }}
      >{connected ? "✓ Connected" : "Connect"}</button>
    </div>
  );
}
