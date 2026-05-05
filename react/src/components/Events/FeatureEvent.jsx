import { useState } from "react";
import { colors } from "../../styles/theme";

export default function FeaturedEvent() {
  const [going, setGoing] = useState(false);

  return (
    <div style={{
      background: "white", borderRadius: 16, border: `1px solid ${colors.border}`,
      boxShadow: "0 8px 32px rgba(79,110,247,0.14)",
      overflow: "hidden", marginBottom: 16, cursor: "pointer",
    }}>
      {/* Banner */}
      <div style={{
        height: 170, background: "linear-gradient(135deg,#4F6EF7,#7B61FF,#FF6B6B)",
        display: "flex", alignItems: "flex-end", padding: 16, position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -60%)", fontSize: "4rem", opacity: 0.6,
        }}>🚀</div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />
        <span style={{
          position: "relative", zIndex: 1,
          background: "#FFD93D", color: "#333",
          fontSize: "0.65rem", fontWeight: 900,
          padding: "3px 10px", borderRadius: 20,
          textTransform: "uppercase", letterSpacing: "0.5px",
        }}>⭐ Featured · 142 Going</span>
      </div>

      {/* Body */}
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: "#EDE9FE", color: "#5B21B6" }}>💻 Hackathon</span>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: colors.primaryLight, color: colors.primary }}>Coding Club</span>
          <span style={{ fontSize: "0.75rem", color: colors.accent, fontWeight: 800 }}>🔥 Trending</span>
        </div>

        <div style={{ fontSize: "1.05rem", fontWeight: 900, color: colors.text, marginBottom: 6, lineHeight: 1.3 }}>
          CampusHack 2025 — 24-Hour Hackathon
        </div>
        <div style={{ fontSize: "0.78rem", color: colors.textMuted, marginBottom: 10 }}>
          🏛️ Organized by Coding Club &nbsp;·&nbsp; ✅ Official College Event
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
          {[["📅", "March 15–16, 2025"], ["⏰", "10:00 AM onwards (24 hrs)"], ["📍", "Main Seminar Hall, Block A"], ["👥", "Teams of 2–4"]].map(([icon, text], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", fontWeight: 700, color: colors.textMuted }}>
              <span>{icon}</span>{text}
            </div>
          ))}
        </div>

        <div style={{ fontSize: "0.85rem", color: colors.textMuted, lineHeight: 1.55, marginBottom: 14 }}>
          Build something incredible in 24 hours! This year's theme is "Tech for Social Good." Top 3 teams win cash prizes, internship opportunities, and trophies. Mentors from Google, Microsoft, and top startups will be present throughout.
        </div>

        {/* Attendees */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          {[
            "linear-gradient(135deg,#FF6B6B,#FFD93D)",
            "linear-gradient(135deg,#6BCB77,#4F6EF7)",
            "linear-gradient(135deg,#a855f7,#ec4899)",
            "linear-gradient(135deg,#f093fb,#f5576c)",
          ].map((grad, i) => (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: "50%", border: "2px solid white",
              background: grad, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.85rem", marginLeft: i === 0 ? 0 : -8, boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}>
              {["👩","👨","🧑","👩"][i]}
            </div>
          ))}
          <div style={{
            width: 28, height: 28, borderRadius: "50%", border: "2px solid white",
            background: colors.border, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem", fontWeight: 900, color: colors.textMuted, marginLeft: -8,
          }}>+138</div>
          <span style={{ fontSize: "0.78rem", color: colors.textMuted, fontWeight: 700, marginLeft: 4 }}>going ·</span>
          <span style={{ fontSize: "0.78rem", color: colors.primary, fontWeight: 700, cursor: "pointer" }}>Priya & 4 friends are going</span>
        </div>

        {/* RSVP row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 14, borderTop: `1px solid ${colors.border}` }}>
          <button
            onClick={(e) => { e.stopPropagation(); setGoing(true); }}
            style={{
              padding: "9px 24px",
              background: going ? "linear-gradient(135deg,#6BCB77,#3da74a)" : "linear-gradient(135deg,#4F6EF7,#7B61FF)",
              color: "white", border: "none", borderRadius: 20,
              fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", fontWeight: 900, cursor: "pointer",
            }}
          >
            {going ? "✓ You're Going!" : "RSVP — Join Now"}
          </button>
          <button onClick={(e) => e.stopPropagation()} style={{
            padding: "8px 18px", background: "white", color: colors.primary,
            border: `2px solid ${colors.primary}`, borderRadius: 20,
            fontFamily: "'Nunito', sans-serif", fontSize: "0.83rem", fontWeight: 800, cursor: "pointer",
          }}>⭐ Interested</button>
          <span style={{ fontSize: "0.75rem", color: colors.accent, fontWeight: 700, marginLeft: 8 }}>⚠️ Only 58 seats left!</span>
          <button onClick={(e) => e.stopPropagation()} style={{
            width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${colors.border}`,
            background: "white", cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "0.95rem", color: colors.textMuted, marginLeft: "auto",
          }}>↗️</button>
        </div>
      </div>
    </div>
  );
}
