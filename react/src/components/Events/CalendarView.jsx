import { colors } from "../../styles/theme";
import { calendarEvents } from "../../data/eventsData";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY = 11;

const pillColors = {
  blue:   { background: "#DBEAFE", color: "#1E40AF" },
  green:  { background: "#D1FAE5", color: "#065F46" },
  orange: { background: "#FEF3C7", color: "#92400E" },
  purple: { background: "#EDE9FE", color: "#5B21B6" },
  red:    { background: "#FEE2E2", color: "#9B1C1C" },
  teal:   { background: "#CCFBF1", color: "#0F766E" },
};

// March 2025 layout
const calCells = [
  { day: 23, otherMonth: true }, { day: 24, otherMonth: true }, { day: 25, otherMonth: true },
  { day: 26, otherMonth: true }, { day: 27, otherMonth: true }, { day: 28, otherMonth: true }, { day: 1 },
  { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 }, { day: 7 }, { day: 8 },
  { day: 9 }, { day: 10 }, { day: 11, isToday: true }, { day: 12 }, { day: 13 }, { day: 14 }, { day: 15 },
  { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 }, { day: 21 }, { day: 22 },
  { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 }, { day: 29 },
  { day: 30 }, { day: 31 },
  { day: 1, otherMonth: true }, { day: 2, otherMonth: true }, { day: 3, otherMonth: true },
  { day: 4, otherMonth: true }, { day: 5, otherMonth: true, events: [{ label: "Sports Day 🏆", pill: "green" }] },
];

export default function CalendarView() {
  return (
    <div>
      {/* Calendar header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button style={{
          width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${colors.border}`,
          background: "white", cursor: "pointer", fontSize: "0.9rem",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>◀</button>
        <div style={{ fontSize: "1.1rem", fontWeight: 900 }}>March 2025</div>
        <button style={{
          width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${colors.border}`,
          background: "white", cursor: "pointer", fontSize: "0.9rem",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>▶</button>
      </div>

      {/* Grid */}
      <div style={{ background: "white", borderRadius: 16, border: `1px solid ${colors.border}`, boxShadow: "0 2px 16px rgba(79,110,247,0.08)", overflow: "hidden" }}>
        {/* Day names */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: `1px solid ${colors.border}` }}>
          {DAYS.map((d) => (
            <div key={d} style={{ padding: 10, textAlign: "center", fontSize: "0.75rem", fontWeight: 900, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>{d}</div>
          ))}
        </div>

        {/* Cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {calCells.map((cell, i) => {
            const evts = !cell.otherMonth ? (calendarEvents[cell.day] || []) : (cell.events || []);
            return (
              <div key={i} style={{
                minHeight: 88,
                borderRight: (i + 1) % 7 !== 0 ? `1px solid ${colors.border}` : "none",
                borderBottom: `1px solid ${colors.border}`,
                padding: 6, cursor: "pointer",
                background: cell.isToday ? colors.primaryLight : cell.otherMonth ? "#fafbff" : "white",
              }}>
                <div
                style={{
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 4,
                    background: cell.isToday ? colors.primary : "transparent",
                    borderRadius: cell.isToday ? "50%" : 0,
                    color: cell.isToday
                    ? "white"
                    : cell.otherMonth
                    ? colors.textMuted
                    : colors.text,
                }}
                >
                {cell.day}
                </div>
                {evts.map((ev, j) => (
                  <div key={j} style={{
                    fontSize: "0.65rem", fontWeight: 800, padding: "2px 6px", borderRadius: 4,
                    marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    cursor: "pointer", ...pillColors[ev.pill],
                  }}>
                    {ev.label}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
