import { useState } from "react";
import { colors } from "../../styles/theme";

const stripStyles = {
  urgent:   { background: "#FFF0F0", color: colors.accent },
  important:{ background: "#FFF8EE", color: colors.warning },
  info:     { background: colors.primaryLight, color: colors.primary },
  general:  { background: "#F0FFF4", color: "#2D7D46" },
};

const borderColors = {
  urgent:   colors.accent,
  important: colors.warning,
  info:     colors.primary,
  general:  colors.success,
};

const deptStyles = {
  all:   { background: "#EDE9FE", color: "#5B21B6" },
  cse:   { background: "#DBEAFE", color: "#1E40AF" },
  ece:   { background: "#D1FAE5", color: "#065F46" },
  mech:  { background: "#FEF3C7", color: "#92400E" },
  admin: { background: "#FCE7F3", color: "#9D174D" },
};

const deadlineStyles = {
  urgent:  { background: "#FFF0F0", color: colors.accent },
  warning: { background: "#FFF8EE", color: colors.warning },
  safe:    { background: "#F0FFF4", color: "#2D7D46" },
};

export default function NoticeCard({ notice }) {
  const [isUnread, setIsUnread] = useState(notice.isUnread || false);

  return (
    <div
      onClick={() => setIsUnread(false)}
      style={{
        background: notice.isPinned ? "#FFFDF4" : "white",
        borderRadius: 16,
        border: notice.isPinned
          ? `2px solid ${colors.warning}`
          : `1px solid ${colors.border}`,
        borderLeft: `4px solid ${borderColors[notice.type]}`,
        boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
        marginBottom: 12,
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.15s",
      }}
    >
      {/* Top strip */}
      <div style={{
        padding: "6px 16px", fontSize: "0.7rem", fontWeight: 800,
        display: "flex", alignItems: "center", gap: 6,
        ...stripStyles[notice.type],
      }}>
        {notice.strip}
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10, background: notice.avatarBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem", flexShrink: 0,
          }}>
            {notice.avatarEmoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.97rem", fontWeight: 900, color: colors.text, lineHeight: 1.3, marginBottom: 3 }}>
              {notice.title}
            </div>
            <div style={{ fontSize: "0.73rem", color: colors.textMuted, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
              {notice.source}
              <span style={{ color: colors.border }}>·</span>
              {notice.time}
              <span style={{
                padding: "2px 8px", borderRadius: 20, fontSize: "0.68rem", fontWeight: 800, marginLeft: 4,
                ...deptStyles[notice.dept.className],
              }}>
                {notice.dept.label}
              </span>
            </div>
          </div>
          {isUnread && (
            <div style={{ width: 9, height: 9, background: colors.primary, borderRadius: "50%", flexShrink: 0, marginTop: 6 }} />
          )}
        </div>

        <div style={{ fontSize: "0.85rem", color: colors.textMuted, lineHeight: 1.55, marginBottom: 12 }}>
          {notice.description}
        </div>

        {notice.deadline && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: "0.75rem", fontWeight: 800, padding: "4px 10px",
            borderRadius: 20, marginBottom: 12,
            ...deadlineStyles[notice.deadline.type],
          }}>
            {notice.deadline.label}
          </div>
        )}

        {notice.attachments && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {notice.attachments.map((a, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 7, padding: "6px 12px",
                background: colors.bg, border: `1px solid ${colors.border}`,
                borderRadius: 8, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
              }}
                onClick={(e) => e.stopPropagation()}
              >
                {a.label}
                {a.size && <span style={{ color: colors.textMuted, fontWeight: 400 }}>{a.size}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
        borderTop: `1px solid ${colors.border}`, background: "#fafbff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: "0.75rem", color: colors.textMuted }}>
          {notice.stats.views && <span>👁️ {notice.stats.views} views</span>}
          {notice.stats.comments && <span>💬 {notice.stats.comments} comments</span>}
          {notice.stats.downloads && <span>📥 {notice.stats.downloads} downloads</span>}
        </div>
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          {notice.actions?.map((a, i) => (
            <button
              key={i}
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: "5px 14px", borderRadius: 20,
                border: `1.5px solid ${a.primary ? colors.primary : colors.border}`,
                background: a.primary ? colors.primary : "white",
                color: a.primary ? "white" : colors.textMuted,
                fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
