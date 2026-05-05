import { useState } from "react";
import { colors } from "../../styles/theme";

function Widget({ title, children }) {
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
      </div>
      {children}
    </div>
  );
}

function CategoriesWidget() {
  const cats = [
    { icon: "🚨", iconBg: "#FEE2E2", name: "Urgent", sub: "Requires immediate action", count: "2", countBg: "#FEE2E2", countColor: colors.accent },
    { icon: "⚠️", iconBg: "#FEF3C7", name: "Important", sub: "Deadlines approaching", count: "3", countBg: "#FEF3C7", countColor: colors.warning },
    { icon: "ℹ️", iconBg: "#DBEAFE", name: "Info", sub: "General information", count: "7", countBg: "#DBEAFE", countColor: colors.primary },
    { icon: "📣", iconBg: "#D1FAE5", name: "Announcements", sub: "Events & activities", count: "5", countBg: "#D1FAE5", countColor: "#065F46" },
  ];
  return (
    <Widget title="📋 Notice Categories">
      {cats.map((c, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "9px 0",
          borderBottom: i < cats.length - 1 ? `1px solid ${colors.border}` : "none",
          cursor: "pointer",
        }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>{c.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.83rem", fontWeight: 800 }}>{c.name}</div>
            <div style={{ fontSize: "0.7rem", color: colors.textMuted, marginTop: 1 }}>{c.sub}</div>
          </div>
          <span style={{ fontSize: "0.7rem", fontWeight: 900, padding: "2px 8px", borderRadius: 10, background: c.countBg, color: c.countColor }}>{c.count}</span>
        </div>
      ))}
    </Widget>
  );
}

function DepartmentsWidget() {
  const depts = [
    { dot: "#8B5CF6", name: "All Departments", count: "17 notices" },
    { dot: colors.primary, name: "CSE", count: "6 notices" },
    { dot: colors.success, name: "ECE", count: "4 notices" },
    { dot: colors.warning, name: "Mechanical", count: "3 notices" },
    { dot: colors.accent, name: "Administration", count: "4 notices" },
  ];
  return (
    <Widget title="🏫 Filter by Department">
      {depts.map((d, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
          borderBottom: i < depts.length - 1 ? `1px solid ${colors.border}` : "none",
          cursor: "pointer",
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.dot, flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: "0.82rem", fontWeight: 700 }}>{d.name}</div>
          <div style={{ fontSize: "0.72rem", color: colors.textMuted, fontWeight: 600 }}>{d.count}</div>
        </div>
      ))}
    </Widget>
  );
}

function NotifPrefsWidget() {
  const prefs = [
    { label: "📢 Official Notices", sub: "Admin & faculty posts", defaultOn: true },
    { label: "🎉 Events", sub: "Reminders & RSVPs", defaultOn: true },
    { label: "📚 Academic", sub: "Study group & Q&A updates", defaultOn: true },
    { label: "❤️ Social", sub: "Likes, comments, follows", defaultOn: true },
    { label: "💼 Career Alerts", sub: "New jobs & internships", defaultOn: true },
    { label: "🌙 Quiet Hours", sub: "11 PM – 7 AM", defaultOn: false },
  ];
  const [toggles, setToggles] = useState(prefs.map((p) => p.defaultOn));

  return (
    <Widget title="⚙️ Notification Preferences">
      {prefs.map((p, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "9px 0", borderBottom: i < prefs.length - 1 ? `1px solid ${colors.border}` : "none",
        }}>
          <div>
            <div style={{ fontSize: "0.83rem", fontWeight: 700, color: colors.text }}>{p.label}</div>
            <div style={{ fontSize: "0.7rem", color: colors.textMuted, marginTop: 1 }}>{p.sub}</div>
          </div>
          <div
            onClick={() => setToggles((prev) => prev.map((v, j) => (j === i ? !v : v)))}
            style={{
              width: 38, height: 22, borderRadius: 22, cursor: "pointer",
              background: toggles[i] ? colors.primary : colors.border,
              position: "relative", transition: "background 0.2s", flexShrink: 0,
            }}
          >
            <div style={{
              position: "absolute", width: 16, height: 16, background: "white",
              borderRadius: "50%", top: 3,
              left: toggles[i] ? 19 : 3,
              transition: "left 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            }} />
          </div>
        </div>
      ))}
    </Widget>
  );
}

function SavedNoticesWidget() {
  const saved = [
    { icon: "📄", title: "Exam Schedule Sem 6", time: "Saved 2 hrs ago" },
    { icon: "📋", title: "CSE Project Submission Guidelines", time: "Saved 3 days ago" },
  ];
  return (
    <Widget title="🔖 Saved Notices">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {saved.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
            padding: "6px 0", borderBottom: i < saved.length - 1 ? `1px solid ${colors.border}` : "none",
          }}>
            <span style={{ fontSize: "0.9rem" }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, lineHeight: 1.3 }}>{s.title}</div>
              <div style={{ fontSize: "0.7rem", color: colors.textMuted }}>{s.time}</div>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}

export default function NoticesRightPanel({ activeTab }) {
  return (
    <aside style={{
      position: "sticky", top: 58, height: "calc(100vh - 58px)", overflowY: "auto",
      padding: "24px 14px 24px 6px", display: "flex", flexDirection: "column", gap: 14,
    }}>
      <CategoriesWidget />
      <DepartmentsWidget />
      {activeTab === "notifications" && <NotifPrefsWidget />}
      <SavedNoticesWidget />
    </aside>
  );
}
