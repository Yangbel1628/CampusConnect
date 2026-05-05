import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import JobCard from "../components/Career/JobCard";
import ApplicationTracker from "../components/Career/ApplicationTracker";
import AlumniCard from "../components/Career/AlumniCard";
import CareerRightPanel from "../components/Career/CareerRightPannel"
import { jobsData, applicationsData, alumniData } from "../data/careerData";
import { colors } from "../styles/theme";

function SectionLabel({ label }) {
  return (
    <div style={{
      fontSize: "0.72rem", fontWeight: 900, color: colors.textMuted,
      textTransform: "uppercase", letterSpacing: "0.7px",
      margin: "4px 0 12px", display: "flex", alignItems: "center", gap: 8,
    }}>
      {label}
      <div style={{ flex: 1, height: 1, background: colors.border }} />
    </div>
  );
}

function FilterSection() {
  const [activeChip, setActiveChip] = useState(0);
  const chips = ["🌟 For Me", "🔥 Trending", "⏰ Closing Soon"];

  return (
    <div style={{
      background: "white", borderRadius: 16, border: `1px solid ${colors.border}`,
      boxShadow: "0 2px 16px rgba(79,110,247,0.08)", padding: "14px 16px", marginBottom: 18,
    }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", minWidth: 180, flex: 1 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: colors.textMuted, fontSize: "0.85rem" }}>🔍</span>
          <input placeholder="Search roles, companies…" style={{
            width: "100%", padding: "8px 14px 8px 36px", border: `1.5px solid ${colors.border}`,
            borderRadius: 30, fontFamily: "'Nunito',sans-serif", fontSize: "0.82rem",
            outline: "none", background: colors.bg,
          }} />
        </div>
        {/* Dropdowns */}
        {["🗂️ All Types", "💻 All Domains", "📅 All Years", "📍 All Locations"].map((label, i) => (
          <select key={i} style={{
            padding: "8px 14px", border: `1.5px solid ${colors.border}`, borderRadius: 30,
            fontFamily: "'Nunito',sans-serif", fontSize: "0.8rem", fontWeight: 700,
            color: colors.textMuted, background: colors.bg, outline: "none", cursor: "pointer",
          }}>
            <option>{label}</option>
          </select>
        ))}
        {/* Filter chips */}
        {chips.map((chip, i) => (
          <button key={i} onClick={() => setActiveChip(i)} style={{
            padding: "7px 15px", borderRadius: 30,
            border: `1.5px solid ${activeChip === i ? colors.primary : colors.border}`,
            background: activeChip === i ? colors.primary : "white",
            fontFamily: "'Nunito',sans-serif", fontSize: "0.8rem", fontWeight: 700,
            color: activeChip === i ? "white" : colors.textMuted, cursor: "pointer",
          }}>{chip}</button>
        ))}
      </div>
    </div>
  );
}

function JobsPanel() {
  const matched = jobsData.slice(0, 3);
  const all = jobsData.slice(3);
  return (
    <div>
      <FilterSection />
      <SectionLabel label="🌟 Matched to Your Profile" />
      {matched.map(job => <JobCard key={job.id} job={job} />)}
      <SectionLabel label="📋 All Opportunities" />
      {all.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  );
}

function ApplicationsPanel() {
  const stats = [
    { num: "4", label: "Total Applied", color: colors.primary },
    { num: "1", label: "Under Review", color: colors.warning },
    { num: "1", label: "Shortlisted", color: colors.success },
    { num: "1", label: "Rejected", color: colors.accent },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 4 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: "white", borderRadius: 10, border: `1px solid ${colors.border}`,
            padding: 14, textAlign: "center",
            boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
          }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: s.color }}>{s.num}</div>
            <div style={{ fontSize: "0.72rem", color: colors.textMuted, fontWeight: 700, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {applicationsData.map(app => <ApplicationTracker key={app.id} app={app} />)}
    </div>
  );
}

function AlumniPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Alumni filter */}
      <div style={{
        background: "white", borderRadius: 16, border: `1px solid ${colors.border}`,
        boxShadow: "0 2px 16px rgba(79,110,247,0.08)", padding: "14px 16px",
      }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: colors.textMuted }}>🔍</span>
            <input placeholder="Search alumni by name, company…" style={{
              width: "100%", padding: "8px 14px 8px 36px", border: `1.5px solid ${colors.border}`,
              borderRadius: 30, fontFamily: "'Nunito',sans-serif", fontSize: "0.82rem", outline: "none", background: colors.bg,
            }} />
          </div>
          {["🏢 All Companies", "💻 All Domains", "🎓 All Batches"].map((label, i) => (
            <select key={i} style={{
              padding: "8px 14px", border: `1.5px solid ${colors.border}`, borderRadius: 30,
              fontFamily: "'Nunito',sans-serif", fontSize: "0.8rem", fontWeight: 700,
              color: colors.textMuted, background: colors.bg, outline: "none", cursor: "pointer",
            }}>
              <option>{label}</option>
            </select>
          ))}
        </div>
      </div>
      <SectionLabel label="🎓 Alumni from Your Department" />
      {alumniData.map(a => <AlumniCard key={a.id} alumni={a} />)}
    </div>
  );
}

const TABS = [
  { key: "jobs", label: "💼 All Opportunities", bubble: "48" },
  { key: "apps", label: "📋 My Applications", bubble: "4" },
  { key: "alumni", label: "🎓 Alumni Network" },
];

export default function CareerPage() {
  const [activeTab, setActiveTab] = useState("jobs");

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: colors.bg, color: colors.text, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,600;1,400&display=swap" rel="stylesheet" />

      <Navbar onNotifClick={() => {}} onAvatarClick={() => {}} />

      <div style={{ display: "grid", gridTemplateColumns: "255px 1fr 290px", paddingTop: 58, minHeight: "100vh" }}>
        <Sidebar />

        <main style={{ padding: "24px 22px" }}>

          {/* Hero */}
          <div style={{
            background: "linear-gradient(135deg,#1a1d2e 0%,#2d3561 60%,#4F6EF7 100%)",
            borderRadius: 16, padding: "28px 32px", marginBottom: 22,
            position: "relative", overflow: "hidden",
            boxShadow: "0 8px 32px rgba(79,110,247,0.14)",
          }}>
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>💼 Career & Internship Board</div>
                <div style={{ fontFamily: "'Lora',serif", fontSize: "1.65rem", fontWeight: 600, color: "white", marginBottom: 8, lineHeight: 1.3 }}>Launch Your Career from Campus</div>
                <div style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.55, maxWidth: 420 }}>Verified opportunities from top companies, handpicked by your Placement Cell. 3 new listings match your profile today.</div>
              </div>
              <div style={{ display: "flex", gap: 22 }}>
                {[["48","Open Roles"],["12","This Week"],["3","Match You"]].map(([n,l]) => (
                  <div key={l} style={{ textAlign: "center", color: "white" }}>
                    <div style={{ fontSize: "1.55rem", fontWeight: 900, lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: "0.7rem", opacity: 0.75, marginTop: 3 }}>{l}</div>
                  </div>
                ))}
              </div>
              <button style={{
                padding: "11px 24px", background: "#FFD93D", color: "#1a1d2e",
                border: "none", borderRadius: 20, fontFamily: "'Nunito',sans-serif",
                fontSize: "0.88rem", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap",
              }}>🔔 Set Job Alerts</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex", background: "white", borderRadius: 16, padding: 5,
            gap: 4, border: `1px solid ${colors.border}`,
            boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
            marginBottom: 18, width: "fit-content",
          }}>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                padding: "9px 20px", borderRadius: 12, border: "none",
                background: activeTab === tab.key ? colors.primary : "transparent",
                fontFamily: "'Nunito',sans-serif", fontSize: "0.85rem", fontWeight: 800,
                color: activeTab === tab.key ? "white" : colors.textMuted, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 7,
                boxShadow: activeTab === tab.key ? "0 3px 10px rgba(79,110,247,0.3)" : "none",
              }}>
                {tab.label}
                {tab.bubble && (
                  <span style={{
                    background: activeTab === tab.key ? "rgba(255,255,255,0.3)" : colors.accent,
                    color: "white", fontSize: "0.62rem", fontWeight: 900, padding: "1px 6px", borderRadius: 10,
                  }}>{tab.bubble}</span>
                )}
              </button>
            ))}
          </div>

          {activeTab === "jobs" && <JobsPanel />}
          {activeTab === "apps" && <ApplicationsPanel />}
          {activeTab === "alumni" && <AlumniPanel />}
        </main>

        <CareerRightPanel />
      </div>
    </div>
  );
}
