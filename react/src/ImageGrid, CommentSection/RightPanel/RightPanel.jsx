import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI, noticeAPI, eventAPI } from "../../api/services";
import { colors } from "../../styles/theme";

function Widget({ title, seeAll, seeAllPath, children }) {
  const navigate = useNavigate();
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 16, border: `1px solid ${colors.border}`, boxShadow: "0 2px 16px rgba(79,110,247,0.08)" }}>
      <div style={{ fontSize: "0.78rem", fontWeight: 900, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {title}
        {seeAll && <span onClick={() => seeAllPath && navigate(seeAllPath)} style={{ fontSize: "0.72rem", color: colors.primary, fontWeight: 700, cursor: "pointer", textTransform: "none", letterSpacing: 0 }}>See all</span>}
      </div>
      {children}
    </div>
  );
}

function NoticesWidget() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  useEffect(() => {
    noticeAPI.getAll({ limit: 3 }).then(({ data }) => setNotices(data.slice(0, 3))).catch(() => {});
  }, []);

  const dotColors = { urgent: colors.accent, important: colors.warning, info: colors.primary, general: colors.success };
  const fallback = [
    { _id: "1", title: "Semester 6 Exam Schedule Published", type: "urgent", source: "Admin", createdAt: new Date() },
    { _id: "2", title: "Library Timings Extended", type: "info", source: "Library", createdAt: new Date() },
    { _id: "3", title: "Sports Day Registration Open", type: "general", source: "Sports Dept", createdAt: new Date() },
  ];
  const items = notices.length > 0 ? notices : fallback;

  return (
    <Widget title="📢 Latest Notices" seeAll seeAllPath="/notices">
      {items.map((n, i) => (
        <div key={n._id} onClick={() => navigate("/notices")} style={{ display: "flex", gap: 8, padding: "8px 0", cursor: "pointer", borderBottom: i < items.length - 1 ? `1px solid ${colors.border}` : "none", alignItems: "flex-start" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotColors[n.type] || colors.primary, marginTop: 5, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, lineHeight: 1.3 }}>{n.title}</div>
            <div style={{ fontSize: "0.7rem", color: colors.textMuted, marginTop: 2 }}>{n.source}</div>
          </div>
        </div>
      ))}
    </Widget>
  );
}

function EventsWidget() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  useEffect(() => {
    eventAPI.getAll({ status: "upcoming" }).then(({ data }) => setEvents(data.slice(0, 4))).catch(() => {});
  }, []);

  const fallback = [
    { _id: "1", title: "CampusHack 2025 🚀", date: { start: "2025-03-15" }, venue: "Main Hall", organizer: { name: "Coding Club" } },
    { _id: "2", title: "Semester 6 Exams Begin 📝", date: { start: "2025-03-18" }, venue: "Exam Block", organizer: { name: "Admin" } },
    { _id: "3", title: "TED Talk: Future of AI 🎤", date: { start: "2025-03-22" }, venue: "Auditorium", organizer: { name: "AI Society" } },
    { _id: "4", title: "Annual Photography Exhibition 📸", date: { start: "2025-03-28" }, venue: "Gallery Hall", organizer: { name: "Photo Club" } },
  ];
  const items = events.length > 0 ? events : fallback;

  return (
    <Widget title="📅 Upcoming Events" seeAll seeAllPath="/events">
      {items.map((e, i) => {
        const d = new Date(e.date?.start || e.date);
        return (
          <div key={e._id} onClick={() => navigate("/events")} style={{ display: "flex", gap: 10, padding: "8px 0", cursor: "pointer", borderBottom: i < items.length - 1 ? `1px solid ${colors.border}` : "none", alignItems: "center" }}>
            <div style={{ background: colors.primaryLight, color: colors.primary, borderRadius: 8, padding: "5px 8px", textAlign: "center", flexShrink: 0, minWidth: 40 }}>
              <div style={{ fontSize: "1rem", fontWeight: 900, lineHeight: 1 }}>{d.getDate()}</div>
              <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" }}>{d.toLocaleString("default", { month: "short" })}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 800 }}>{e.title}</div>
              <div style={{ fontSize: "0.71rem", color: colors.textMuted, marginTop: 1 }}>{e.organizer?.name} · {e.venue}</div>
            </div>
          </div>
        );
      })}
    </Widget>
  );
}

function TrendingWidget() {
  const trending = ["#CampusHack2025", "#Sem6Exams", "#GoogleInternship", "#PhotoExhibition", "#OSExamPrep"];
  return (
    <Widget title="🔥 Trending on Campus" seeAll>
      {trending.map((tag, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer", borderBottom: i < trending.length - 1 ? `1px solid ${colors.border}` : "none" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 900, color: colors.textMuted, width: 16 }}>{i + 1}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 800 }}>{tag}</div>
            {i === 0 && <div style={{ fontSize: "0.7rem", color: colors.accent }}>🔥 Hot</div>}
          </div>
        </div>
      ))}
    </Widget>
  );
}

function PeopleWidget() {
  const navigate                = useNavigate();
  const [people, setPeople]     = useState([]);
  const [added, setAdded]       = useState({});
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    userAPI.getSuggestions().then(({ data }) => setPeople(data)).catch(() => {});
  }, []);

  const handleAdd = async (userId, i) => {
    setLoadingId(i);
    try {
      await userAPI.sendFriendRequest(userId);
      setAdded((prev) => ({ ...prev, [i]: true }));
    } catch (err) { console.error(err); }
    finally { setLoadingId(null); }
  };

  const fallback = [
    { _id: "f1", name: "Vikram Singh", department: "CSE", year: "3rd" },
    { _id: "f2", name: "Ananya Reddy", department: "ECE", year: "3rd" },
    { _id: "f3", name: "Karan Mehta", department: "CSE", year: "3rd" },
  ];
  const items = people.length > 0 ? people : fallback;

  return (
    <Widget title="👥 People You May Know" seeAll>
      {items.map((u, i) => (
        <div key={u._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
          <div onClick={() => navigate(`/profile/${u._id}`)} style={{ width: 36, height: 36, borderRadius: "50%", background: u.avatar ? `url(${u.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", flexShrink: 0, cursor: "pointer" }}>
            {!u.avatar && "🧑‍🎓"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 800 }}>{u.name}</div>
            <div style={{ fontSize: "0.7rem", color: colors.textMuted }}>{u.department} · {u.year} Year</div>
          </div>
          <button onClick={() => handleAdd(u._id, i)} disabled={added[i] || loadingId === i}
            style={{ padding: "4px 14px", borderRadius: 20, border: `1.5px solid ${added[i] ? colors.success : colors.primary}`, background: added[i] ? colors.success : "white", color: added[i] ? "white" : colors.primary, fontFamily: "'Nunito',sans-serif", fontSize: "0.75rem", fontWeight: 800, cursor: added[i] ? "default" : "pointer" }}>
            {added[i] ? "✓ Added" : loadingId === i ? "…" : "+ Add"}
          </button>
        </div>
      ))}
    </Widget>
  );
}

export default function RightPanel() {
  return (
    <aside style={{ position: "sticky", top: 58, height: "calc(100vh - 58px)", overflowY: "auto", padding: "20px 14px 20px 6px", display: "flex", flexDirection: "column", gap: 14 }}>
      <NoticesWidget />
      <EventsWidget />
      <TrendingWidget />
      <PeopleWidget />
    </aside>
  );
}