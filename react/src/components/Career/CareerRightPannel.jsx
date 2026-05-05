import { colors } from "../../styles/theme";
import { deadlines, jobAlerts, placementStats } from "../../data/careerData";

function Widget({ title, seeAll, newAction, children }) {
  return (
    <div style={{
      background: "white", borderRadius: 16, padding: 16,
      border: `1px solid ${colors.border}`,
      boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
    }}>
      <div style={{
        fontSize: "0.78rem", fontWeight: 900, color: colors.textMuted,
        textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 14,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {title}
        {(seeAll || newAction) && (
          <a href="#" style={{ fontSize: "0.72rem", color: colors.primary, textDecoration: "none", fontWeight: 700, textTransform: "none" }}>
            {seeAll ? "See all" : newAction}
          </a>
        )}
      </div>
      {children}
    </div>
  );
}

function ProfileStrength() {
  const items = [
    { icon: "✅", label: "Profile Photo", done: true },
    { icon: "✅", label: "Skills Added", done: true },
    { icon: "✅", label: "Projects (3+)", done: true },
    { icon: "⚠️", label: "Resume Uploaded", done: false },
    { icon: "⚠️", label: "LinkedIn Link", done: false },
    { icon: "❌", label: "GitHub Link", done: false },
  ];
  const circumference = 2 * Math.PI * 30;
  const offset = circumference * (1 - 0.75);

  return (
    <Widget title="💪 Career Profile Strength">
      <div style={{ width: 80, height: 80, margin: "0 auto 12px", position: "relative" }}>
        <svg viewBox="0 0 64 64" width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="32" cy="32" r="30" fill="none" stroke={colors.border} strokeWidth="6" />
          <circle cx="32" cy="32" r="30" fill="none" stroke={colors.primary} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={offset}
          />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "1rem", fontWeight: 900 }}>75%</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem" }}>
            <span style={{ fontSize: "0.85rem", width: 20, textAlign: "center" }}>{item.icon}</span>
            <span style={{ flex: 1, color: colors.text, fontWeight: 700 }}>{item.label}</span>
            {item.done
              ? <span style={{ color: colors.success, fontSize: "0.8rem" }}>✓</span>
              : <span style={{ color: colors.textMuted, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>+ Add</span>
            }
          </div>
        ))}
      </div>
    </Widget>
  );
}

function DeadlinesWidget() {
  return (
    <Widget title="⏰ Closing Soon" seeAll>
      {deadlines.map((d, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
          borderBottom: i < deadlines.length - 1 ? `1px solid ${colors.border}` : "none",
          cursor: "pointer",
        }}>
          <div style={{
            background: d.urgent ? "#FEE2E2" : colors.primaryLight,
            color: d.urgent ? colors.accent : colors.primary,
            borderRadius: 8, padding: "4px 8px", textAlign: "center", flexShrink: 0, minWidth: 36,
          }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 900, lineHeight: 1 }}>{d.day}</div>
            <div style={{ fontSize: "0.58rem", fontWeight: 800, textTransform: "uppercase" }}>{d.month}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 800 }}>{d.company}</div>
            <div style={{ fontSize: "0.7rem", color: colors.textMuted, marginTop: 1 }}>{d.role}</div>
          </div>
          <span style={{
            fontSize: "0.65rem", fontWeight: 900, padding: "2px 7px", borderRadius: 10,
            background: d.urgent ? "#FEE2E2" : "#D1FAE5",
            color: d.urgent ? colors.accent : "#065F46",
          }}>{d.urgency}</span>
        </div>
      ))}
    </Widget>
  );
}

function AlertsWidget() {
  return (
    <Widget title="🔔 My Job Alerts" newAction="+ New">
      {jobAlerts.map((a, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
          borderBottom: i < jobAlerts.length - 1 ? `1px solid ${colors.border}` : "none",
          fontSize: "0.82rem",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.active ? colors.success : colors.border, flexShrink: 0 }} />
          <span style={{ flex: 1, fontWeight: 700, color: colors.text }}>{a.label}</span>
          <span style={{ fontSize: "0.72rem", color: colors.primary, cursor: "pointer", fontWeight: 700 }}>Edit</span>
        </div>
      ))}
    </Widget>
  );
}

function PlacementStatsWidget() {
  return (
    <Widget title="📊 Campus Placement Stats">
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
        {placementStats.map((s, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 700, marginBottom: 4 }}>
              <span>{s.label}</span>
              <span style={{ color: s.color }}>{s.value}</span>
            </div>
            <div style={{ height: 6, background: colors.border, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ width: `${s.width}%`, height: "100%", background: s.grad, borderRadius: 10 }} />
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}

export default function CareerRightPanel() {
  return (
    <aside style={{
      position: "sticky", top: 58, height: "calc(100vh - 58px)", overflowY: "auto",
      padding: "24px 14px 24px 6px", display: "flex", flexDirection: "column", gap: 14,
    }}>
      <ProfileStrength />
      <DeadlinesWidget />
      <AlertsWidget />
      <PlacementStatsWidget />
    </aside>
  );
}
