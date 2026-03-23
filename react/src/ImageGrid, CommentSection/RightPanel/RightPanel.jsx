import { useState } from "react";
import { colors } from "../../styles/theme";
import { notices, upcomingEvents, trending, suggestedFriends } from "../../data/mockData";

function Widget({ title, seeAll, children }) {
  return (
    <div style={{
      background: "white", borderRadius: 16, padding: 16,
      border: `1px solid ${colors.border}`, boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
    }}>
      <div style={{
        fontSize: "0.78rem", fontWeight: 900, color: colors.textMuted,
        textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 14,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {title}
        {seeAll && (
          <a href="#" style={{
            fontSize: "0.72rem", color: colors.primary, textDecoration: "none",
            fontWeight: 700, textTransform: "none", letterSpacing: 0,
          }}>
            See all
          </a>
        )}
      </div>
      {children}
    </div>
  );
}

function NoticesWidget() {
  return (
    <Widget title="📢 Latest Notices" seeAll>
      {notices.map((n, i) => (
        <div key={i} style={{
          display: "flex", gap: 8, padding: "8px 0", cursor: "pointer",
          borderBottom: i < notices.length - 1 ? `1px solid ${colors.border}` : "none",
          alignItems: "flex-start",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.dot, marginTop: 5, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, lineHeight: 1.3 }}>{n.title}</div>
            <div style={{ fontSize: "0.7rem", color: colors.textMuted, marginTop: 2 }}>{n.time}</div>
          </div>
        </div>
      ))}
    </Widget>
  );
}

function EventsWidget() {
  return (
    <Widget title="📅 Upcoming Events" seeAll>
      {upcomingEvents.map((e, i) => (
        <div key={i} style={{
          display: "flex", gap: 10, padding: "8px 0", cursor: "pointer",
          borderBottom: i < upcomingEvents.length - 1 ? `1px solid ${colors.border}` : "none",
          alignItems: "center",
        }}>
          <div style={{
            background: colors.primaryLight, color: colors.primary,
            borderRadius: 8, padding: "5px 8px", textAlign: "center", flexShrink: 0, minWidth: 40,
          }}>
            <div style={{ fontSize: "1rem", fontWeight: 900, lineHeight: 1 }}>{e.day}</div>
            <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" }}>{e.month}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 800 }}>{e.title}</div>
            <div style={{ fontSize: "0.71rem", color: colors.textMuted, marginTop: 1 }}>{e.sub}</div>
          </div>
        </div>
      ))}
    </Widget>
  );
}

function TrendingWidget() {
  return (
    <Widget title="🔥 Trending on Campus" seeAll>
      {trending.map((t, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer",
          borderBottom: i < trending.length - 1 ? `1px solid ${colors.border}` : "none",
        }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 900, color: colors.textMuted, width: 16 }}>{i + 1}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 800 }}>{t.tag}</div>
            <div style={{ fontSize: "0.7rem", color: colors.textMuted }}>
              {t.count} {t.hot && <span style={{ color: colors.accent }}>🔥 Hot</span>}
            </div>
          </div>
        </div>
      ))}
    </Widget>
  );
}

function PeopleWidget() {
  const [added, setAdded] = useState({});
  return (
    <Widget title="👥 People You May Know" seeAll>
      {suggestedFriends.map((f, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: f.grad,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.95rem", flexShrink: 0,
          }}>
            {f.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 800 }}>{f.name}</div>
            <div style={{ fontSize: "0.7rem", color: colors.textMuted }}>{f.mutual}</div>
          </div>
          <button
            onClick={() => setAdded(prev => ({ ...prev, [i]: true }))}
            style={{
              padding: "4px 14px", borderRadius: 20,
              border: `1.5px solid ${added[i] ? colors.success : colors.primary}`,
              background: added[i] ? colors.success : "white",
              color: added[i] ? "white" : colors.primary,
              fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 800, cursor: "pointer",
            }}
          >
            {added[i] ? "✓ Added" : "+ Add"}
          </button>
        </div>
      ))}
    </Widget>
  );
}

export default function RightPanel() {
  return (
    <aside style={{
      position: "sticky", top: 58, height: "calc(100vh - 58px)", overflowY: "auto",
      padding: "20px 14px 20px 6px", display: "flex", flexDirection: "column", gap: 14,
    }}>
      <NoticesWidget />
      <EventsWidget />
      <TrendingWidget />
      <PeopleWidget />
    </aside>
  );
}
