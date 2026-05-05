import { colors } from "../../styles/theme";
import { profileData } from "../../data/profileData";

function Card({ children, style }) {
  return (
    <div style={{
      background: "white", borderRadius: 16, padding: 18,
      border: `1px solid ${colors.border}`,
      boxShadow: "0 2px 16px rgba(79,110,247,0.08)", ...style,
    }}>
      {children}
    </div>
  );
}

function CardTitle({ children }) {
  return (
    <div style={{
      fontSize: "0.82rem", fontWeight: 900, color: colors.textMuted,
      textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 14,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {children}
    </div>
  );
}

function AboutCard() {
  return (
    <Card>
      <CardTitle>
        About
        <a href="#" style={{ fontSize: "0.75rem", color: colors.primary, textDecoration: "none", fontWeight: 700, textTransform: "none" }}>Edit</a>
      </CardTitle>
      {profileData.about.map((row, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          padding: "8px 0",
          borderBottom: i < profileData.about.length - 1 ? `1px solid ${colors.border}` : "none",
        }}>
          <span style={{ fontSize: "1rem", width: 22, textAlign: "center", flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
          <div>
            <div style={{ fontSize: "0.72rem", color: colors.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px" }}>{row.label}</div>
            <div style={{ fontSize: "0.87rem", fontWeight: 700, color: colors.text, marginTop: 1 }}>{row.value}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}

function SkillsCard() {
  const skillStyle = {
    top: { borderColor: colors.primary, color: colors.primary, background: colors.primaryLight },
    mid: { borderColor: colors.success, color: "#1a6630", background: "#f0fff4" },
    "":  { borderColor: colors.border, color: colors.textMuted, background: colors.bg },
  };
  return (
    <Card>
      <CardTitle>
        Skills
        <a href="#" style={{ fontSize: "0.75rem", color: colors.primary, textDecoration: "none", fontWeight: 700, textTransform: "none" }}>+ Add</a>
      </CardTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {profileData.skills.map((s, i) => (
          <span key={i} style={{
            padding: "5px 13px", borderRadius: 20, border: "1.5px solid",
            fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
            ...skillStyle[s.type],
          }}>
            {s.label}
          </span>
        ))}
      </div>
    </Card>
  );
}

function ClubsCard() {
  return (
    <Card>
      <CardTitle>Clubs & Societies</CardTitle>
      {profileData.clubs.map((c, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "9px 0",
          borderBottom: i < profileData.clubs.length - 1 ? `1px solid ${colors.border}` : "none",
          cursor: "pointer",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: c.iconBg,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0,
          }}>{c.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 800 }}>{c.name}</div>
            <div style={{ fontSize: "0.72rem", color: colors.textMuted, marginTop: 1 }}>
              {c.role}{" "}
              <span style={{ fontSize: "0.65rem", fontWeight: 800, padding: "2px 7px", borderRadius: 10, background: c.badgeBg, color: c.badgeColor }}>
                {c.badge}
              </span>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}

function SocialCard() {
  return (
    <Card>
      <CardTitle>
        Connect
        <a href="#" style={{ fontSize: "0.75rem", color: colors.primary, textDecoration: "none", fontWeight: 700, textTransform: "none" }}>+ Add</a>
      </CardTitle>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {profileData.socialLinks.map((link, i) => (
          <a key={i} href="#" style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 12px", borderRadius: 20,
            border: `1.5px solid ${colors.border}`, background: "white",
            fontSize: "0.78rem", fontWeight: 700, color: colors.textMuted,
            cursor: "pointer", textDecoration: "none",
          }}>
            {link}
          </a>
        ))}
      </div>
    </Card>
  );
}

export default function ProfileLeftCol() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <AboutCard />
      <SkillsCard />
      <ClubsCard />
      <SocialCard />
    </div>
  );
}
