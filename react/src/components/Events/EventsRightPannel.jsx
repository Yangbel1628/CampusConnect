import { useState } from "react";
import { colors } from "../../styles/theme";
import { myEvents, activeClubs } from "../../data/eventsData";

const MINI_CAL = {
  dayNames: ["S","M","T","W","T","F","S"],
  rows: [
    [null,null,null,null,null,null,1],
    [2,3,4,5,6,7,8],
    [9,10,11,12,13,14,15],
    [16,17,18,19,20,21,22],
    [23,24,25,26,27,28,29],
    [30,31,null,null,null,null,null],
  ],
  hasEvent: [5,12,14,15,16,18,19,21,22,25,28,29],
  today: 11,
};

function Widget({ title, seeAll, children }) {
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
        {seeAll && <a href="#" style={{ fontSize: "0.72rem", color: colors.primary, textDecoration: "none", fontWeight: 700, textTransform: "none" }}>See all</a>}
      </div>
      {children}
    </div>
  );
}

function MiniCalWidget() {
  return (
    <Widget title="📅 March 2025">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {MINI_CAL.dayNames.map((d, i) => (
          <div key={i} style={{ fontSize: "0.65rem", fontWeight: 900, color: colors.textMuted, textAlign: "center", padding: "4px 2px", textTransform: "uppercase" }}>{d}</div>
        ))}
        {MINI_CAL.rows.flat().map((day, i) => {
          if (!day) return <div key={i} style={{ fontSize: "0.7rem", color: "#ccc", textAlign: "center", padding: "4px 2px" }} />;
          const isToday = day === MINI_CAL.today;
          const hasEv = MINI_CAL.hasEvent.includes(day);
          return (
            <div key={i} style={{
              fontSize: "0.7rem", fontWeight: hasEv ? 900 : 800, textAlign: "center",
              padding: "4px 2px", borderRadius: isToday ? "50%" : 6, cursor: "pointer",
              background: isToday ? colors.primary : "transparent",
              color: isToday ? "white" : hasEv ? colors.text : colors.textMuted,
              position: "relative",
            }}>
              {day}
              {hasEv && !isToday && (
                <div style={{ position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: colors.primary }} />
              )}
            </div>
          );
        })}
      </div>
    </Widget>
  );
}

function MyEventsWidget() {
  return (
    <Widget title="✅ My Events" seeAll>
      {myEvents.map((ev, i) => (
        <div key={i} style={{
          display: "flex", gap: 10, padding: "8px 0", alignItems: "flex-start",
          borderBottom: i < myEvents.length - 1 ? `1px solid ${colors.border}` : "none",
          cursor: "pointer",
        }}>
          <div style={{ background: colors.primaryLight, color: colors.primary, borderRadius: 8, padding: "4px 8px", textAlign: "center", flexShrink: 0, minWidth: 38 }}>
            <div style={{ fontSize: "0.95rem", fontWeight: 900, lineHeight: 1 }}>{ev.day}</div>
            <div style={{ fontSize: "0.58rem", fontWeight: 800, textTransform: "uppercase" }}>{ev.month}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 800, lineHeight: 1.3 }}>{ev.title}</div>
            <div style={{ fontSize: "0.7rem", color: colors.textMuted, marginTop: 2 }}>{ev.sub}</div>
            <span style={{
              fontSize: "0.65rem", fontWeight: 900, padding: "2px 7px", borderRadius: 10,
              display: "inline-block", marginTop: 3,
              background: ev.status === "going" ? "#D1FAE5" : "#FEF3C7",
              color: ev.status === "going" ? "#065F46" : "#92400E",
            }}>
              {ev.status === "going" ? "✓ Going" : "⭐ Interested"}
            </span>
          </div>
        </div>
      ))}
    </Widget>
  );
}

function ActiveClubsWidget() {
  const [followed, setFollowed] = useState(
    activeClubs.reduce((acc, c, i) => ({ ...acc, [i]: c.following }), {})
  );

  return (
    <Widget title="🏛️ Active Clubs">
      {activeClubs.map((club, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
          borderBottom: i < activeClubs.length - 1 ? `1px solid ${colors.border}` : "none",
          cursor: "pointer",
        }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: club.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{club.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 800 }}>{club.name}</div>
            <div style={{ fontSize: "0.7rem", color: colors.textMuted }}>{club.events}</div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setFollowed(prev => ({ ...prev, [i]: !prev[i] })); }}
            style={{
              padding: "4px 12px", borderRadius: 20,
              border: `1.5px solid ${followed[i] ? colors.primary : colors.border}`,
              background: followed[i] ? colors.primary : "white",
              color: followed[i] ? "white" : colors.textMuted,
              fontFamily: "'Nunito', sans-serif", fontSize: "0.72rem", fontWeight: 800, cursor: "pointer",
            }}
          >
            {followed[i] ? "Following" : "+ Follow"}
          </button>
        </div>
      ))}
    </Widget>
  );
}

export default function EventsRightPanel() {
  return (
    <aside style={{
      position: "sticky", top: 58, height: "calc(100vh - 58px)", overflowY: "auto",
      padding: "24px 14px 24px 6px", display: "flex", flexDirection: "column", gap: 14,
    }}>
      <MiniCalWidget />
      <MyEventsWidget />
      <ActiveClubsWidget />
    </aside>
  );
}
