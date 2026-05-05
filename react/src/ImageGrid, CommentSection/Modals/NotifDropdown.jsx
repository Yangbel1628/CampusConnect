import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifAPI, userAPI } from "../../api/services";
import { useSocket } from "../../context/SocketContext";
import { colors } from "../../styles/theme";

const ICON_MAP = {
  like:"❤️", comment:"💬", friend_request:"🤝", friend_accepted:"✅",
  new_notice:"📢", event_reminder:"🎉", new_job:"💼",
  application_update:"📋", mention:"📣",
};
const BG_MAP = {
  like:"#FCE7F3", comment:"#FCE7F3", friend_request:"#D1FAE5",
  friend_accepted:"#D1FAE5", new_notice:"#FFF3CD", event_reminder:"#D1FAE5",
  new_job:"#EDE9FE", application_update:"#DBEAFE", mention:"#EEF1FE",
};

function timeAgo(d) {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60)    return "just now";
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function NotifDropdown({ onClose }) {
  const { notifications: socketNotifs, resetNotifCount } = useSocket();
  const navigate    = useNavigate();
  const [notifs, setNotifs]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [responding, setResponding] = useState({});

  useEffect(() => {
    notifAPI.getAll()
      .then(({ data }) => setNotifs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    resetNotifCount?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Merge real-time socket notifications
  useEffect(() => {
    if (socketNotifs?.length) {
      setNotifs((prev) => {
        const ids = new Set(prev.map((n) => n._id));
        return [...socketNotifs.filter((n) => !ids.has(n._id)), ...prev];
      });
    }
  }, [socketNotifs]);

  const markRead = async (id) => {
    await notifAPI.markRead(id).catch(() => {});
    setNotifs((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
  };

  const markAll = async () => {
    await notifAPI.markAllRead().catch(() => {});
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Accept or decline friend request — then open messages if accepted
  const handleFriendResponse = async (notif, action) => {
    const senderId = notif.sender?._id;
    if (!senderId) return;
    setResponding((p) => ({ ...p, [notif._id]: action }));
    try {
      await userAPI.respondFriendRequest(senderId, action);

      // Mark notification as read + store response state
      setNotifs((prev) =>
        prev.map((n) =>
          n._id === notif._id ? { ...n, responded: action, isRead: true } : n
        )
      );

      if (action === "accept") {
        // Small delay so backend can create the conversation first
        setTimeout(() => {
          onClose?.();
          // Navigate to messages and open conversation with this person
          navigate(`/messages?userId=${senderId}`);
        }, 400);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResponding((p) => { const cp = { ...p }; delete cp[notif._id]; return cp; });
    }
  };

  const handleClick = (notif) => {
    markRead(notif._id);
    // Don't navigate on friend_request clicks (buttons handle that)
    if (notif.type === "friend_request") return;
    if (notif.type === "friend_accepted") {
      onClose?.();
      navigate("/messages");
      return;
    }
    if (notif.link) {
      navigate(notif.link);
      onClose?.();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 299 }} />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 66, right: 80, width: 370,
        background: "white", borderRadius: 16, border: `1px solid ${colors.border}`,
        boxShadow: "0 6px 28px rgba(79,110,247,0.13)", zIndex: 300,
        maxHeight: "82vh", overflowY: "auto",
      }}>
        {/* Header */}
        <div style={{
          padding: "14px 16px", borderBottom: `1px solid ${colors.border}`,
          fontWeight: 900, fontSize: "0.95rem", display: "flex",
          justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, background: "white", zIndex: 1,
        }}>
          Notifications
          <span onClick={markAll} style={{ fontSize: "0.75rem", color: colors.primary, fontWeight: 700, cursor: "pointer" }}>
            Mark all read
          </span>
        </div>

        {loading && (
          <div style={{ padding: 24, textAlign: "center", color: colors.textMuted, fontSize: "0.85rem" }}>Loading…</div>
        )}

        {!loading && notifs.length === 0 && (
          <div style={{ padding: 32, textAlign: "center", color: colors.textMuted }}>
            <div style={{ fontSize: "2rem", marginBottom: 8 }}>🔔</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>All caught up!</div>
          </div>
        )}

        {notifs.map((n, i) => (
          <div
            key={n._id}
            onClick={() => handleClick(n)}
            style={{
              padding: "12px 16px", cursor: "pointer",
              borderBottom: i < notifs.length - 1 ? `1px solid ${colors.border}` : "none",
              background: !n.isRead ? colors.primaryLight : "white",
              transition: "background 0.15s",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              {/* Avatar / icon */}
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: BG_MAP[n.type] || colors.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem", flexShrink: 0, overflow: "hidden",
              }}>
                {n.sender?.avatar
                  ? <img src={n.sender.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  : ICON_MAP[n.type] || "🔔"}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.4, color: colors.text }}>
                  {n.message}
                </div>
                <div style={{ fontSize: "0.7rem", color: colors.textMuted, marginTop: 3 }}>
                  {timeAgo(n.createdAt)}
                </div>

                {/* ── Friend request buttons ── */}
                {n.type === "friend_request" && !n.responded && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleFriendResponse(n, "accept")}
                      disabled={!!responding[n._id]}
                      style={{
                        padding: "6px 18px", borderRadius: 20, border: "none",
                        background: responding[n._id] === "accept" ? colors.border : colors.success,
                        color: "white", fontFamily: "'Nunito',sans-serif",
                        fontSize: "0.78rem", fontWeight: 800, cursor: "pointer",
                      }}
                    >
                      {responding[n._id] === "accept" ? "Accepting…" : "✓ Accept"}
                    </button>
                    <button
                      onClick={() => handleFriendResponse(n, "decline")}
                      disabled={!!responding[n._id]}
                      style={{
                        padding: "6px 16px", borderRadius: 20,
                        border: `1.5px solid ${colors.border}`, background: "white",
                        color: colors.textMuted, fontFamily: "'Nunito',sans-serif",
                        fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                      }}
                    >
                      {responding[n._id] === "decline" ? "…" : "✕ Decline"}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/profile/${n.sender?._id}`); onClose?.(); }}
                      style={{
                        padding: "6px 14px", borderRadius: 20,
                        border: `1.5px solid ${colors.border}`, background: "white",
                        color: colors.textMuted, fontFamily: "'Nunito',sans-serif",
                        fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                      }}
                    >
                      👤 Profile
                    </button>
                  </div>
                )}

                {/* Accepted / declined label */}
                {n.type === "friend_request" && n.responded && (
                  <div style={{
                    marginTop: 6, fontSize: "0.75rem", fontWeight: 700,
                    color: n.responded === "accept" ? colors.success : colors.textMuted,
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    {n.responded === "accept" ? (
                      <>✓ Accepted — <span onClick={(e) => { e.stopPropagation(); navigate(`/messages?userId=${n.sender?._id}`); onClose?.(); }} style={{ color: colors.primary, cursor: "pointer", textDecoration: "underline" }}>Open chat →</span></>
                    ) : "✕ Declined"}
                  </div>
                )}

                {/* friend_accepted — show "Message them" link */}
                {n.type === "friend_accepted" && (
                  <div
                    onClick={(e) => { e.stopPropagation(); navigate("/messages"); onClose?.(); }}
                    style={{ marginTop: 6, fontSize: "0.75rem", fontWeight: 700, color: colors.primary, cursor: "pointer" }}
                  >
                    💬 Open Messages →
                  </div>
                )}
              </div>

              {!n.isRead && (
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.primary, marginTop: 8, flexShrink: 0 }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}