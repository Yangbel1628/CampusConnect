import { useState } from "react";
import { colors } from "../../styles/theme";

export default function NotificationCard({ notif }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "14px 16px",
      background: notif.unread ? colors.primaryLight : "white",
      border: `1px solid ${notif.unread ? "#d4dcfc" : colors.border}`,
      borderRadius: 10, marginBottom: 6, cursor: "pointer",
      transition: "background 0.15s",
      position: "relative",
    }}>
      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: "50%", background: notif.iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.2rem", flexShrink: 0,
      }}>
        {notif.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div
          style={{ fontSize: "0.86rem", fontWeight: 600, lineHeight: 1.45, color: colors.text }}
          dangerouslySetInnerHTML={{ __html: notif.msg }}
        />
        {notif.preview && (
          <div style={{
            background: colors.bg, borderRadius: 8, padding: "8px 10px", marginTop: 8,
            fontSize: "0.78rem", color: colors.textMuted,
            borderLeft: `3px solid ${colors.border}`, lineHeight: 1.4,
          }}>
            {notif.preview}
          </div>
        )}
        {notif.actions && (
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {notif.actions.map((a, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  if (a.type === "accept") setAccepted(true);
                }}
                style={{
                  padding: "5px 14px", borderRadius: 20,
                  border: `1.5px solid ${a.type === "accept" && accepted ? colors.success : a.type === "accept" ? colors.success : colors.border}`,
                  background: a.type === "accept" ? (accepted ? "#59b866" : colors.success) : "white",
                  color: a.type === "accept" ? "white" : colors.textMuted,
                  fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
                }}
              >
                {a.type === "accept" && accepted ? "✓ Accepted" : a.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ fontSize: "0.72rem", color: colors.textMuted, marginTop: 4, fontWeight: 600 }}>
          {notif.time}
        </div>
      </div>

      {/* Unread dot */}
      {notif.unread && (
        <div style={{ width: 10, height: 10, background: colors.primary, borderRadius: "50%", flexShrink: 0, marginTop: 6 }} />
      )}
    </div>
  );
}
