import { colors } from "../../styles/theme";

function NavIconBtn({ icon, badge, badgeColor, onClick, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 38, height: 38, borderRadius: "50%", border: "none",
        background: "transparent", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.1rem", color: active ? colors.primary : colors.textMuted,
        position: "relative",
      }}
    >
      {icon}
      {badge && (
        <span style={{
          position: "absolute", top: 3, right: 3, width: 17, height: 17,
          background: badgeColor || colors.accent, borderRadius: "50%",
          fontSize: "0.6rem", fontWeight: 900, color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid white",
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

export default function Navbar({ onNotifClick, onAvatarClick }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 58,
      background: "white", borderBottom: `1px solid ${colors.border}`,
      display: "flex", alignItems: "center", padding: "0 20px", gap: 16,
      zIndex: 200, boxShadow: "0 2px 12px rgba(79,110,247,0.06)",
    }}>
      {/* Brand */}
      <div style={{
        fontFamily: "'Lora', serif", fontSize: "1.35rem", fontWeight: 600,
        color: colors.text, whiteSpace: "nowrap", letterSpacing: "-0.3px", flexShrink: 0,
      }}>
        Campus<span style={{ fontStyle: "italic", color: colors.primary }}>Connect</span>
      </div>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 420, position: "relative" }}>
        <span style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          color: colors.textMuted, fontSize: "0.95rem",
        }}>🔍</span>
        <input
          type="text"
          placeholder="Search students, clubs, events, notices…"
          style={{
            width: "100%", padding: "9px 16px 9px 40px",
            border: `2px solid ${colors.border}`, borderRadius: 30,
            fontFamily: "'Nunito', sans-serif", fontSize: "0.88rem",
            background: colors.bg, outline: "none", color: colors.text,
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
        <NavIconBtn icon="🏠" active />
        <NavIconBtn icon="📚" />
        <NavIconBtn icon="📅" />
        <NavIconBtn icon="💼" />
        <NavIconBtn icon="📢" />
        <NavIconBtn icon="🔔" badge="4" onClick={onNotifClick} />
        <NavIconBtn icon="💬" badge="2" badgeColor={colors.success} />
        <div
          onClick={onAvatarClick}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #4F6EF7, #7B61FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem", cursor: "pointer",
            border: `2px solid ${colors.border}`, marginLeft: 6, position: "relative",
          }}
        >
          🧑‍🎓
          <div style={{
            width: 10, height: 10, background: colors.success, borderRadius: "50%",
            border: "2px solid white", position: "absolute", bottom: 1, right: 1,
          }} />
        </div>
      </div>
    </nav>
  );
}
