import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import NotifDropdown from "../ImageGrid, CommentSection/Modals/NotifDropdown";
import { userAPI, postAPI } from "../api/services";
import { useAuth } from "../context/authContext";
import { colors } from "../styles/theme";

const TABS = [
  { key: "posts", label: "📰 Posts" },
  { key: "about", label: "👤 About" },
  { key: "projects", label: "🛠️ Projects" },
  { key: "achievements", label: "🏆 Achievements" },
  { key: "photos", label: "📷 Photos" },
  { key: "friends", label: "👥 Friends" },
];

// ✅ FIX 1: Moved timeAgo outside the component — it's a pure utility, not a hook
const timeAgo = (d) => {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

function Card({ title, action, onAction, children }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 18, border: `1px solid ${colors.border}`, boxShadow: "0 2px 16px rgba(79,110,247,0.08)", marginBottom: 14 }}>
      {title && (
        <div style={{ fontSize: "0.78rem", fontWeight: 900, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {title}
          {action && <span onClick={onAction} style={{ fontSize: "0.75rem", color: colors.primary, fontWeight: 700, cursor: "pointer", textTransform: "none", letterSpacing: 0 }}>{action}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function LeftColumn({ profile, isOwn }) {
  const rows = [
    { icon: "🏫", label: "College", value: "KJSCE, Mumbai" },
    { icon: "💻", label: "Department", value: profile?.department || "—" },
    { icon: "📅", label: "Year", value: profile?.year ? `${profile.year} Year` : "—" },
    { icon: "🪪", label: "Student ID", value: profile?.studentId || "—" },
    { icon: "✉️", label: "Email", value: profile?.email || "—" },
    { icon: "📍", label: "Location", value: profile?.location || "—" },
  ];
  const skillPalette = [
    { bg: "#EEF1FE", col: "#4F6EF7" }, { bg: "#D1FAE5", col: "#065F46" },
    { bg: "#FEF3C7", col: "#92400E" }, { bg: "#EDE9FE", col: "#5B21B6" },
    { bg: "#FCE7F3", col: "#9D174D" },
  ];
  return (
    <div>
      <Card title="About" action={isOwn ? "Edit" : null}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: i < rows.length - 1 ? `1px solid ${colors.border}` : "none" }}>
            <span style={{ fontSize: "1rem", width: 22, textAlign: "center", flexShrink: 0, marginTop: 1 }}>{r.icon}</span>
            <div>
              <div style={{ fontSize: "0.68rem", color: colors.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px" }}>{r.label}</div>
              <div style={{ fontSize: "0.84rem", fontWeight: 700, color: colors.text, marginTop: 1, wordBreak: "break-all" }}>{r.value}</div>
            </div>
          </div>
        ))}
      </Card>

      <Card title="Skills" action={isOwn ? "+ Add" : null}>
        {(!profile?.skills || profile.skills.length === 0)
          ? <span style={{ fontSize: "0.82rem", color: colors.textMuted }}>No skills added yet</span>
          : <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profile.skills.map((s, i) => {
                const p = skillPalette[i % skillPalette.length];
                return <span key={i} style={{ padding: "5px 13px", borderRadius: 20, border: `1.5px solid ${p.col}`, fontSize: "0.78rem", fontWeight: 700, color: p.col, background: p.bg }}>{s}</span>;
              })}
            </div>}
      </Card>

      <Card title="Clubs & Societies">
        {[
          { icon: "💻", bg: "#DBEAFE", name: "Coding Club", role: "Core Team", bb: "#EEF1FE", bc: "#4F6EF7" },
          { icon: "📷", bg: "#FCE7F3", name: "Photography Club", role: "Member", bb: "#D1FAE5", bc: "#065F46" },
          { icon: "🚀", bg: "#EDE9FE", name: "Startup Cell", role: "Head", bb: "#FEF3C7", bc: "#92400E" },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? `1px solid ${colors.border}` : "none", cursor: "pointer" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{c.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 800 }}>{c.name}</div>
              <span style={{ fontSize: "0.65rem", fontWeight: 800, padding: "2px 7px", borderRadius: 10, background: c.bb, color: c.bc }}>{c.role}</span>
            </div>
          </div>
        ))}
      </Card>

      <Card title="Connect" action={isOwn ? "+ Add" : null}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {profile?.socialLinks && Object.entries(profile.socialLinks).filter(([, v]) => v).map(([k, v]) => (
            <a key={k} href={v} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${colors.border}`, fontSize: "0.78rem", fontWeight: 700, color: colors.textMuted, textDecoration: "none" }}>
              {{ linkedin: "🔗 LinkedIn", github: "🐙 GitHub", portfolio: "🌐 Portfolio", twitter: "🐦 Twitter" }[k] || k}
            </a>
          ))}
          {(!profile?.socialLinks || !Object.values(profile.socialLinks || {}).some(Boolean)) &&
            <span style={{ fontSize: "0.82rem", color: colors.textMuted }}>No links added</span>}
        </div>
      </Card>
    </div>
  );
}

function PostsTab({ userId, isOwn }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postAPI.getFeed(1)
      .then(({ data }) => setPosts(data.filter((p) => p.author?._id === userId)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: colors.textMuted }}>Loading…</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {isOwn && (
        <div onClick={() => navigate("/")} style={{ background: "white", borderRadius: 16, padding: "14px 16px", border: `1px solid ${colors.border}`, boxShadow: "0 2px 16px rgba(79,110,247,0.08)", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#4F6EF7,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🧑‍🎓</div>
          <div style={{ flex: 1, padding: "10px 16px", border: `2px solid ${colors.border}`, borderRadius: 30, fontSize: "0.88rem", color: colors.textMuted, background: colors.bg }}>Share something…</div>
        </div>
      )}
      {posts.length === 0 && (
        <div style={{ background: "white", borderRadius: 16, padding: 50, textAlign: "center", border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>📝</div>
          <div style={{ fontWeight: 700, color: colors.textMuted }}>No posts yet</div>
        </div>
      )}
      {posts.map((post) => (
        <div key={post._id} style={{ background: "white", borderRadius: 16, border: `1px solid ${colors.border}`, boxShadow: "0 2px 16px rgba(79,110,247,0.08)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 10px" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#4F6EF7,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>🧑‍🎓</div>
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: 800 }}>{post.author?.name}</div>
              {/* ✅ FIX 1 applied: timeAgo is now a module-level pure function, safe to call here */}
              <div style={{ fontSize: "0.72rem", color: colors.textMuted }}>{timeAgo(post.createdAt)}</div>
            </div>
          </div>
          {post.text && <div style={{ padding: "0 16px 10px", fontSize: "0.88rem", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: post.text }} />}
          {post.images?.[0] && <img src={post.images[0].url} alt="" style={{ width: "100%", maxHeight: 200, objectFit: "cover" }} />}
          <div style={{ display: "flex", gap: 16, padding: "10px 16px", borderTop: `1px solid ${colors.border}`, fontSize: "0.78rem", color: colors.textMuted }}>
            <span>👍 {post.likes?.length || 0}</span><span>💬 {post.comments?.length || 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutTab(/*profile*/ ) {
  const ed = [
    { title: "B.E. Computer Science & Engineering", sub: "KJSCE, Mumbai · CGPA: 8.7", date: "2021 — 2025" },
    { title: "Higher Secondary Certificate", sub: "Saraswati Junior College · 92.4%", date: "2019 — 2021" },
  ];
  const exp = [
    { title: "Software Engineering Intern", sub: "TCS Innovation Labs · Node.js & MongoDB", date: "May 2024 — Jul 2024" },
    { title: "Frontend Developer Intern", sub: "StartupXYZ · React dashboard", date: "Dec 2023 — Feb 2024" },
  ];
  const interests = ["☕ Coffee","💻 Open Source","📷 Photography","🎮 Gaming","✈️ Travel","📚 Reading","🎸 Music","🧩 Coding"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[["Education", ed, colors.primary], ["Work & Internship Experience", exp, colors.success]].map(([title, items, dot]) => (
        <Card key={title} title={title}>
          <div style={{ marginLeft: 10 }}>
            {items.map((e, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${colors.border}`, paddingLeft: 20, paddingBottom: 14, position: "relative" }}>
                <div style={{ position: "absolute", left: -7, top: 4, width: 12, height: 12, borderRadius: "50%", background: dot, border: "2px solid white" }} />
                <div style={{ fontSize: "0.9rem", fontWeight: 800 }}>{e.title}</div>
                <div style={{ fontSize: "0.78rem", color: colors.textMuted, marginTop: 2 }}>{e.sub}</div>
                <div style={{ fontSize: "0.7rem", color: colors.textMuted, fontWeight: 700, marginTop: 2 }}>{e.date}</div>
              </div>
            ))}
          </div>
        </Card>
      ))}
      <Card title="Interests & Hobbies">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {interests.map((s, i) => <span key={i} style={{ padding: "5px 13px", borderRadius: 20, border: `1.5px solid ${colors.primary}`, fontSize: "0.78rem", fontWeight: 700, color: colors.primary, background: colors.primaryLight }}>{s}</span>)}
        </div>
      </Card>
    </div>
  );
}

function ProjectsTab() {
  const projects = [
    { icon: "🤖", bg: "#DBEAFE", title: "SmartNotes AI", sub: "Personal · In Progress 🟡", desc: "AI-powered study assistant using GPT-4 to summarize notes and create flashcards.", tech: ["React.js","Python","GPT-4","FastAPI","PostgreSQL"] },
    { icon: "🛒", bg: "#D1FAE5", title: "CampusMart", sub: "Academic · Completed ✅", desc: "Peer-to-peer marketplace for college students with real-time chat and payments.", tech: ["React Native","Node.js","MongoDB","Socket.io","Razorpay"] },
    { icon: "🌍", bg: "#EDE9FE", title: "EcoTrack", sub: "Hackathon · 🏆 Winner", desc: "Carbon footprint calculator built at GreenHack 2024.", tech: ["Vue.js","Python","Chart.js","Firebase"] },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}><button style={{ padding: "7px 16px", background: colors.primary, color: "white", border: "none", borderRadius: 20, fontFamily: "'Nunito',sans-serif", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer" }}>+ Add Project</button></div>
      {projects.map((p, i) => (
        <Card key={i}>
          <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{p.icon}</div>
            <div><div style={{ fontSize: "0.97rem", fontWeight: 900 }}>{p.title}</div><div style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: 3 }}>{p.sub}</div></div>
          </div>
          <div style={{ fontSize: "0.85rem", color: colors.textMuted, lineHeight: 1.55, marginBottom: 12 }}>{p.desc}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {p.tech.map((t, j) => <span key={j} style={{ padding: "4px 11px", background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 20, fontSize: "0.73rem", fontWeight: 700, color: colors.textMuted }}>{t}</span>)}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {["🐙 GitHub","🌐 Demo"].map((l, j) => (<button key={j} style={{ padding: "5px 14px", borderRadius: 20, border: `1.5px solid ${colors.border}`, background: "white", fontFamily: "'Nunito',sans-serif", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", color: colors.textMuted }}>{l}</button>))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function AchievementsTab() {
  const sections = [
    { title: "🏆 Competitions", items: [
      { icon: "🥇", bg: "#FEF3C7", title: "1st Place — GreenHack 2024", sub: "Hackathon · IIT Bombay", badge: "🏅 Gold", bs: { background: "#FEF3C7", color: "#92400E" } },
      { icon: "🥈", bg: "#F1F5F9", title: "2nd Place — CampusHack 2023", sub: "College Level", badge: "🥈 Silver", bs: { background: "#F1F5F9", color: "#475569" } },
    ]},
    { title: "📜 Certifications", items: [
      { icon: "☁️", bg: "#DBEAFE", title: "AWS Certified Developer", sub: "Valid until Dec 2026", badge: "✅ Active", bs: { background: "#EEF1FE", color: "#4F6EF7" } },
      { icon: "🤖", bg: "#D1FAE5", title: "Machine Learning Specialization", sub: "Coursera · Andrew Ng · 2023", badge: "✅ Certified", bs: { background: "#EEF1FE", color: "#4F6EF7" } },
    ]},
    { title: "⭐ Honours", items: [
      { icon: "📖", bg: "#FEF3C7", title: "Department Rank 3 — Sem 5", sub: "CGPA: 9.1", badge: "🌟 Top 5%", bs: { background: "#FEF3C7", color: "#92400E" } },
    ]},
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {sections.map((s, si) => (
        <Card key={si} title={s.title}>
          {s.items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < s.items.length - 1 ? `1px solid ${colors.border}` : "none" }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: "0.9rem", fontWeight: 800 }}>{item.title}</div><div style={{ fontSize: "0.75rem", color: colors.textMuted, marginTop: 2 }}>{item.sub}</div></div>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", ...item.bs }}>{item.badge}</span>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}

function PhotosTab({ posts }) {
  const photos = posts.filter((p) => p.images?.length > 0).flatMap((p) => p.images);
  const phs = ["linear-gradient(135deg,#667eea,#764ba2)","linear-gradient(135deg,#f093fb,#f5576c)","linear-gradient(135deg,#4facfe,#00f2fe)","linear-gradient(135deg,#43e97b,#38f9d7)","linear-gradient(135deg,#fa709a,#fee140)","linear-gradient(135deg,#a18cd1,#fbc2eb)","linear-gradient(135deg,#fda085,#f6d365)","linear-gradient(135deg,#89f7fe,#66a6ff)","linear-gradient(135deg,#fddb92,#d1fdff)"];
  const items = photos.length > 0 ? photos : phs.map((bg) => ({ bg }));
  return (
    <Card title={`Photos (${items.length})`} action="+ Upload">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
        {items.map((p, i) => (
          <div key={i} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", cursor: "pointer" }}>
            {p.url ? <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>📸</div>}
          </div>
        ))}
      </div>
    </Card>
  );
}

function FriendsTab({ friends }) {
  const navigate = useNavigate();
  return (
    <Card title={`Friends (${friends?.length || 0})`} action="See all">
      {(!friends || friends.length === 0) && <div style={{ textAlign: "center", padding: 30, color: colors.textMuted }}>No friends yet</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {(friends || []).slice(0, 9).map((f) => (
          <div key={f._id} onClick={() => navigate(`/profile/${f._id}`)} style={{ textAlign: "center", cursor: "pointer" }}>
            <div style={{ width: 70, height: 70, borderRadius: 12, background: f.avatar ? `url(${f.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 6px" }}>{!f.avatar && "🧑‍🎓"}</div>
            <div style={{ fontSize: "0.8rem", fontWeight: 800 }}>{f.name}</div>
            <div style={{ fontSize: "0.7rem", color: colors.textMuted }}>{f.department}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function EditModal({ profile: initialProfile, onClose, onSave }) {
  // ✅ FIX 2: Renamed prop to `initialProfile` so the param name doesn't shadow
  // the destructured value, eliminating the "defined but never used" warning
  const [form, setForm] = useState({
    name: initialProfile?.name || "",
    bio: initialProfile?.bio || "",
    department: initialProfile?.department || "",
    year: initialProfile?.year || "3rd",
    location: initialProfile?.location || "",
    skills: (initialProfile?.skills || []).join(", "),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    setLoading(true); setError("");
    try {
      const payload = { ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) };
      const { data } = await userAPI.updateProfile(payload);
      onSave(data); onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append("avatar", file);
    try {
      const { data } = await userAPI.updateAvatar(fd);
      onSave(data);
    } catch (err) {
      // ✅ FIX 3: Empty catch block replaced with a comment — no silent empty blocks
      console.error("Avatar upload failed:", err);
    }
  };

  const inp = { width: "100%", padding: "10px 14px", border: `2px solid ${colors.border}`, borderRadius: 10, fontFamily: "'Nunito',sans-serif", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(26,29,46,0.55)", backdropFilter: "blur(3px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: 16, width: 520, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${colors.border}`, fontWeight: 900, fontSize: "1rem", textAlign: "center", position: "sticky", top: 0, background: "white", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span /><span>Edit Profile</span>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: colors.bg, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: 14, background: colors.bg, borderRadius: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: initialProfile?.avatar ? `url(${initialProfile.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", flexShrink: 0 }}>{!initialProfile?.avatar && "🧑‍🎓"}</div>
            <div>
              <div style={{ fontWeight: 800, marginBottom: 6, fontSize: "0.9rem" }}>Profile Photo</div>
              <button onClick={() => fileRef.current?.click()} style={{ padding: "6px 16px", background: colors.primary, color: "white", border: "none", borderRadius: 20, fontFamily: "'Nunito',sans-serif", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer" }}>📷 Change</button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: "none" }} />
            </div>
          </div>
          {error && <div style={{ background: "#FEE2E2", color: "#991B1B", borderRadius: 10, padding: "10px 14px", fontSize: "0.83rem", fontWeight: 700, marginBottom: 14 }}>❌ {error}</div>}
          {[["name","Full Name","Your full name"],["location","Location","Mumbai, India"],["skills","Skills (comma separated)","React, Python, Node.js"]].map(([n, l, ph]) => (
            <div key={n} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 800, color: colors.textMuted, display: "block", marginBottom: 6 }}>{l}</label>
              <input name={n} value={form[n]} onChange={onChange} placeholder={ph} style={inp} />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 800, color: colors.textMuted, display: "block", marginBottom: 6 }}>Bio</label>
            <textarea name="bio" value={form.bio} onChange={onChange} rows={3} placeholder="Tell something about yourself…" style={{ ...inp, resize: "none" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["department","Department",["CSE","ECE","Mechanical","Civil","IT","Other"]],["year","Year",["1st","2nd","3rd","4th","Alumni"]]].map(([n, l, opts]) => (
              <div key={n}>
                <label style={{ fontSize: "0.8rem", fontWeight: 800, color: colors.textMuted, display: "block", marginBottom: 6 }}>{l}</label>
                <select name={n} value={form[n]} onChange={onChange} style={{ ...inp }}>
                  {opts.map((o) => <option key={o} value={o}>{o}{n === "year" ? " Year" : ""}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${colors.border}`, display: "flex", gap: 10, justifyContent: "flex-end", position: "sticky", bottom: 0, background: "white" }}>
          <button onClick={onClose} style={{ padding: "9px 22px", border: `1.5px solid ${colors.border}`, borderRadius: 20, background: "white", fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: "pointer", color: colors.textMuted }}>Cancel</button>
          <button onClick={handleSave} disabled={loading} style={{ padding: "9px 22px", border: "none", borderRadius: 20, background: loading ? colors.border : colors.primary, color: "white", fontFamily: "'Nunito',sans-serif", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { id } = useParams();
  const { user: authUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);
  const [friendStatus, setFriendStatus] = useState("none");
  const isOwn = !id || id === authUser?._id;
  const userId = id || authUser?._id;

  // ✅ FIX 4: Wrapped fetchData in useCallback and added all missing deps —
  // authUser?._id, isOwn, navigate — so exhaustive-deps warning is gone
  const fetchData = useCallback(async () => {
    try {
      const [userRes, postRes] = await Promise.all([
        userAPI.getProfile(userId),
        postAPI.getFeed(1).catch(() => ({ data: [] })),
      ]);
      const u = userRes.data;
      const feedPosts = postRes.data;
      setProfile(u);
      setPosts(feedPosts.filter((p) => p.author?._id === u._id));
      if (!isOwn) {
        const isFriend = u.friends?.some((f) => (f._id || f) === authUser?._id);
        setFriendStatus(isFriend ? "friends" : "none");
      }
    } catch (err) {
      console.error(err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [userId, isOwn, authUser?._id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ After
const handleFriendRequest = async () => {
  try {
    await userAPI.sendFriendRequest(userId);
    setFriendStatus("pending");
  } catch (err) {
    console.error("Friend request failed:", err);
  }
};
  const handleSaveProfile = (updated) => { setProfile(updated); if (isOwn) updateUser(updated); };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'Nunito',sans-serif", color: colors.textMuted }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: "2rem", marginBottom: 12 }}>🧑‍🎓</div>Loading profile…</div>
    </div>
  );
  if (!profile) return null;

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", background: colors.bg, color: colors.text, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lora:ital,wght@0,600;1,400&display=swap" rel="stylesheet" />
      <Navbar onNotifClick={() => setShowNotif(!showNotif)} />
      {showNotif && <NotifDropdown onClose={() => setShowNotif(false)} />}
      {showEdit && <EditModal profile={profile} onClose={() => setShowEdit(false)} onSave={handleSaveProfile} />}
      <div style={{ paddingTop: 58 }}>
        <div style={{ width: "100%", height: 150, background: "linear-gradient(135deg,#4F6EF7 0%,#7B61FF 55%,#FF6B6B 100%)", position: "relative", overflow: "hidden" }}>
          {isOwn && <button style={{ position: "absolute", bottom: 12, right: 16, padding: "6px 14px", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", color: "white", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, fontFamily: "'Nunito',sans-serif", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>📷 Edit Cover</button>}
        </div>

        <div style={{ background: "white", borderBottom: `1px solid ${colors.border}`, boxShadow: "0 2px 16px rgba(79,110,247,0.06)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14, paddingBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 18, marginTop: -44 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 100, height: 100, borderRadius: "50%", background: profile.avatar ? `url(${profile.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)", border: "4px solid white", boxShadow: "0 4px 20px rgba(79,110,247,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>{!profile.avatar && "🧑‍🎓"}</div>
                  {isOwn && <div onClick={() => setShowEdit(true)} style={{ position: "absolute", bottom: 2, right: 2, width: 26, height: 26, background: colors.primary, borderRadius: "50%", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", cursor: "pointer", color: "white" }}>✏️</div>}
                  <div style={{ position: "absolute", top: 6, left: 0, background: colors.success, color: "white", fontSize: "0.58rem", fontWeight: 900, padding: "2px 6px", borderRadius: 10, border: "2px solid white" }}>● Online</div>
                </div>
                <div style={{ paddingBottom: 6 }}>
                  <div style={{ fontSize: "1.45rem", fontWeight: 900, color: colors.text, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {profile.name}
                    {profile.isVerified && <span style={{ background: colors.primary, color: "white", fontSize: "0.62rem", fontWeight: 800, padding: "3px 9px", borderRadius: 20 }}>✓ Verified</span>}
                  </div>
                  <div style={{ fontSize: "0.84rem", color: colors.textMuted, marginTop: 3 }}>
                    {[profile.department && `💻 ${profile.department}`, profile.year && `${profile.year} Year`, profile.location && `📍 ${profile.location}`].filter(Boolean).join("  ·  ")}
                  </div>
                  {profile.bio && <div style={{ fontSize: "0.84rem", color: colors.text, lineHeight: 1.5, marginTop: 5, maxWidth: 500 }}>{profile.bio}</div>}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 8 }}>
                {isOwn ? (
                  <>
                    <button onClick={() => setShowEdit(true)} style={{ padding: "8px 20px", background: "linear-gradient(135deg,#4F6EF7,#7B61FF)", color: "white", border: "none", borderRadius: 20, fontFamily: "'Nunito',sans-serif", fontSize: "0.83rem", fontWeight: 800, cursor: "pointer" }}>✏️ Edit Profile</button>
                    <button style={{ padding: "7px 18px", background: "white", color: colors.primary, border: `2px solid ${colors.primary}`, borderRadius: 20, fontFamily: "'Nunito',sans-serif", fontSize: "0.83rem", fontWeight: 800, cursor: "pointer" }}>📤 Share</button>
                  </>
                ) : (
                  <>
                    <button onClick={handleFriendRequest} disabled={friendStatus !== "none"} style={{ padding: "8px 20px", background: friendStatus === "friends" ? colors.success : friendStatus === "pending" ? colors.border : colors.primary, color: "white", border: "none", borderRadius: 20, fontFamily: "'Nunito',sans-serif", fontSize: "0.83rem", fontWeight: 800, cursor: friendStatus === "none" ? "pointer" : "default" }}>
                      {friendStatus === "friends" ? "✓ Friends" : friendStatus === "pending" ? "⏳ Pending" : "+ Add Friend"}
                    </button>
                    <button onClick={() => navigate("/messages")} style={{ padding: "7px 18px", background: "white", color: colors.primary, border: `2px solid ${colors.primary}`, borderRadius: 20, fontFamily: "'Nunito',sans-serif", fontSize: "0.83rem", fontWeight: 800, cursor: "pointer" }}>💬 Message</button>
                  </>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 14 }}>
              {[{num: posts.length, label:"Posts", tab:"posts"},{num:profile.friends?.length||0,label:"Friends",tab:"friends"},{num:profile.savedPosts?.length||0,label:"Saved"}].map((s,i)=>(<div key={i} onClick={()=>s.tab&&setActiveTab(s.tab)} style={{cursor:s.tab?"pointer":"default",textAlign:"center"}}><div style={{fontSize:"1.1rem",fontWeight:900,color:colors.text}}>{s.num}</div><div style={{fontSize:"0.72rem",color:colors.textMuted,fontWeight:600}}>{s.label}</div></div>))}
            </div>
            <div style={{ display: "flex", gap: 2, borderTop: `1px solid ${colors.border}`, overflowX: "auto" }}>
              {TABS.map((tab) => (<button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: "10px 16px", border: "none", borderBottom: `3px solid ${activeTab === tab.key ? colors.primary : "transparent"}`, background: "transparent", fontFamily: "'Nunito',sans-serif", fontSize: "0.83rem", fontWeight: 800, color: activeTab === tab.key ? colors.primary : colors.textMuted, cursor: "pointer", marginBottom: -1, whiteSpace: "nowrap" }}>{tab.label}</button>))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 28px", display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" }}>
          <LeftColumn profile={profile} isOwn={isOwn} />
          <div>
            {activeTab === "posts"        && <PostsTab userId={profile._id} isOwn={isOwn} />}
            {activeTab === "about"        && <AboutTab profile={profile} />}
            {activeTab === "projects"     && <ProjectsTab />}
            {activeTab === "achievements" && <AchievementsTab />}
            {activeTab === "photos"       && <PhotosTab posts={posts} />}
            {activeTab === "friends"      && <FriendsTab friends={profile.friends} />}
          </div>
        </div>
      </div>
    </div>
  );
}