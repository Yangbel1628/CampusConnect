import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import NoticeCard from "../components/Notices/NoticeCard";
import NotificationCard from "../components/Notices/NotificationCard";
import NoticesRightPanel from "../components/Notices/NoticesRightPanel";
import { noticesData, notificationsData } from "../data/noticesData";
import { colors } from "../styles/theme";

const filters = [
  { label: "🗂️ All" },
  { label: "Urgent", dot: colors.accent },
  { label: "Important", dot: colors.warning },
  { label: "Info", dot: colors.primary },
  { label: "General", dot: colors.success },
  { label: "📌 Pinned" },
];

function SectionLabel({ label }) {
  return (
    <div style={{
      fontSize: "0.72rem", fontWeight: 900, color: colors.textMuted,
      textTransform: "uppercase", letterSpacing: "0.7px",
      marginBottom: 10, display: "flex", alignItems: "center", gap: 6,
    }}>
      {label}
      <div style={{ flex: 1, height: 1, background: colors.border }} />
    </div>
  );
}

function NoticesPanel() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [search, setSearch] = useState("");

  const pinnedNotices = noticesData.filter((n) => n.isPinned);
  const recentNotices = noticesData.filter((n) => !n.isPinned);

  return (
    <div>
      {/* Filter row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        {filters.map((f, i) => (
          <button
            key={i}
            onClick={() => setActiveFilter(i)}
            style={{
              padding: "7px 16px", borderRadius: 30,
              border: `1.5px solid ${activeFilter === i ? colors.primary : colors.border}`,
              background: activeFilter === i ? colors.primary : "white",
              fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 700,
              color: activeFilter === i ? "white" : colors.textMuted, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {f.dot && (
              <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: activeFilter === i ? "white" : f.dot }} />
            )}
            {f.label}
          </button>
        ))}
        {/* Search */}
        <div style={{ marginLeft: "auto", position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: colors.textMuted, fontSize: "0.85rem" }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notices…"
            style={{
              padding: "8px 16px 8px 36px", border: `1.5px solid ${colors.border}`,
              borderRadius: 30, fontFamily: "'Nunito', sans-serif", fontSize: "0.82rem",
              outline: "none", background: "white", width: 200,
            }}
          />
        </div>
      </div>

      {/* Pinned */}
      <SectionLabel label="📌 Pinned" />
      {pinnedNotices.map((n) => <NoticeCard key={n.id} notice={n} />)}

      {/* Recent */}
      <SectionLabel label="🕐 Recent" />
      {recentNotices.map((n) => <NoticeCard key={n.id} notice={n} />)}
    </div>
  );
}

function NotificationsPanel() {
  const [allRead, setAllRead] = useState(false);

  const markAllRead = () => setAllRead(true);

  return (
    <div>
      {/* Settings bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, background: "white",
        border: `1px solid ${colors.border}`, borderRadius: 16,
        padding: "12px 16px", marginBottom: 18,
        boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
      }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: colors.textMuted }}>
          🔔 You have <strong style={{ color: colors.primary }}>4 unread</strong> notifications
        </span>
        <button
          onClick={markAllRead}
          style={{
            marginLeft: "auto", padding: "6px 16px", background: colors.primaryLight,
            color: colors.primary, border: "none", borderRadius: 20,
            fontFamily: "'Nunito', sans-serif", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer",
          }}
        >
          ✓ Mark all as read
        </button>
        <button style={{
          padding: "6px 16px", background: "white", color: colors.textMuted,
          border: `1.5px solid ${colors.border}`, borderRadius: 20,
          fontFamily: "'Nunito', sans-serif", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
        }}>
          ⚙️ Settings
        </button>
      </div>

      <SectionLabel label="Today" />
      {notificationsData.today.map((n) => <NotificationCard key={n.id} notif={allRead ? { ...n, unread: false } : n} />)}

      <div style={{ marginTop: 20 }} />
      <SectionLabel label="Yesterday" />
      {notificationsData.yesterday.map((n) => <NotificationCard key={n.id} notif={n} />)}

      <div style={{ marginTop: 20 }} />
      <SectionLabel label="Earlier this week" />
      {notificationsData.earlier.map((n) => <NotificationCard key={n.id} notif={n} />)}
    </div>
  );
}

export default function NoticesPage() {
  const [activeTab, setActiveTab] = useState("notices");

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: colors.bg, color: colors.text, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,600;1,400&display=swap" rel="stylesheet" />

      <Navbar onNotifClick={() => {}} onAvatarClick={() => {}} />

      <div style={{ display: "grid", gridTemplateColumns: "255px 1fr 290px", paddingTop: 58, minHeight: "100vh" }}>
        <Sidebar />

        <main style={{ padding: "24px 22px" }}>
          {/* Page header */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: colors.text, display: "flex", alignItems: "center", gap: 10 }}>
              📢 Notices & Notifications
            </div>
            <div style={{ fontSize: "0.88rem", color: colors.textMuted, marginTop: 4 }}>
              Official announcements, alerts, and all your campus activity in one place
            </div>
          </div>

          {/* Tab bar */}
          <div style={{
            display: "flex", background: "white", borderRadius: 16, padding: 5,
            gap: 4, border: `1px solid ${colors.border}`,
            boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
            marginBottom: 20, width: "fit-content",
          }}>
            {[
              { key: "notices", label: "📋 Notice Board", bubble: "3" },
              { key: "notifications", label: "🔔 Notifications", bubble: "4" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "9px 20px", borderRadius: 12, border: "none",
                  background: activeTab === tab.key ? colors.primary : "transparent",
                  fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", fontWeight: 800,
                  color: activeTab === tab.key ? "white" : colors.textMuted,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
                  boxShadow: activeTab === tab.key ? "0 3px 10px rgba(79,110,247,0.3)" : "none",
                }}
              >
                {tab.label}
                <span style={{
                  background: activeTab === tab.key ? "rgba(255,255,255,0.3)" : colors.accent,
                  color: "white", fontSize: "0.62rem", fontWeight: 900,
                  padding: "1px 6px", borderRadius: 10,
                }}>
                  {tab.bubble}
                </span>
              </button>
            ))}
          </div>

          {activeTab === "notices" ? <NoticesPanel /> : <NotificationsPanel />}
        </main>

        <NoticesRightPanel activeTab={activeTab} />
      </div>
    </div>
  );
}
