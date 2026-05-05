import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useSocket } from "../../context/SocketContext";
import { colors } from "../../styles/theme";

function NavItem({ icon, label, count, countColor, path, onClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const active   = path && location.pathname === path;
  return (
    <div onClick={() => { if (path) navigate(path); if (onClick) onClick(); }}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontSize: "0.9rem", fontWeight: 700, color: active ? colors.primary : colors.textMuted, background: active ? colors.primaryLight : "transparent", transition: "all 0.15s" }}>
      <span style={{ fontSize: "1.1rem", width: 22, textAlign: "center" }}>{icon}</span>
      {label}
      {count > 0 && <span style={{ marginLeft: "auto", background: countColor || colors.accent, color: "white", fontSize: "0.65rem", fontWeight: 900, padding: "2px 7px", borderRadius: 10 }}>{count}</span>}
    </div>
  );
}

function SectionLabel({ label }) {
  return <div style={{ fontSize: "0.68rem", fontWeight: 800, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.8px", padding: "8px 10px 4px" }}>{label}</div>;
}

function Divider() {
  return <div style={{ height: 1, background: colors.border, margin: "8px 0" }} />;
}

export default function Sidebar() {
  const { user, logout }         = useAuth();
  const { unreadNotifCount }     = useSocket();
  const navigate                 = useNavigate();

  return (
    <aside style={{ position: "sticky", top: 58, height: "calc(100vh - 58px)", overflowY: "auto", padding: "20px 14px", background: "white", borderRight: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Profile chip */}
      <div onClick={() => navigate("/profile")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 10px", borderRadius: 10, background: colors.primaryLight, marginBottom: 10, cursor: "pointer" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: user?.avatar ? `url(${user.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0, position: "relative" }}>
          {!user?.avatar && "🧑‍🎓"}
          <div style={{ width: 10, height: 10, background: colors.success, borderRadius: "50%", border: "2px solid white", position: "absolute", bottom: 1, right: 1 }} />
        </div>
        <div>
          <div style={{ fontSize: "0.88rem", fontWeight: 800, color: colors.text }}>{user?.name || "Student"}</div>
          <div style={{ fontSize: "0.72rem", color: colors.textMuted }}>{user?.department || ""}{user?.year ? ` • ${user.year} Year` : ""}</div>
        </div>
      </div>

      <SectionLabel label="Main" />
      <NavItem icon="🏠" label="Home Feed"     path="/" />
      <NavItem icon="👤" label="My Profile"    path="/profile" />
      <NavItem icon="🔔" label="Notifications" count={unreadNotifCount} path="/notices" />
      <NavItem icon="💬" label="Messages"      path="/messages" />

      <Divider />
      <SectionLabel label="Campus" />
      <NavItem icon="📢" label="Notices"       path="/notices" />
      <NavItem icon="📅" label="Events"        path="/events" />
      <NavItem icon="📚" label="Academic Hub"  path="/academic" />
      <NavItem icon="💼" label="Opportunities" path="/career" />

      <Divider />
      <SectionLabel label="My Clubs" />
      <NavItem icon="💻" label="Coding Club" />
      <NavItem icon="📷" label="Photography Club" />
      <NavItem icon="🚀" label="Startup Cell" />
      <div onClick={() => {}} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontSize: "0.9rem", fontWeight: 700, color: colors.primary }}>
        <span style={{ fontSize: "1.1rem", width: 22, textAlign: "center" }}>➕</span> Discover Clubs
      </div>

      <Divider />
      <SectionLabel label="Study Groups" />
      <NavItem icon="🖥️" label="OS Exam Prep" />
      <NavItem icon="🔢" label="DBMS Group" />

      <div style={{ marginTop: "auto", paddingTop: 12 }}>
        <Divider />
        <div onClick={logout} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontSize: "0.9rem", fontWeight: 700, color: colors.accent }}>
          <span style={{ fontSize: "1.1rem", width: 22, textAlign: "center" }}>🚪</span> Logout
        </div>
      </div>
    </aside>
  );
}