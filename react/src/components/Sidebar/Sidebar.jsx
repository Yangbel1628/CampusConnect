import { colors } from "../../styles/theme";

function NavItem({ icon, label, count, countColor, active }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
      borderRadius: 10, cursor: "pointer", fontSize: "0.9rem", fontWeight: 700,
      color: active ? colors.primary : colors.textMuted,
      background: active ? colors.primaryLight : "transparent",
      transition: "all 0.15s",
    }}>
      <span style={{ fontSize: "1.1rem", width: 22, textAlign: "center" }}>{icon}</span>
      {label}
      {count && (
        <span style={{
          marginLeft: "auto", background: countColor || colors.accent,
          color: "white", fontSize: "0.65rem", fontWeight: 900,
          padding: "2px 7px", borderRadius: 10,
        }}>
          {count}
        </span>
      )}
    </div>
  );
}

function SectionLabel({ label }) {
  return (
    <div style={{
      fontSize: "0.68rem", fontWeight: 800, color: colors.textMuted,
      textTransform: "uppercase", letterSpacing: "0.8px", padding: "8px 10px 4px",
    }}>
      {label}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: colors.border, margin: "8px 0" }} />;
}

export default function Sidebar() {
  return (
    <aside style={{
      position: "sticky", top: 58, height: "calc(100vh - 58px)", overflowY: "auto",
      padding: "20px 14px", background: "white",
      borderRight: `1px solid ${colors.border}`,
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      {/* Mini Profile */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "12px 10px",
        borderRadius: 10, background: colors.primaryLight, marginBottom: 10, cursor: "pointer",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "linear-gradient(135deg, #4F6EF7, #7B61FF)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.1rem", flexShrink: 0, position: "relative",
        }}>
          🧑‍🎓
          <div style={{
            width: 10, height: 10, background: colors.success, borderRadius: "50%",
            border: "2px solid white", position: "absolute", bottom: 1, right: 1,
          }} />
        </div>
        <div>
          <div style={{ fontSize: "0.88rem", fontWeight: 800, color: colors.text }}>Rahul Sharma</div>
          <div style={{ fontSize: "0.72rem", color: colors.textMuted }}>CSE • 3rd Year</div>
        </div>
      </div>

      <SectionLabel label="Main" />
      <NavItem icon="🏠" label="Home Feed" active />
      <NavItem icon="👤" label="My Profile" />
      <NavItem icon="💬" label="Messages" count="2" />
      <NavItem icon="🔔" label="Notifications" count="4" />

      <Divider />
      <SectionLabel label="Campus" />
      <NavItem icon="📢" label="Notices" count="1" countColor={colors.success} />
      <NavItem icon="📅" label="Events" />
      <NavItem icon="📚" label="Academic Hub" />
      <NavItem icon="💼" label="Opportunities" count="3" countColor={colors.primary} />

      <Divider />
      <SectionLabel label="My Clubs" />
      <NavItem icon="💻" label="Coding Club" />
      <NavItem icon="📷" label="Photography Club" />
      <NavItem icon="🚀" label="Startup Cell" />
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
        borderRadius: 10, cursor: "pointer", fontSize: "0.9rem", fontWeight: 700,
        color: colors.primary,
      }}>
        <span style={{ fontSize: "1.1rem", width: 22, textAlign: "center" }}>➕</span>
        Discover Clubs
      </div>

      <Divider />
      <SectionLabel label="My Study Groups" />
      <NavItem icon="🖥️" label="OS Exam Prep" />
      <NavItem icon="🔢" label="DBMS Group" />
    </aside>
  );
}
