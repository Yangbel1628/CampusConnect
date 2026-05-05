import { useState } from "react";
import { colors } from "../../styles/theme";

export default function EventRow({ event }) {
  const [going, setGoing] = useState(event.initialGoing);

  return (
    <div style={{
      background: "white", borderRadius: 16, border: `1px solid ${colors.border}`,
      boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
      display: "flex", gap: 14, padding: "14px 16px", marginBottom: 10,
      cursor: "pointer", opacity: event.isPast ? 0.7 : 1,
      transition: "box-shadow 0.2s, transform 0.1s",
    }}>
      {/* Date block */}
      <div style={{
        minWidth: 52, textAlign: "center", background: event.dateBg,
        borderRadius: 12, padding: "8px 6px", flexShrink: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: "1.3rem", fontWeight: 900, color: event.dateColor, lineHeight: 1 }}>{event.day}</div>
        <div style={{ fontSize: "0.62rem", fontWeight: 800, color: event.dateColor, textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 2 }}>{event.month}</div>
        {event.time && <div style={{ fontSize: "0.6rem", fontWeight: 700, color: colors.textMuted, marginTop: 4 }}>{event.time}</div>}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.93rem", fontWeight: 900, color: colors.text, marginBottom: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {event.title}
          <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "3px 10px", borderRadius: 20, ...event.badgeStyle }}>{event.badge}</span>
        </div>
        <div style={{ fontSize: "0.75rem", color: colors.textMuted, display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
          {event.meta.map((m, i) => <span key={i}>{m}</span>)}
        </div>
        {event.desc && (
          <div style={{ fontSize: "0.82rem", color: colors.textMuted, marginTop: 6, lineHeight: 1.4 }}>{event.desc}</div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", gap: 8, flexShrink: 0 }}>
        <button
          onClick={(e) => { e.stopPropagation(); if (!event.isPast) setGoing(true); }}
          style={{
            padding: "7px 18px", borderRadius: 20, border: "none",
            background: event.isPast ? colors.border : going ? colors.success : colors.primary,
            color: event.isPast ? colors.textMuted : "white",
            fontFamily: "'Nunito', sans-serif", fontSize: "0.78rem", fontWeight: 800,
            cursor: event.isPast ? "default" : "pointer", whiteSpace: "nowrap",
          }}
        >
          {event.isPast ? "Ended" : going ? "✓ Going" : event.rsvpLabel}
        </button>
        <div style={{ fontSize: "0.72rem", color: colors.textMuted, fontWeight: 700, textAlign: "right" }}>
          👥 {event.going}
        </div>
      </div>
    </div>
  );
}
