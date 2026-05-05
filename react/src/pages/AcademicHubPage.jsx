import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { colors } from "../styles/theme";

// ─── Static data (replace with API calls as needed) ───────────────────────────
const RESOURCES = [
  { id: 1, title: "Data Structures Complete Notes", subject: "DSA", type: "notes", semester: "3rd", uploader: "Priya Sharma", downloads: 234, likes: 87, size: "2.4 MB", url: "#", color: "#DBEAFE", icon: "📘" },
  { id: 2, title: "DBMS Previous Year Papers 2023", subject: "DBMS", type: "paper", semester: "4th", uploader: "Rahul Verma", downloads: 412, likes: 156, size: "1.1 MB", url: "#", color: "#D1FAE5", icon: "📄" },
  { id: 3, title: "OS Concepts - Detailed PPT", subject: "OS", type: "slides", semester: "4th", uploader: "Anjali Negi", downloads: 189, likes: 72, size: "5.6 MB", url: "#", color: "#EDE9FE", icon: "🖥️" },
  { id: 4, title: "Computer Networks Lab Manual", subject: "CN", type: "lab", semester: "5th", uploader: "Vikram Singh", downloads: 98, likes: 41, size: "3.2 MB", url: "#", color: "#FEF3C7", icon: "🔬" },
  { id: 5, title: "Machine Learning Roadmap 2025", subject: "ML", type: "notes", semester: "6th", uploader: "Sana Malik", downloads: 567, likes: 231, size: "890 KB", url: "#", color: "#FCE7F3", icon: "🤖" },
  { id: 6, title: "Web Dev Interview Questions", subject: "Web Dev", type: "notes", semester: "All", uploader: "Dev Kumar", downloads: 789, likes: 312, size: "1.8 MB", url: "#", color: "#EEF1FE", icon: "🌐" },
];

const STUDY_GROUPS = [
  { id: 1, name: "DSA Practice Group", subject: "DSA", members: 24, maxMembers: 30, nextSession: "Today 6 PM", description: "Daily coding problems and weekly mock interviews", tags: ["LeetCode", "Arrays", "DP"], color: "#4F6EF7" },
  { id: 2, name: "ML Study Circle", subject: "Machine Learning", members: 18, maxMembers: 20, nextSession: "Tomorrow 5 PM", description: "Working through Andrew Ng's ML course together", tags: ["Python", "sklearn", "Neural Nets"], color: "#10b981" },
  { id: 3, name: "Web Dev Builders", subject: "Web Development", members: 31, maxMembers: 40, nextSession: "Wed 7 PM", description: "Build projects together, code reviews, portfolio help", tags: ["React", "Node.js", "Projects"], color: "#f59e0b" },
  { id: 4, name: "GATE 2026 Prep", subject: "GATE", members: 45, maxMembers: 50, nextSession: "Daily 8 AM", description: "Structured GATE preparation with topic-wise sessions", tags: ["GATE", "Competitive", "Mock Tests"], color: "#8b5cf6" },
];

const TIMETABLE = [
  { day: "Mon", slots: [
    { time: "9:00", subject: "Data Structures", room: "CS-101", teacher: "Dr. Sharma", type: "lecture" },
    { time: "11:00", subject: "DBMS", room: "CS-102", teacher: "Prof. Gupta", type: "lecture" },
    { time: "2:00", subject: "OS Lab", room: "Lab-1", teacher: "Mr. Negi", type: "lab" },
  ]},
  { day: "Tue", slots: [
    { time: "10:00", subject: "Computer Networks", room: "CS-201", teacher: "Dr. Verma", type: "lecture" },
    { time: "12:00", subject: "Software Engineering", room: "CS-103", teacher: "Prof. Rao", type: "lecture" },
  ]},
  { day: "Wed", slots: [
    { time: "9:00", subject: "Data Structures", room: "CS-101", teacher: "Dr. Sharma", type: "lecture" },
    { time: "11:00", subject: "ML Lab", room: "Lab-2", teacher: "Dr. Patel", type: "lab" },
    { time: "3:00", subject: "Project Work", room: "CS-301", teacher: "Prof. Gupta", type: "project" },
  ]},
  { day: "Thu", slots: [
    { time: "10:00", subject: "DBMS", room: "CS-102", teacher: "Prof. Gupta", type: "lecture" },
    { time: "2:00", subject: "Computer Networks", room: "CS-201", teacher: "Dr. Verma", type: "lecture" },
  ]},
  { day: "Fri", slots: [
    { time: "9:00", subject: "Software Engineering", room: "CS-103", teacher: "Prof. Rao", type: "lecture" },
    { time: "11:00", subject: "DS Lab", room: "Lab-1", teacher: "Mr. Negi", type: "lab" },
  ]},
];

const ASSIGNMENTS = [
  { id: 1, title: "Implement AVL Tree with all rotations", subject: "DSA", due: "2026-05-08", priority: "high", submitted: false, marks: 20 },
  { id: 2, title: "Design ER Diagram for Hospital DB", subject: "DBMS", due: "2026-05-10", priority: "medium", submitted: false, marks: 15 },
  { id: 3, title: "Process Scheduling Simulation", subject: "OS", due: "2026-05-06", priority: "high", submitted: false, marks: 25 },
  { id: 4, title: "TCP vs UDP Analysis Report", subject: "CN", due: "2026-05-15", priority: "low", submitted: true, marks: 10 },
  { id: 5, title: "Linear Regression from Scratch", subject: "ML", due: "2026-05-12", priority: "medium", submitted: false, marks: 30 },
];

const CGPA_DATA = [
  { sem: "Sem 1", cgpa: 7.8 },
  { sem: "Sem 2", cgpa: 8.2 },
  { sem: "Sem 3", cgpa: 8.6 },
  { sem: "Sem 4", cgpa: 8.4 },
  { sem: "Sem 5", cgpa: 8.9 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = ["9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00"];

const typeColor = { lecture: "#4F6EF7", lab: "#10b981", project: "#f59e0b" };
const typeBg    = { lecture: "#EEF1FE", lab: "#D1FAE5", project: "#FEF3C7" };
const priorityColor = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
const priorityBg    = { high: "#FEE2E2", medium: "#FEF3C7", low: "#D1FAE5" };

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / 86400000);
}

export default function AcademicHubPage() {
  useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [activeTab, setActiveTab] = useState("resources");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [assignments, setAssignments] = useState(ASSIGNMENTS);
  const [showUpload, setShowUpload] = useState(false);
  const [likedRes, setLikedRes] = useState([]);

  const TABS = [
    { key: "resources",   label: "📚 Resources",      desc: "Notes & Papers" },
    { key: "groups",      label: "👥 Study Groups",    desc: "Collaborate" },
    { key: "timetable",   label: "🗓️ Timetable",       desc: "Schedule" },
    { key: "assignments", label: "📝 Assignments",     desc: "Due Dates" },
    { key: "cgpa",        label: "📊 CGPA Tracker",    desc: "Performance" },
  ];

  const filteredResources = RESOURCES.filter(r => {
    const matchType = resourceFilter === "all" || r.type === resourceFilter;
    const matchSearch = r.title.toLowerCase().includes(searchQ.toLowerCase()) ||
                        r.subject.toLowerCase().includes(searchQ.toLowerCase());
    return matchType && matchSearch;
  });

  const pendingAssignments = assignments.filter(a => !a.submitted);
  const overdue = pendingAssignments.filter(a => daysUntil(a.due) < 0);
  const currentCGPA = CGPA_DATA[CGPA_DATA.length - 1].cgpa;
  const maxCGPA = Math.max(...CGPA_DATA.map(d => d.cgpa));

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", background: colors.bg, minHeight: "100vh", color: colors.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lora:ital,wght@0,600;1,400&display=swap" rel="stylesheet" />
      <Navbar onNotifClick={() => setShowNotif(!showNotif)} />

      <div style={{ paddingTop: 58 }}>
        {/* ── Hero Banner ── */}
        <div style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)", padding: "32px 32px 0", position: "relative", overflow: "hidden" }}>
          {/* Background decoration */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(79,110,247,0.15)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", bottom: 0, left: "30%", width: 150, height: 150, borderRadius: "50%", background: "rgba(123,97,255,0.1)", filter: "blur(30px)" }} />

          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 28 }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>
                  CampusConnect
                </div>
                <div style={{ color: "white", fontWeight: 900, fontSize: "2rem", lineHeight: 1.2, marginBottom: 8 }}>
                  Academic Hub 🎓
                </div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem", maxWidth: 400 }}>
                  Notes, study groups, timetable, assignments — everything academic in one place
                </div>
              </div>

              {/* Quick stats */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { icon: "📚", val: RESOURCES.length, label: "Resources" },
                  { icon: "⚠️", val: overdue.length, label: "Overdue", red: true },
                  { icon: "📝", val: pendingAssignments.length, label: "Pending" },
                  { icon: "⭐", val: currentCGPA, label: "Current CGPA" },
                ].map((s, i) => (
                  <div key={i} style={{ background: s.red ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)", border: `1px solid ${s.red ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.12)"}`, borderRadius: 14, padding: "12px 18px", textAlign: "center", minWidth: 80 }}>
                    <div style={{ fontSize: "1.2rem" }}>{s.icon}</div>
                    <div style={{ color: s.red ? "#fca5a5" : "white", fontWeight: 900, fontSize: "1.3rem", lineHeight: 1 }}>{s.val}</div>
                    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.68rem", fontWeight: 700, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
              {TABS.map((t) => (
                <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: "12px 20px", border: "none", background: activeTab === t.key ? "white" : "transparent", color: activeTab === t.key ? colors.primary : "rgba(255,255,255,0.5)", fontFamily: "'Nunito',sans-serif", fontSize: "0.85rem", fontWeight: 800, cursor: "pointer", borderRadius: "12px 12px 0 0", whiteSpace: "nowrap", transition: "all 0.15s" }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px" }}>

          {/* ═══ RESOURCES TAB ═══ */}
          {activeTab === "resources" && (
            <div>
              {/* Toolbar */}
              <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: colors.textMuted }}>🔍</span>
                  <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search notes, papers, subjects…"
                    style={{ width: "100%", padding: "10px 14px 10px 36px", border: `2px solid ${colors.border}`, borderRadius: 12, fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["all", "notes", "paper", "slides", "lab"].map((f) => (
                    <button key={f} onClick={() => setResourceFilter(f)} style={{ padding: "8px 16px", borderRadius: 20, border: `2px solid ${resourceFilter === f ? colors.primary : colors.border}`, background: resourceFilter === f ? colors.primary : "white", color: resourceFilter === f ? "white" : colors.textMuted, fontFamily: "'Nunito',sans-serif", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
                      {f === "all" ? "All" : f === "notes" ? "📝 Notes" : f === "paper" ? "📄 Papers" : f === "slides" ? "🖥️ Slides" : "🔬 Lab"}
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowUpload(true)} style={{ padding: "10px 20px", background: colors.primary, color: "white", border: "none", borderRadius: 12, fontFamily: "'Nunito',sans-serif", fontSize: "0.85rem", fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>
                  + Upload Resource
                </button>
              </div>

              {/* Resource grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
                {filteredResources.map((r) => (
                  <div key={r.id} style={{ background: "white", borderRadius: 16, border: `1px solid ${colors.border}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "transform 0.15s, box-shadow 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,110,247,0.12)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
                  >
                    {/* Colored top strip */}
                    <div style={{ height: 6, background: r.color.replace("E", "7").replace("F", "4") }} />
                    <div style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>{r.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: "0.88rem", lineHeight: 1.3, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{r.title}</div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <span style={{ padding: "2px 8px", borderRadius: 20, background: colors.primaryLight, color: colors.primary, fontSize: "0.68rem", fontWeight: 800 }}>{r.subject}</span>
                            <span style={{ padding: "2px 8px", borderRadius: 20, background: colors.bg, color: colors.textMuted, fontSize: "0.68rem", fontWeight: 700 }}>Sem {r.semester}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: "0.72rem", color: colors.textMuted, marginBottom: 12 }}>
                        👤 {r.uploader} · 📦 {r.size}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => setLikedRes(p => p.includes(r.id) ? p.filter(x => x !== r.id) : [...p, r.id])}
                          style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", border: `1.5px solid ${likedRes.includes(r.id) ? "#ef4444" : colors.border}`, borderRadius: 8, background: likedRes.includes(r.id) ? "#FEE2E2" : "white", fontFamily: "'Nunito',sans-serif", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", color: likedRes.includes(r.id) ? "#ef4444" : colors.textMuted }}>
                          {likedRes.includes(r.id) ? "❤️" : "🤍"} {r.likes + (likedRes.includes(r.id) ? 1 : 0)}
                        </button>
                        <span style={{ fontSize: "0.72rem", color: colors.textMuted }}>⬇️ {r.downloads}</span>
                        <a href={r.url} style={{ marginLeft: "auto", padding: "7px 16px", background: colors.primary, color: "white", borderRadius: 8, textDecoration: "none", fontSize: "0.78rem", fontWeight: 800 }}>
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredResources.length === 0 && (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: colors.textMuted }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>📭</div>
                    <div style={{ fontWeight: 700 }}>No resources found</div>
                    <div style={{ fontSize: "0.85rem", marginTop: 4 }}>Try a different search or upload one!</div>
                  </div>
                )}
              </div>

              {/* Upload Modal */}
              {showUpload && (
                <div onClick={(e) => e.target === e.currentTarget && setShowUpload(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ background: "white", borderRadius: 20, width: 480, maxWidth: "95vw", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                    <div style={{ padding: "16px 22px", borderBottom: `1px solid ${colors.border}`, fontWeight: 900, fontSize: "1rem", display: "flex", justifyContent: "space-between" }}>
                      📤 Upload Resource
                      <button onClick={() => setShowUpload(false)} style={{ border: "none", background: colors.bg, borderRadius: "50%", width: 28, height: 28, cursor: "pointer" }}>✕</button>
                    </div>
                    <div style={{ padding: 22 }}>
                      {[["Title", "text", "e.g. Complete DSA Notes Sem 3"], ["Subject", "text", "e.g. Data Structures"], ["Semester", "text", "e.g. 3rd"]].map(([label, type, ph]) => (
                        <div key={label} style={{ marginBottom: 14 }}>
                          <label style={{ fontSize: "0.78rem", fontWeight: 800, color: colors.textMuted, display: "block", marginBottom: 5 }}>{label}</label>
                          <input type={type} placeholder={ph} style={{ width: "100%", padding: "10px 14px", border: `2px solid ${colors.border}`, borderRadius: 10, fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }} />
                        </div>
                      ))}
                      <div style={{ marginBottom: 14 }}>
                        <label style={{ fontSize: "0.78rem", fontWeight: 800, color: colors.textMuted, display: "block", marginBottom: 5 }}>Type</label>
                        <select style={{ width: "100%", padding: "10px 14px", border: `2px solid ${colors.border}`, borderRadius: 10, fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem", outline: "none" }}>
                          <option value="notes">📝 Notes</option>
                          <option value="paper">📄 Previous Year Paper</option>
                          <option value="slides">🖥️ Slides / PPT</option>
                          <option value="lab">🔬 Lab Manual</option>
                        </select>
                      </div>
                      <div style={{ border: `2px dashed ${colors.border}`, borderRadius: 12, padding: "24px", textAlign: "center", cursor: "pointer", background: colors.bg, marginBottom: 16 }}>
                        <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>📎</div>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>Click to select file</div>
                        <div style={{ fontSize: "0.72rem", color: colors.textMuted, marginTop: 4 }}>PDF, PPT, DOC (max 20MB)</div>
                      </div>
                    </div>
                    <div style={{ padding: "14px 22px", borderTop: `1px solid ${colors.border}`, display: "flex", gap: 10, justifyContent: "flex-end" }}>
                      <button onClick={() => setShowUpload(false)} style={{ padding: "9px 20px", border: `1.5px solid ${colors.border}`, borderRadius: 10, background: "white", fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: "pointer", color: colors.textMuted }}>Cancel</button>
                      <button onClick={() => setShowUpload(false)} style={{ padding: "9px 22px", background: colors.primary, color: "white", border: "none", borderRadius: 10, fontFamily: "'Nunito',sans-serif", fontWeight: 800, cursor: "pointer" }}>📤 Upload</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ STUDY GROUPS TAB ═══ */}
          {activeTab === "groups" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: "1.1rem" }}>Study Groups</div>
                  <div style={{ fontSize: "0.82rem", color: colors.textMuted }}>Join a group or create your own</div>
                </div>
                <button style={{ padding: "10px 20px", background: colors.primary, color: "white", border: "none", borderRadius: 12, fontFamily: "'Nunito',sans-serif", fontSize: "0.85rem", fontWeight: 800, cursor: "pointer" }}>
                  + Create Group
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
                {STUDY_GROUPS.map((g) => {
                  const joined = joinedGroups.includes(g.id);
                  const pct    = Math.round((g.members / g.maxMembers) * 100);
                  return (
                    <div key={g.id} style={{ background: "white", borderRadius: 18, border: `1px solid ${colors.border}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                      <div style={{ height: 5, background: g.color }} />
                      <div style={{ padding: "18px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <div>
                            <div style={{ fontWeight: 900, fontSize: "0.95rem" }}>{g.name}</div>
                            <div style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: 2 }}>📚 {g.subject}</div>
                          </div>
                          <div style={{ background: g.color + "22", color: g.color, padding: "4px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 800 }}>
                            {g.members}/{g.maxMembers}
                          </div>
                        </div>
                        <div style={{ fontSize: "0.82rem", color: colors.textMuted, lineHeight: 1.5, marginBottom: 12 }}>{g.description}</div>
                        {/* Tags */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                          {g.tags.map((tag) => (
                            <span key={tag} style={{ padding: "3px 10px", borderRadius: 20, background: colors.bg, border: `1px solid ${colors.border}`, fontSize: "0.68rem", fontWeight: 700, color: colors.textMuted }}>{tag}</span>
                          ))}
                        </div>
                        {/* Members bar */}
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: colors.textMuted, marginBottom: 4 }}>
                            <span>Members</span><span>{pct}% full</span>
                          </div>
                          <div style={{ height: 6, background: colors.border, borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: g.color, borderRadius: 3, transition: "width 0.5s ease" }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontSize: "0.75rem", color: colors.textMuted }}>🕐 Next: <strong>{g.nextSession}</strong></div>
                          <button
                            onClick={() => setJoinedGroups(p => joined ? p.filter(x => x !== g.id) : [...p, g.id])}
                            disabled={!joined && g.members >= g.maxMembers}
                            style={{ padding: "7px 18px", border: "none", borderRadius: 10, background: joined ? "#D1FAE5" : g.members >= g.maxMembers ? colors.border : g.color, color: joined ? "#065F46" : "white", fontFamily: "'Nunito',sans-serif", fontSize: "0.8rem", fontWeight: 800, cursor: g.members >= g.maxMembers && !joined ? "default" : "pointer" }}>
                            {joined ? "✓ Joined" : g.members >= g.maxMembers ? "Full" : "Join Group"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ TIMETABLE TAB ═══ */}
          {activeTab === "timetable" && (
            <div>
              <div style={{ fontWeight: 900, fontSize: "1.1rem", marginBottom: 6 }}>Weekly Timetable</div>
              <div style={{ fontSize: "0.82rem", color: colors.textMuted, marginBottom: 20 }}>Your class schedule for this semester</div>

              {/* Legend */}
              <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                {Object.entries(typeColor).map(([type, col]) => (
                  <div key={type} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 700, color: colors.textMuted }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: col }} />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                ))}
              </div>

              {/* Timetable grid */}
              <div style={{ background: "white", borderRadius: 16, border: `1px solid ${colors.border}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                {/* Header */}
                <div style={{ display: "grid", gridTemplateColumns: "80px repeat(5, 1fr)", background: "#1a1a2e" }}>
                  <div style={{ padding: "12px 8px", fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>TIME</div>
                  {DAYS.map((d) => (
                    <div key={d} style={{ padding: "12px 8px", fontSize: "0.82rem", fontWeight: 900, color: "white", textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>{d}</div>
                  ))}
                </div>

                {/* Rows */}
                {TIMES.map((time, ti) => (
                  <div key={time} style={{ display: "grid", gridTemplateColumns: "80px repeat(5, 1fr)", borderBottom: ti < TIMES.length - 1 ? `1px solid ${colors.border}` : "none" }}>
                    <div style={{ padding: "14px 8px", fontSize: "0.72rem", fontWeight: 700, color: colors.textMuted, textAlign: "center", background: colors.bg, borderRight: `1px solid ${colors.border}` }}>{time}</div>
                    {DAYS.map((day) => {
                      const tt = TIMETABLE.find(t => t.day === day);
                      const slot = tt?.slots.find(s => s.time === time);
                      return (
                        <div key={day} style={{ padding: 6, borderLeft: `1px solid ${colors.border}`, minHeight: 60, display: "flex", alignItems: "center" }}>
                          {slot && (
                            <div style={{ background: typeBg[slot.type], border: `1.5px solid ${typeColor[slot.type]}30`, borderLeft: `3px solid ${typeColor[slot.type]}`, borderRadius: 8, padding: "6px 8px", width: "100%" }}>
                              <div style={{ fontSize: "0.73rem", fontWeight: 800, color: typeColor[slot.type], lineHeight: 1.3 }}>{slot.subject}</div>
                              <div style={{ fontSize: "0.65rem", color: colors.textMuted, marginTop: 2 }}>{slot.room}</div>
                              <div style={{ fontSize: "0.62rem", color: colors.textMuted }}>{slot.teacher}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ ASSIGNMENTS TAB ═══ */}
          {activeTab === "assignments" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: "1.1rem" }}>Assignments</div>
                  <div style={{ fontSize: "0.82rem", color: colors.textMuted }}>{pendingAssignments.length} pending · {overdue.length} overdue</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {assignments.map((a) => {
                  const days = daysUntil(a.due);
                  const urgent = days <= 1 && !a.submitted;
                  return (
                    <div key={a.id} style={{ background: "white", borderRadius: 14, border: `1px solid ${urgent ? "#fca5a5" : colors.border}`, borderLeft: `4px solid ${a.submitted ? "#10b981" : priorityColor[a.priority]}`, padding: "16px 20px", display: "flex", gap: 16, alignItems: "center", boxShadow: urgent ? "0 2px 12px rgba(239,68,68,0.1)" : "0 2px 8px rgba(0,0,0,0.04)" }}>
                      {/* Checkbox */}
                      <div onClick={() => setAssignments(p => p.map(x => x.id === a.id ? { ...x, submitted: !x.submitted } : x))}
                        style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${a.submitted ? "#10b981" : colors.border}`, background: a.submitted ? "#10b981" : "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: "0.8rem" }}>
                        {a.submitted && "✓"}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <div style={{ fontWeight: 800, fontSize: "0.9rem", textDecoration: a.submitted ? "line-through" : "none", color: a.submitted ? colors.textMuted : colors.text }}>{a.title}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ padding: "2px 8px", borderRadius: 20, background: colors.primaryLight, color: colors.primary, fontSize: "0.7rem", fontWeight: 800 }}>{a.subject}</span>
                          <span style={{ padding: "2px 8px", borderRadius: 20, background: priorityBg[a.priority], color: priorityColor[a.priority], fontSize: "0.7rem", fontWeight: 800 }}>
                            {a.priority === "high" ? "🔴" : a.priority === "medium" ? "🟡" : "🟢"} {a.priority}
                          </span>
                          <span style={{ fontSize: "0.72rem", color: colors.textMuted }}>🏆 {a.marks} marks</span>
                        </div>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        {a.submitted ? (
                          <div style={{ color: "#10b981", fontWeight: 800, fontSize: "0.82rem" }}>✅ Submitted</div>
                        ) : (
                          <>
                            <div style={{ fontWeight: 800, fontSize: "0.85rem", color: days < 0 ? "#ef4444" : days <= 2 ? "#f59e0b" : colors.text }}>
                              {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Due today!" : `${days}d left`}
                            </div>
                            <div style={{ fontSize: "0.7rem", color: colors.textMuted }}>
                              {new Date(a.due).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ CGPA TRACKER TAB ═══ */}
          {activeTab === "cgpa" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                {/* Current CGPA card */}
                <div style={{ background: "linear-gradient(135deg,#4F6EF7,#7B61FF)", borderRadius: 20, padding: "28px", color: "white" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, opacity: 0.7, marginBottom: 8, textTransform: "uppercase", letterSpacing: "1px" }}>Current CGPA</div>
                  <div style={{ fontSize: "4rem", fontWeight: 900, lineHeight: 1 }}>{currentCGPA}</div>
                  <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: 8 }}>out of 10.0</div>
                  <div style={{ marginTop: 16, padding: "8px 14px", background: "rgba(255,255,255,0.15)", borderRadius: 10, fontSize: "0.8rem", fontWeight: 700, display: "inline-block" }}>
                    {currentCGPA >= 9 ? "🏆 Outstanding" : currentCGPA >= 8 ? "⭐ Excellent" : currentCGPA >= 7 ? "👍 Good" : "📈 Keep Going"}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ background: "white", borderRadius: 20, padding: "24px", border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontWeight: 900, fontSize: "0.95rem" }}>Semester Summary</div>
                  {[
                    { label: "Highest CGPA", value: maxCGPA, icon: "🏆", color: "#10b981" },
                    { label: "Semesters Completed", value: CGPA_DATA.length, icon: "📅", color: "#4F6EF7" },
                    { label: "Trend", value: currentCGPA > CGPA_DATA[CGPA_DATA.length - 2]?.cgpa ? "↑ Improving" : "↓ Declining", icon: "📈", color: "#f59e0b" },
                  ].map((s) => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: colors.bg, borderRadius: 10 }}>
                      <div style={{ fontSize: "0.82rem", color: colors.textMuted }}>{s.icon} {s.label}</div>
                      <div style={{ fontWeight: 900, color: s.color, fontSize: "0.9rem" }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar chart */}
              <div style={{ background: "white", borderRadius: 20, padding: "24px", border: `1px solid ${colors.border}` }}>
                <div style={{ fontWeight: 900, fontSize: "0.95rem", marginBottom: 24 }}>CGPA Trend</div>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-end", height: 160 }}>
                  {CGPA_DATA.map((d, i) => {
                    const h = Math.round((d.cgpa / 10) * 140);
                    const isLatest = i === CGPA_DATA.length - 1;
                    return (
                      <div key={d.sem} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 800, color: isLatest ? colors.primary : colors.text }}>{d.cgpa}</div>
                        <div style={{ width: "100%", height: h, background: isLatest ? "linear-gradient(180deg,#4F6EF7,#7B61FF)" : colors.primaryLight, borderRadius: "8px 8px 0 0", transition: "height 0.5s ease" }} />
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: colors.textMuted }}>{d.sem}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 20, padding: "12px 16px", background: colors.bg, borderRadius: 10, fontSize: "0.82rem", color: colors.textMuted }}>
                  💡 <strong>Tip:</strong> Maintain above 8.5 CGPA for placement shortlists at top companies. You need <strong>{Math.max(0, (8.5 * (CGPA_DATA.length + 1) - CGPA_DATA.reduce((s, d) => s + d.cgpa, 0))).toFixed(1)}</strong> in the next semester to reach 8.5 overall.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}