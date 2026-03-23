import { colors } from "../../styles/theme";
import { notifications } from "../../data/mockData";

export default function NotifDropdown() {
  return (
    <div style={{
      position: "fixed", top: 66, right: 80, width: 340, background: "white",
      borderRadius: 16, border: `1px solid ${colors.border}`,
      boxShadow: "0 6px 28px rgba(79,110,247,0.13)", zIndex: 300,
    }}>
      <div style={{
        padding: "14px 16px", borderBottom: `1px solid ${colors.border}`,
        fontWeight: 900, fontSize: "0.95rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        Notifications
        <span style={{ fontSize: "0.75rem", color: colors.primary, fontWeight: 700, cursor: "pointer" }}>
          Mark all read
        </span>
      </div>

      {notifications.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex", gap: 10, padding: "12px 16px", cursor: "pointer",
            borderBottom: i < notifications.length - 1 ? `1px solid ${colors.border}` : "none",
            background: item.unread ? colors.primaryLight : "white",
            alignItems: "flex-start",
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: item.iconBg,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
          }}>
            {item.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{ fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.4 }}
              dangerouslySetInnerHTML={{ __html: item.msg }}
            />
            <div style={{ fontSize: "0.7rem", color: colors.textMuted, marginTop: 3 }}>{item.time}</div>
          </div>
          {item.unread && (
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.primary, marginTop: 6 }} />
          )}
        </div>
      ))}
    </div>
  );
}
