import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// ─── Admin API helper ─────────────────────────────────────────────────────────
const aReq = (method, url, data = null, isForm = false) => {
  const config = {};
  if (isForm) config.headers = { "Content-Type": "multipart/form-data" };
  return api({ method, url: `/admin${url}`, data, ...config });
};

// ─── FIX 1: SectionTitle moved OUTSIDE component so it's not recreated on render
function SectionTitle({ title }) {
  return <div style={{ fontSize: "1.35rem", fontWeight: 900, marginBottom: 20, color: "#111" }}>{title}</div>;
}

// ─── Reusable components (all outside — same fix) ─────────────────────────────
function Badge({ label, color, bg }) {
  return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 800, background: bg, color }}>{label}</span>;
}

function Btn({ onClick, children, color = "#4F6EF7", small, disabled, danger }) {
  const bg  = danger ? "#FEE2E2" : color;
  const col = danger ? "#991B1B" : "#fff";
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: small ? "5px 12px" : "9px 20px", borderRadius: small ? 8 : 10, border: "none", background: disabled ? "#e5e7eb" : bg, color: disabled ? "#9ca3af" : col, fontFamily: "'Nunito',sans-serif", fontSize: small ? "0.75rem" : "0.85rem", fontWeight: 800, cursor: disabled ? "default" : "pointer" }}>
      {children}
    </button>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: "20px 22px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 50, height: 50, borderRadius: 14, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "1.9rem", fontWeight: 900, color: "#111", lineHeight: 1 }}>{value ?? "—"}</div>
        <div style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 700, marginTop: 3 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Event Form Modal ─────────────────────────────────────────────────────────
function EventFormModal({ event, onClose, onSaved }) {
  const isEdit = !!event;
  const [form, setForm] = useState({
    title:       event?.title       || "",
    description: event?.description || "",
    date:        event?.date?.start ? new Date(event.date.start).toISOString().slice(0, 10) : "",
    time:        event?.time        || "",
    venue:       event?.venue       || "",
    category:    event?.category    || "cultural",
    seats:       event?.capacity    || "",
  });
  const [imageFile, setFile]  = useState(null);
  const [preview, setPreview] = useState(event?.banner || null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const fileRef               = useRef(null);
  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title || !form.date || !form.venue) { setError("Title, date and venue are required"); return; }
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      const { data } = isEdit
        ? await aReq("put", `/events/${event._id}`, fd, true)
        : await aReq("post", "/events", fd, true);
      onSaved(data, isEdit);
      onClose();
    } catch (err) { setError(err.response?.data?.message || "Failed to save"); }
    finally { setLoading(false); }
  };

  const inp = { width: "100%", padding: "10px 14px", border: "2px solid #e5e7eb", borderRadius: 10, fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: 18, width: 540, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #e5e7eb", fontWeight: 900, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {isEdit ? "✏️ Edit Event" : "🎉 Create Event"}
          <button onClick={onClose} style={{ border: "none", background: "#f3f4f6", borderRadius: "50%", width: 28, height: 28, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: 22 }}>
          {error && <div style={{ background: "#FEE2E2", color: "#991B1B", borderRadius: 10, padding: "10px 14px", fontSize: "0.83rem", fontWeight: 700, marginBottom: 14 }}>❌ {error}</div>}
          <div style={{ marginBottom: 16 }}>
            {preview
              ? <div style={{ position: "relative", marginBottom: 8 }}>
                  <img src={preview} alt="" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10 }} />
                  <button onClick={() => { setFile(null); setPreview(null); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", color: "white", width: 26, height: 26, borderRadius: "50%", cursor: "pointer" }}>✕</button>
                </div>
              : <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #e5e7eb", borderRadius: 10, height: 100, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#f9fafb", marginBottom: 8 }}>
                  <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>🖼️ Click to add event banner</span>
                </div>
            }
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
          </div>
          {[["title","Event Title *","text","Tech Fest 2025"],["venue","Venue *","text","Main Auditorium"],["time","Time","text","10:00 AM"]].map(([name, label, type, ph]) => (
            <div key={name} style={{ marginBottom: 12 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 5 }}>{label}</label>
              <input name={name} type={type} value={form[name]} onChange={onChange} placeholder={ph} style={inp} />
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 5 }}>Date *</label>
              <input name="date" type="date" value={form.date} onChange={onChange} style={inp} />
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 5 }}>Capacity (0 = unlimited)</label>
              <input name="seats" type="number" value={form.seats} onChange={onChange} placeholder="100" style={inp} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 5 }}>Category</label>
            <select name="category" value={form.category} onChange={onChange} style={inp}>
              {["cultural","technical","sports","academic","workshop","seminar","hackathon","other"].map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 5 }}>Description</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={3} placeholder="Describe the event…" style={{ ...inp, resize: "none" }} />
          </div>
        </div>
        <div style={{ padding: "14px 22px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn onClick={onClose} color="#f3f4f6"><span style={{ color: "#6b7280" }}>Cancel</span></Btn>
          <Btn onClick={handleSubmit} disabled={loading}>{loading ? "Saving…" : isEdit ? "💾 Save" : "✨ Create"}</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Notice Form Modal ────────────────────────────────────────────────────────
function NoticeFormModal({ notice, onClose, onSaved }) {
  const isEdit = !!notice;
  const [form, setForm] = useState({
    title:     notice?.title       || "",
    content:   notice?.description || "",
    category:  notice?.type        || "general",
    important: notice?.isPinned    || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSubmit = async () => {
    if (!form.title || !form.content) { setError("Title and content are required"); return; }
    setLoading(true); setError("");
    try {
      const payload = { title: form.title, content: form.content, category: form.category, important: String(form.important) };
      const { data } = isEdit
        ? await aReq("put", `/notices/${notice._id}`, payload)
        : await (() => { const fd = new FormData(); Object.entries(payload).forEach(([k, v]) => fd.append(k, v)); return aReq("post", "/notices", fd, true); })();
      onSaved(data, isEdit);
      onClose();
    } catch (err) { setError(err.response?.data?.message || "Failed to save"); }
    finally { setLoading(false); }
  };

  const inp = { width: "100%", padding: "10px 14px", border: "2px solid #e5e7eb", borderRadius: 10, fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: 18, width: 520, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #e5e7eb", fontWeight: 900, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {isEdit ? "✏️ Edit Notice" : "📢 Post Notice"}
          <button onClick={onClose} style={{ border: "none", background: "#f3f4f6", borderRadius: "50%", width: 28, height: 28, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: 22 }}>
          {error && <div style={{ background: "#FEE2E2", color: "#991B1B", borderRadius: 10, padding: "10px 14px", fontSize: "0.83rem", fontWeight: 700, marginBottom: 14 }}>❌ {error}</div>}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 5 }}>Title *</label>
            <input name="title" value={form.title} onChange={onChange} placeholder="Notice title" style={inp} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 5 }}>Category</label>
              <select name="category" value={form.category} onChange={onChange} style={inp}>
                {["general","academic","event","exam","holiday","urgent"].map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 2 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 700, fontSize: "0.85rem" }}>
                <input type="checkbox" name="important" checked={form.important} onChange={onChange} style={{ width: 16, height: 16, cursor: "pointer" }} />
                🔴 Mark as Important
              </label>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 5 }}>Content *</label>
            <textarea name="content" value={form.content} onChange={onChange} rows={5} placeholder="Write the notice content…" style={{ ...inp, resize: "vertical" }} />
          </div>
        </div>
        <div style={{ padding: "14px 22px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn onClick={onClose} color="#f3f4f6"><span style={{ color: "#6b7280" }}>Cancel</span></Btn>
          <Btn onClick={handleSubmit} disabled={loading}>{loading ? "Saving…" : isEdit ? "💾 Save" : "📢 Post Notice"}</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Main AdminDashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate  = useNavigate();
  const adminUser = (() => { try { return JSON.parse(localStorage.getItem("adminUser") || "null"); } catch { return null; } })();

  const [tab, setTab]               = useState("overview");
  const [stats, setStats]           = useState(null);
  const [users, setUsers]           = useState([]);
  const [userPage, setUserPage]     = useState(1);
  const [userPages, setUserPages]   = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [posts, setPosts]           = useState([]);
  const [postPage, setPostPage]     = useState(1);
  const [postPages, setPostPages]   = useState(1);
  const [events, setEvents]         = useState([]);
  const [eventModal, setEventModal] = useState(null);
  const [notices, setNotices]       = useState([]);
  const [noticeModal, setNoticeModal] = useState(null);
  const [announce, setAnnounce]         = useState("");
  const [announceLink, setAnnounceLink] = useState("");
  const [announceStatus, setAnnounceStatus] = useState("");
  const [loading, setLoading]       = useState(false);

  // Guard
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token || adminUser?.role !== "admin") navigate("/cc-admin");
  }, [navigate, adminUser]);

  // Stats on mount
  useEffect(() => {
    aReq("get", "/stats").then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  // ── Loaders defined with useCallback ────────────────────────────
  const loadUsers = useCallback(() => {
    setLoading(true);
    aReq("get", `/users?page=${userPage}&search=${userSearch}`)
      .then(({ data }) => { setUsers(data.users || []); setUserPages(data.pages || 1); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userPage, userSearch]);

  const loadPosts = useCallback(() => {
    setLoading(true);
    aReq("get", `/posts?page=${postPage}`)
      .then(({ data }) => { setPosts(data.posts || []); setPostPages(data.pages || 1); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postPage]);

  const loadEvents = useCallback(() => {
    setLoading(true);
    aReq("get", "/events")
      .then(({ data }) => setEvents(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadNotices = useCallback(() => {
    setLoading(true);
    aReq("get", "/notices")
      .then(({ data }) => setNotices(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // FIX 2: Single effect — calls loaders inside .then() callbacks, never synchronously
  // This satisfies react-hooks/set-state-in-effect because setState only runs
  // inside the async .then() / .finally() — not in the synchronous effect body.
    useEffect(() => {
    const fetchData = async () => {
        if (tab === "users")   await loadUsers();
        if (tab === "posts")   await loadPosts();
        if (tab === "events")  await loadEvents();
        if (tab === "notices") await loadNotices();
    };

    fetchData();
    }, [tab, loadUsers, loadPosts, loadEvents, loadNotices]);

  // ── Action handlers ──────────────────────────────────────────────
  const handleBan = async (id) => {
    await aReq("put", `/users/${id}/ban`).catch(() => {});
    loadUsers();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user and all their posts?")) return;
    await aReq("delete", `/users/${id}`).catch(() => {});
    loadUsers();
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await aReq("delete", `/posts/${id}`).catch(() => {});
    loadPosts();
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await aReq("delete", `/events/${id}`).catch(() => {});
    loadEvents();
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    await aReq("delete", `/notices/${id}`).catch(() => {});
    loadNotices();
  };

  const handleEventSaved = (data, isEdit) => {
    if (isEdit) setEvents((p) => p.map((e) => e._id === data._id ? data : e));
    else        setEvents((p) => [data, ...p]);
  };

  const handleNoticeSaved = (data, isEdit) => {
    if (isEdit) setNotices((p) => p.map((n) => n._id === data._id ? data : n));
    else        setNotices((p) => [data, ...p]);
  };

  const handleAnnounce = async () => {
    if (!announce.trim()) return;
    try {
      const { data } = await aReq("post", "/announcement", { message: announce, link: announceLink });
      setAnnounceStatus(`✅ ${data.message}`);
      setAnnounce(""); setAnnounceLink("");
    } catch { setAnnounceStatus("❌ Failed to send"); }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/cc-admin");
  };

  const TABS = [
    { key: "overview", label: "📊 Overview" },
    { key: "users",    label: "👥 Users" },
    { key: "posts",    label: "📰 Posts" },
    { key: "events",   label: "🎉 Events" },
    { key: "notices",  label: "📢 Notices" },
    { key: "announce", label: "📣 Announce" },
  ];

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", minHeight: "100vh", background: "#f3f4f6", display: "flex" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {eventModal  && <EventFormModal  event={eventModal  === "create" ? null : eventModal}  onClose={() => setEventModal(null)}  onSaved={handleEventSaved}  />}
      {noticeModal && <NoticeFormModal notice={noticeModal === "create" ? null : noticeModal} onClose={() => setNoticeModal(null)} onSaved={handleNoticeSaved} />}

      {/* ── Sidebar ── */}
      <div style={{ width: 230, background: "linear-gradient(180deg,#0f0c29 0%,#302b63 100%)", display: "flex", flexDirection: "column", flexShrink: 0, minHeight: "100vh" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "white" }}>🔐 Admin Panel</div>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: 3 }}>CampusConnect</div>
        </div>
        <nav style={{ flex: 1, padding: "14px 10px" }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ width: "100%", padding: "10px 14px", border: "none", borderLeft: `3px solid ${tab === t.key ? "#4F6EF7" : "transparent"}`, borderRadius: "0 10px 10px 0", background: tab === t.key ? "rgba(79,110,247,0.2)" : "transparent", color: tab === t.key ? "white" : "rgba(255,255,255,0.45)", fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", textAlign: "left", marginBottom: 3 }}>
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "14px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", paddingLeft: 4, marginBottom: 8 }}>👤 {adminUser?.name || "Admin"}</div>
          <button onClick={handleLogout} style={{ width: "100%", padding: "8px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, background: "transparent", color: "rgba(255,255,255,0.4)", fontFamily: "'Nunito',sans-serif", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <SectionTitle title="📊 Dashboard Overview" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 28 }}>
              <StatCard icon="👥" label="Total Users"    value={stats?.totalUsers}    color="#4F6EF7" />
              <StatCard icon="📰" label="Total Posts"    value={stats?.totalPosts}    color="#10b981" />
              <StatCard icon="🎉" label="Events"         value={stats?.totalEvents}   color="#f59e0b" />
              <StatCard icon="📢" label="Notices"        value={stats?.totalNotices}  color="#ef4444" />
              <StatCard icon="🆕" label="New Today"      value={stats?.newUsersToday} color="#06b6d4" />
            </div>
            <div style={{ background: "white", borderRadius: 16, padding: 22, border: "1px solid #e5e7eb" }}>
              <div style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: 12, color: "#374151" }}>Quick Actions</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[["👥 Manage Users","users"],["🎉 Create Event","events"],["📢 Post Notice","notices"],["📣 Announce","announce"]].map(([label, t]) => (
                  <Btn key={t} onClick={() => setTab(t)} small>{label}</Btn>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <div>
            <SectionTitle title="👥 User Management" />
            <input value={userSearch} onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }} placeholder="🔍 Search name, email, department…"
              style={{ width: "100%", maxWidth: 400, padding: "10px 16px", border: "2px solid #e5e7eb", borderRadius: 10, fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem", outline: "none", marginBottom: 16, boxSizing: "border-box" }}
            />
            {loading ? <div style={{ color: "#9ca3af" }}>Loading…</div> : (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                      {["User","Dept / Year","Joined","Status","Actions"].map((h) => (
                        <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "0.72rem", fontWeight: 800, color: "#9ca3af", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 && (
                      <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", color: "#9ca3af" }}>No users found</td></tr>
                    )}
                    {users.map((u, i) => (
                      <tr key={u._id} style={{ borderBottom: i < users.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: u.avatar ? `url(${u.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", flexShrink: 0, overflow: "hidden" }}>{!u.avatar && "🧑‍🎓"}</div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>{u.name}</div>
                              <div style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#6b7280" }}>{u.department || "—"} · {u.year || "—"}</td>
                        <td style={{ padding: "12px 16px", fontSize: "0.75rem", color: "#9ca3af" }}>{new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <Badge label={u.isBanned ? "⛔ Banned" : "✅ Active"} color={u.isBanned ? "#991B1B" : "#065F46"} bg={u.isBanned ? "#FEE2E2" : "#D1FAE5"} />
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <Btn small onClick={() => handleBan(u._id)} color={u.isBanned ? "#10b981" : "#f59e0b"}>{u.isBanned ? "Unban" : "Ban"}</Btn>
                            <Btn small danger onClick={() => handleDeleteUser(u._id)}>Delete</Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center" }}>
              <Btn small onClick={() => setUserPage((p) => Math.max(1, p - 1))} disabled={userPage === 1}>← Prev</Btn>
              <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>Page {userPage} of {userPages}</span>
              <Btn small onClick={() => setUserPage((p) => Math.min(userPages, p + 1))} disabled={userPage === userPages}>Next →</Btn>
            </div>
          </div>
        )}

        {/* POSTS */}
        {tab === "posts" && (
          <div>
            <SectionTitle title="📰 Post Moderation" />
            {loading ? <div style={{ color: "#9ca3af" }}>Loading…</div> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {posts.length === 0 && <div style={{ color: "#9ca3af" }}>No posts yet</div>}
                {posts.map((post) => (
                  <div key={post._id} style={{ background: "white", borderRadius: 12, padding: "14px 18px", border: "1px solid #e5e7eb", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: post.author?.avatar ? `url(${post.author.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", flexShrink: 0, overflow: "hidden" }}>{!post.author?.avatar && "🧑‍🎓"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>{post.author?.name} <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "0.72rem" }}>· {post.author?.department}</span></div>
                      <div style={{ fontSize: "0.82rem", color: "#374151", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 480 }} dangerouslySetInnerHTML={{ __html: post.text || "(no text)" }} />
                      <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: 4 }}>👍 {post.likes?.length || 0} · 💬 {post.comments?.length || 0} · {new Date(post.createdAt).toLocaleDateString("en-IN")}</div>
                    </div>
                    <Btn small danger onClick={() => handleDeletePost(post._id)}>🗑️ Delete</Btn>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center" }}>
              <Btn small onClick={() => setPostPage((p) => Math.max(1, p - 1))} disabled={postPage === 1}>← Prev</Btn>
              <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>Page {postPage} of {postPages}</span>
              <Btn small onClick={() => setPostPage((p) => Math.min(postPages, p + 1))} disabled={postPage === postPages}>Next →</Btn>
            </div>
          </div>
        )}

        {/* EVENTS */}
        {tab === "events" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <SectionTitle title="🎉 Events Management" />
              <Btn onClick={() => setEventModal("create")}>+ Create Event</Btn>
            </div>
            {loading ? <div style={{ color: "#9ca3af" }}>Loading…</div> : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
                {events.length === 0 && <div style={{ color: "#9ca3af", gridColumn: "1/-1" }}>No events yet. Create one!</div>}
                {events.map((ev) => (
                  <div key={ev._id} style={{ background: "white", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                    {ev.banner && <img src={ev.banner} alt="" style={{ width: "100%", height: 130, objectFit: "cover" }} />}
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <div style={{ fontWeight: 900, fontSize: "0.92rem" }}>{ev.title}</div>
                        <Badge label={ev.category} color="#4F6EF7" bg="#EEF1FE" />
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 4 }}>
                        📅 {ev.date?.start ? new Date(ev.date.start).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 10 }}>📍 {ev.venue} {ev.capacity > 0 && `· 💺 ${ev.capacity} seats`}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Btn small onClick={() => setEventModal(ev)}>✏️ Edit</Btn>
                        <Btn small danger onClick={() => handleDeleteEvent(ev._id)}>🗑️ Delete</Btn>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTICES */}
        {tab === "notices" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <SectionTitle title="📢 Notices Management" />
              <Btn onClick={() => setNoticeModal("create")}>+ Post Notice</Btn>
            </div>
            {loading ? <div style={{ color: "#9ca3af" }}>Loading…</div> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {notices.length === 0 && <div style={{ color: "#9ca3af" }}>No notices yet. Post one!</div>}
                {notices.map((n) => (
                  <div key={n._id} style={{ background: "white", borderRadius: 12, border: `1px solid ${n.isPinned ? "#fca5a5" : "#e5e7eb"}`, borderLeft: `4px solid ${n.isPinned ? "#ef4444" : "#4F6EF7"}`, padding: "14px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <div style={{ fontWeight: 900, fontSize: "0.92rem" }}>{n.title}</div>
                        {n.isPinned && <Badge label="🔴 Important" color="#991B1B" bg="#FEE2E2" />}
                        <Badge label={n.type || "general"} color="#4F6EF7" bg="#EEF1FE" />
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 560 }}>{n.description}</div>
                      <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: 4 }}>{new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <Btn small onClick={() => setNoticeModal(n)}>✏️ Edit</Btn>
                      <Btn small danger onClick={() => handleDeleteNotice(n._id)}>🗑️ Delete</Btn>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ANNOUNCE */}
        {tab === "announce" && (
          <div>
            <SectionTitle title="📣 Send Announcement" />
            <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e5e7eb", maxWidth: 580 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#6b7280", marginBottom: 6 }}>Message — sent as notification to ALL students</div>
              <textarea value={announce} onChange={(e) => setAnnounce(e.target.value)} rows={4} placeholder="Write your announcement here…"
                style={{ width: "100%", padding: "12px 14px", border: "2px solid #e5e7eb", borderRadius: 10, fontFamily: "'Nunito',sans-serif", fontSize: "0.9rem", outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 12 }} />
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#6b7280", marginBottom: 6 }}>Link on click (optional)</div>
              <input value={announceLink} onChange={(e) => setAnnounceLink(e.target.value)} placeholder="/notices or /events"
                style={{ width: "100%", padding: "10px 14px", border: "2px solid #e5e7eb", borderRadius: 10, fontFamily: "'Nunito',sans-serif", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", marginBottom: 16 }} />
              {announceStatus && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: announceStatus.startsWith("✅") ? "#D1FAE5" : "#FEE2E2", color: announceStatus.startsWith("✅") ? "#065F46" : "#991B1B", fontWeight: 700, fontSize: "0.85rem", marginBottom: 12 }}>
                  {announceStatus}
                </div>
              )}
              <Btn onClick={handleAnnounce} disabled={!announce.trim()}>📣 Send to All Users</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}