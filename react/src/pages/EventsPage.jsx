import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import FeaturedEvent from "../components/Events/FeatureEvent";
import EventRow from "../components/Events/EventRow";
import CalendarView from "../components/Events/CalendarView";
import EventsRightPanel from "../components/Events/EventsRightPannel";
import { eventsData, filters } from "../data/eventsData";
import { colors } from "../styles/theme";

function SectionLabel({ label }) {
  return (
    <div style={{
      fontSize: "0.72rem", fontWeight: 900, color: colors.textMuted,
      textTransform: "uppercase", letterSpacing: "0.7px",
      margin: "20px 0 10px", display: "flex", alignItems: "center", gap: 8,
    }}>
      {label}
      <div style={{ flex: 1, height: 1, background: colors.border }} />
    </div>
  );
}

export default function EventsPage() {
  const [view, setView] = useState("list");
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: colors.bg, color: colors.text, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,600;1,400&display=swap" rel="stylesheet" />

      <Navbar onNotifClick={() => {}} onAvatarClick={() => {}} />

      <div style={{ display: "grid", gridTemplateColumns: "255px 1fr 290px", paddingTop: 58, minHeight: "100vh" }}>
        <Sidebar />

        <main style={{ padding: "24px 22px" }}>

          {/* Hero Banner */}
          <div style={{
            background: "linear-gradient(135deg, #4F6EF7 0%, #7B61FF 55%, #FF6B6B 100%)",
            borderRadius: 16, padding: "28px 32px", marginBottom: 22,
            position: "relative", overflow: "hidden",
            boxShadow: "0 8px 32px rgba(79,110,247,0.14)",
          }}>
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>📅 Events & Activities</div>
                <div style={{ fontFamily: "'Lora', serif", fontSize: "1.7rem", fontWeight: 600, color: "white", marginBottom: 8 }}>What's Happening on Campus?</div>
                <div style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>Discover fests, workshops, hackathons, sports & more.<br />Never miss a moment of campus life.</div>
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                {[["12","This Month"],["3","This Week"],["142","Going"]].map(([num, label]) => (
                  <div key={label} style={{ textAlign: "center", color: "white" }}>
                    <div style={{ fontSize: "1.6rem", fontWeight: 900, lineHeight: 1 }}>{num}</div>
                    <div style={{ fontSize: "0.72rem", opacity: 0.8, marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
              <button style={{
                padding: "11px 24px", background: "white", color: colors.primary,
                border: "none", borderRadius: 20, fontFamily: "'Nunito', sans-serif",
                fontSize: "0.88rem", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap",
              }}>➕ Create Event</button>
            </div>
          </div>

          {/* View toggle + Filters */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
            {/* View toggle */}
            <div style={{ display: "flex", background: "white", borderRadius: 30, padding: 4, border: `1px solid ${colors.border}`, boxShadow: "0 2px 16px rgba(79,110,247,0.08)" }}>
              {[["list","☰ List"],["calendar","📅 Calendar"]].map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: "7px 16px", borderRadius: 22, border: "none",
                    background: view === v ? colors.primary : "transparent",
                    fontFamily: "'Nunito', sans-serif", fontSize: "0.82rem", fontWeight: 800,
                    color: view === v ? "white" : colors.textMuted, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Filter chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
              {filters.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFilter(i)}
                  style={{
                    padding: "7px 15px", borderRadius: 30,
                    border: `1.5px solid ${activeFilter === i ? colors.primary : colors.border}`,
                    background: activeFilter === i ? colors.primary : "white",
                    fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 700,
                    color: activeFilter === i ? "white" : colors.textMuted, cursor: "pointer",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar View */}
          {view === "calendar" && <CalendarView />}

          {/* List View */}
          {view === "list" && (
            <div>
              <SectionLabel label="⭐ Featured Event" />
              <FeaturedEvent />

              <SectionLabel label="📆 This Week" />
              {eventsData.thisWeek.map(ev => <EventRow key={ev.id} event={ev} />)}

              <SectionLabel label="🗓️ Coming Up" />
              {eventsData.comingUp.map(ev => <EventRow key={ev.id} event={ev} />)}

              <SectionLabel label="⏮️ Past Events" />
              {eventsData.past.map(ev => <EventRow key={ev.id} event={ev} />)}
            </div>
          )}
        </main>

        <EventsRightPanel />
      </div>
    </div>
  );
}
