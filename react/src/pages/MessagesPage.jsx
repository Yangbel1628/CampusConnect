/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import NotifDropdown from "../ImageGrid, CommentSection/Modals/NotifDropdown";   // ← FIXED import path
import { messageAPI, userAPI } from "../api/services";
import { useAuth } from "../context/authContext";
import { useSocket } from "../context/SocketContext";
import { colors } from "../styles/theme";

// ─── Pure helpers ─────────────────────────────────────────────────────────────
function timeAgo(d) {
  if (!d) return "";
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60)    return "just now";
  if (s < 3600)  return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function fullTime(d) {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ user, size = 36, online = false }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: user?.avatar ? `url(${user.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.38, border: "2px solid white", overflow: "hidden",
      }}>
        {!user?.avatar && "🧑‍🎓"}
      </div>
      {online && (
        <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, background: colors.success, borderRadius: "50%", border: "2px solid white" }} />
      )}
    </div>
  );
}

// ─── Conversation list item ───────────────────────────────────────────────────
function ConvItem({ conv, otherUser, isActive, onlineUsers, onClick }) {
  const isOnline = onlineUsers?.includes(otherUser?._id);
  const lastMsg  = conv.lastMessage;
  const unread   = lastMsg && !lastMsg?.isRead && (lastMsg?.sender?._id || lastMsg?.sender) !== otherUser?._id;

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px", cursor: "pointer",
        background: isActive ? colors.primaryLight : "transparent",
        borderLeft: isActive ? `3px solid ${colors.primary}` : "3px solid transparent",
        transition: "all 0.15s",
      }}
    >
      <Avatar user={otherUser} size={44} online={isOnline} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: "0.9rem", color: colors.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
            {otherUser?.name || "Unknown"}
          </div>
          <div style={{ fontSize: "0.68rem", color: colors.textMuted, flexShrink: 0 }}>
            {timeAgo(conv.updatedAt)}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
          <div style={{ fontSize: "0.78rem", color: unread ? colors.text : colors.textMuted, fontWeight: unread ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
            {lastMsg?.text || "Start a conversation 👋"}
          </div>
          {unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.primary, flexShrink: 0 }} />}
        </div>
        <div style={{ fontSize: "0.68rem", color: isOnline ? colors.success : colors.textMuted, marginTop: 2 }}>
          {isOnline ? "● Online" : "● Offline"}
        </div>
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isMine, showAvatar, otherUser }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", justifyContent: isMine ? "flex-end" : "flex-start", marginBottom: 4 }}>
      {!isMine && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: otherUser?.avatar ? `url(${otherUser.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.8rem", flexShrink: 0, opacity: showAvatar ? 1 : 0, overflow: "hidden",
        }}>
          {!otherUser?.avatar && "🧑‍🎓"}
        </div>
      )}
      <div style={{ maxWidth: "68%", display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start" }}>
        <div style={{
          background: isMine ? "linear-gradient(135deg,#4F6EF7,#7B61FF)" : "white",
          color: isMine ? "white" : colors.text,
          padding: "10px 14px",
          borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          fontSize: "0.88rem", lineHeight: 1.45,
          boxShadow: isMine ? "0 2px 8px rgba(79,110,247,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
          border: isMine ? "none" : `1px solid ${colors.border}`,
          wordBreak: "break-word",
        }}>
          {msg.image && <img src={msg.image} alt="" style={{ maxWidth: "100%", borderRadius: 8, marginBottom: msg.text ? 8 : 0, display: "block" }} />}
          {msg.document && (
            <a href={msg.document.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, color: isMine ? "rgba(255,255,255,0.9)" : colors.primary, textDecoration: "none", fontSize: "0.82rem", marginBottom: msg.text ? 8 : 0 }}>
              📎 {msg.document.name}
            </a>
          )}
          {msg.text}
        </div>
        <div style={{ fontSize: "0.65rem", color: colors.textMuted, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
          {fullTime(msg.createdAt)}
          {isMine && <span style={{ color: msg.isRead ? colors.primary : colors.textMuted, fontWeight: 700 }}>{msg.isRead ? "✓✓" : "✓"}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── New conversation modal ───────────────────────────────────────────────────
function NewConvModal({ onClose, onSelect }) {
  const [search, setSearch]   = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer                 = useRef(null);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(timer.current);
    if (val.length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    timer.current = setTimeout(() => {
      userAPI.searchUsers(val)
        .then(({ data }) => setResults(data))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(26,29,46,0.55)", backdropFilter: "blur(3px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div style={{ background: "white", borderRadius: 16, width: 420, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${colors.border}`, fontWeight: 900, fontSize: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          New Message
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: colors.bg, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: 16, maxHeight: "60vh", overflowY: "auto" }}>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: colors.textMuted }}>🔍</span>
            <input
              autoFocus value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search students by name or department…"
              style={{ width: "100%", padding: "10px 14px 10px 36px", border: `2px solid ${colors.border}`, borderRadius: 30, fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {loading && <div style={{ textAlign: "center", padding: 20, color: colors.textMuted, fontSize: "0.85rem" }}>Searching…</div>}
          {!loading && search.length >= 2 && results.length === 0 && <div style={{ textAlign: "center", padding: 20, color: colors.textMuted, fontSize: "0.85rem" }}>No users found</div>}
          {search.length < 2 && <div style={{ textAlign: "center", padding: "20px 0", color: colors.textMuted, fontSize: "0.85rem" }}>Type at least 2 characters</div>}

          {results.map((u) => (
            <div
              key={u._id}
              onClick={() => { onSelect(u); onClose(); }}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", cursor: "pointer", borderRadius: 10 }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.bg}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: u.avatar ? `url(${u.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0, overflow: "hidden" }}>
                {!u.avatar && "🧑‍🎓"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>{u.name}</div>
                <div style={{ fontSize: "0.75rem", color: colors.textMuted }}>{u.department} · {u.year} Year</div>
              </div>
              <div style={{ background: colors.primaryLight, color: colors.primary, padding: "4px 14px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 800 }}>Message</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main MessagesPage ────────────────────────────────────────────────────────
export default function MessagesPage() {
  const { user }                                                          = useAuth();
  const { onMessage, joinConversation, leaveConversation,
          sendTyping, stopTyping, onlineUsers, socket }                   = useSocket();
  const navigate                                                          = useNavigate();
  const [searchParams]                                                    = useSearchParams();

  const [showNotif, setShowNotif]         = useState(false);
  const [showNewMsg, setShowNewMsg]       = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv]       = useState(null);
  const [otherUser, setOtherUser]         = useState(null);
  const [messages, setMessages]           = useState([]);
  const [text, setText]                   = useState("");
  const [loading, setLoading]             = useState(true);
  const [msgLoading, setMsgLoading]       = useState(false);
  const [sending, setSending]             = useState(false);
  const [isTyping, setIsTyping]           = useState(false);
  const [convSearch, setConvSearch]       = useState("");
  const [imagePreview, setImagePreview]   = useState(null);
  const [imageFile, setImageFile]         = useState(null);

  const bottomRef   = useRef(null);
  const typingTimer = useRef(null);
  const fileRef     = useRef(null);

  // ── Load conversations ────────────────────────────────────────────────────
  const loadConversations = useCallback(() => {
    setLoading(true);
    messageAPI.getConversations()
      .then(({ data }) => setConversations(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // ── Refresh conv list when a friend request is accepted ──────────────────
  useEffect(() => {
    if (!socket?.current) return;
    const s = socket.current;
    const handler = () => loadConversations();
    s.on("friend_accepted", handler);
    return () => s.off("friend_accepted", handler);
  }, [socket, loadConversations]);

  // ── Open a conversation ───────────────────────────────────────────────────
  const openConversation = useCallback(async (conv, other) => {
    if (activeConv?._id) leaveConversation?.(activeConv._id);
    setActiveConv(conv);
    setOtherUser(other);
    setMessages([]);

    if (!conv._id) { setMsgLoading(false); return; }   // draft mode

    setMsgLoading(true);
    joinConversation?.(conv._id);
    try {
      const { data } = await messageAPI.getMessages(conv._id);
      setMessages(data);
      messageAPI.markRead(conv._id).catch(() => {});
    } catch (err) {
      console.error(err);
    } finally {
      setMsgLoading(false);
    }
  }, [activeConv, joinConversation, leaveConversation]);

  // ── Select a user to chat (from search or ?userId= param) ────────────────
  const handleSelectUser = useCallback((selectedUser) => {
    const existing = conversations.find((c) =>
      c.participants?.some((p) => (p._id || p) === selectedUser._id)
    );
    if (existing) {
      const other = existing.participants?.find((p) => (p._id || p) !== user?._id);
      openConversation(existing, other || selectedUser);
    } else {
      // Draft — no conv id yet, create on first send
      setActiveConv({ _id: null, participants: [user, selectedUser], isNew: true });
      setOtherUser(selectedUser);
      setMessages([]);
    }
  }, [conversations, user, openConversation]);

  // ── Auto-open from ?userId= URL param ────────────────────────────────────
  useEffect(() => {
    const targetId = searchParams.get("userId");
    if (!targetId || !user || loading) return;

    const existing = conversations.find((c) =>
      c.participants?.some((p) => (p._id || p) === targetId)
    );
    if (existing) {
      const other = existing.participants?.find((p) => (p._id || p) !== user?._id);
      openConversation(existing, other);
    } else {
      userAPI.getProfile(targetId)
        .then(({ data }) => handleSelectUser(data))
        .catch(() => {});
    }
  }, [searchParams, user, loading, conversations.length]);

  // ── Real-time incoming messages ───────────────────────────────────────────
  useEffect(() => {
    const unsub = onMessage?.((msg) => {
      const convId = msg.conversation?._id || msg.conversation;
      if (convId === activeConv?._id) {
        setMessages((prev) => {
          if (prev.find((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
        messageAPI.markRead(activeConv._id).catch(() => {});
      }
      setConversations((prev) =>
        prev.map((c) => c._id === convId ? { ...c, lastMessage: msg, updatedAt: msg.createdAt } : c)
      );
    });
    return () => unsub?.();
  }, [onMessage, activeConv]);

  // ── Typing indicator ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket?.current) return;
    const s = socket.current;
    const on  = ({ userId: uid }) => { if (uid !== user?._id) setIsTyping(true); };
    const off = ({ userId: uid }) => { if (uid !== user?._id) setIsTyping(false); };
    s.on("user_typing",      on);
    s.on("user_stop_typing", off);
    return () => { s.off("user_typing", on); s.off("user_stop_typing", off); };
  }, [socket, user]);

  // ── Scroll to bottom ──────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!text.trim() && !imageFile) return;
    if (!otherUser) return;
    setSending(true);
    stopTyping?.(activeConv?._id);
    try {
      const payload = {
        receiverId:     otherUser._id,
        text:           text.trim(),
        conversationId: activeConv?._id || undefined,
      };
      const { data: msg } = await messageAPI.sendMessage(payload);
      const convId = msg.conversation?._id || msg.conversation;

      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      setText("");
      setImageFile(null);
      setImagePreview(null);

      // Update sidebar conv preview
      setConversations((prev) => {
        const exists = prev.find((c) => c._id === convId);
        if (exists) {
          return prev.map((c) => c._id === convId ? { ...c, lastMessage: msg, updatedAt: msg.createdAt } : c);
        }
        // Brand new conversation — reload list
        messageAPI.getConversations().then(({ data }) => setConversations(data)).catch(() => {});
        return prev;
      });

      // If draft, now we have a real conv id
      if (!activeConv?._id && convId) {
        setActiveConv((prev) => ({ ...prev, _id: convId }));
        joinConversation?.(convId);
        setTimeout(() => loadConversations(), 600);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTypingInput = (e) => {
    setText(e.target.value);
    if (activeConv?._id) {
      sendTyping?.(activeConv._id);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => stopTyping?.(activeConv._id), 2000);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const filteredConvs = conversations.filter((c) => {
    if (!convSearch) return true;
    const other = c.participants?.find((p) => (p._id || p) !== user?._id);
    return other?.name?.toLowerCase().includes(convSearch.toLowerCase());
  });

  const groupedMessages = messages.reduce((acc, msg) => {
    const date = new Date(msg.createdAt).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", background: colors.bg, color: colors.text, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <Navbar onNotifClick={() => setShowNotif(!showNotif)} />
      {showNotif && <NotifDropdown onClose={() => setShowNotif(false)} />}
      {showNewMsg && <NewConvModal onClose={() => setShowNewMsg(false)} onSelect={handleSelectUser} />}

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", flex: 1, overflow: "hidden", marginTop: 58 }}>

        {/* ── Sidebar ── */}
        <div style={{ background: "white", borderRight: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 14px 10px", borderBottom: `1px solid ${colors.border}`, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: "1rem", fontWeight: 900 }}>💬 Messages</div>
              <button
                onClick={() => setShowNewMsg(true)}
                title="New message"
                style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: colors.primary, color: "white", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                ✏️
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: colors.textMuted, fontSize: "0.85rem" }}>🔍</span>
              <input
                value={convSearch}
                onChange={(e) => setConvSearch(e.target.value)}
                placeholder="Search conversations…"
                style={{ width: "100%", padding: "8px 12px 8px 32px", border: `1.5px solid ${colors.border}`, borderRadius: 20, fontFamily: "'Nunito',sans-serif", fontSize: "0.82rem", outline: "none", background: colors.bg, boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading && <div style={{ padding: 24, textAlign: "center", color: colors.textMuted, fontSize: "0.85rem" }}>Loading…</div>}
            {!loading && filteredConvs.length === 0 && (
              <div style={{ padding: 32, textAlign: "center", color: colors.textMuted }}>
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>💬</div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 8 }}>
                  {convSearch ? "No results" : "No conversations yet"}
                </div>
                {!convSearch && (
                  <button onClick={() => setShowNewMsg(true)} style={{ padding: "7px 18px", background: colors.primary, color: "white", border: "none", borderRadius: 20, fontFamily: "'Nunito',sans-serif", fontSize: "0.8rem", fontWeight: 800, cursor: "pointer" }}>
                    Start a chat
                  </button>
                )}
              </div>
            )}
            {filteredConvs.map((conv) => {
              const other = conv.participants?.find((p) => (p._id || p) !== user?._id);
              return (
                <ConvItem
                  key={conv._id}
                  conv={conv}
                  otherUser={other}
                  isActive={activeConv?._id === conv._id}
                  onlineUsers={onlineUsers || []}
                  onClick={() => openConversation(conv, other)}
                />
              );
            })}
          </div>
        </div>

        {/* ── Chat panel ── */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", background: colors.bg }}>
          {!otherUser ? (
            /* Empty state */
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: colors.textMuted }}>
              <div style={{ fontSize: "4rem", marginBottom: 16 }}>💬</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8, color: colors.text }}>Your Messages</div>
              <div style={{ fontSize: "0.88rem", marginBottom: 20 }}>Private chats with friends and classmates</div>
              <button onClick={() => setShowNewMsg(true)} style={{ padding: "10px 28px", background: colors.primary, color: "white", border: "none", borderRadius: 20, fontFamily: "'Nunito',sans-serif", fontSize: "0.9rem", fontWeight: 800, cursor: "pointer" }}>
                ✏️ New Conversation
              </button>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ background: "white", padding: "12px 20px", borderBottom: `1px solid ${colors.border}`, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", flexShrink: 0 }}>
                <button
                  onClick={() => { setActiveConv(null); setOtherUser(null); setMessages([]); }}
                  style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: colors.bg, cursor: "pointer", fontSize: "1rem", color: colors.textMuted }}
                >
                  ←
                </button>
                <Avatar user={otherUser} size={42} online={onlineUsers?.includes(otherUser?._id)} />
                <div style={{ flex: 1 }}>
                  <div
                    onClick={() => otherUser?._id && navigate(`/profile/${otherUser._id}`)}
                    style={{ fontWeight: 900, fontSize: "0.95rem", cursor: "pointer" }}
                  >
                    {otherUser?.name}
                  </div>
                  <div style={{ fontSize: "0.73rem", color: onlineUsers?.includes(otherUser?._id) ? colors.success : colors.textMuted, fontWeight: 600 }}>
                    {onlineUsers?.includes(otherUser?._id) ? "● Online now" : "● Offline"}
                    {otherUser?.department && ` · ${otherUser.department}`}
                  </div>
                </div>
                <button
                  onClick={() => otherUser?._id && navigate(`/profile/${otherUser._id}`)}
                  style={{ padding: "6px 14px", border: `1.5px solid ${colors.border}`, borderRadius: 20, background: "white", fontFamily: "'Nunito',sans-serif", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", color: colors.textMuted }}
                >
                  👤 Profile
                </button>
              </div>

              {/* Messages area */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 2 }}>
                {msgLoading && <div style={{ textAlign: "center", padding: 20, color: colors.textMuted }}>Loading messages…</div>}

                {!msgLoading && messages.length === 0 && (
                  <div style={{ textAlign: "center", margin: "auto", color: colors.textMuted }}>
                    <div style={{ fontSize: "3rem", marginBottom: 12 }}>👋</div>
                    <div style={{ fontWeight: 800, fontSize: "1rem", color: colors.text, marginBottom: 4 }}>Say hi to {otherUser?.name?.split(" ")[0]}!</div>
                    <div style={{ fontSize: "0.85rem" }}>This is the start of your conversation</div>
                  </div>
                )}

                {Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    {/* Date separator */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 10px" }}>
                      <div style={{ flex: 1, height: 1, background: colors.border }} />
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: colors.textMuted, background: "white", padding: "3px 10px", borderRadius: 20, border: `1px solid ${colors.border}` }}>
                        {new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                      </div>
                      <div style={{ flex: 1, height: 1, background: colors.border }} />
                    </div>

                    {msgs.map((msg, i) => {
                      const isMine     = (msg.sender?._id || msg.sender) === user?._id;
                      const nextMsg    = msgs[i + 1];
                      const showAvatar = !isMine && (!nextMsg || (nextMsg.sender?._id || nextMsg.sender) !== (msg.sender?._id || msg.sender));
                      return <MessageBubble key={msg._id || i} msg={msg} isMine={isMine} showAvatar={showAvatar} otherUser={otherUser} />;
                    })}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                    <Avatar user={otherUser} size={28} />
                    <div style={{ background: "white", borderRadius: "18px 18px 18px 4px", padding: "10px 14px", border: `1px solid ${colors.border}`, display: "flex", gap: 4, alignItems: "center" }}>
                      {[0, 1, 2].map((j) => (
                        <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: colors.textMuted, animation: `bounce 1s ${j * 0.15}s infinite` }} />
                      ))}
                    </div>
                    <span style={{ fontSize: "0.72rem", color: colors.textMuted }}>{otherUser?.name?.split(" ")[0]} is typing…</span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Image preview */}
              {imagePreview && (
                <div style={{ padding: "8px 20px", background: "white", borderTop: `1px solid ${colors.border}`, flexShrink: 0 }}>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img src={imagePreview} alt="" style={{ height: 80, borderRadius: 8, objectFit: "cover" }} />
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "white", fontSize: "0.7rem", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Input bar */}
              <div style={{ background: "white", borderTop: `1px solid ${colors.border}`, padding: "12px 20px", display: "flex", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
                <label style={{ width: 36, height: 36, borderRadius: "50%", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", cursor: "pointer", flexShrink: 0, border: `1px solid ${colors.border}` }} title="Send image">
                  🖼️<input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: "none" }} />
                </label>
                <label style={{ width: 36, height: 36, borderRadius: "50%", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", cursor: "pointer", flexShrink: 0, border: `1px solid ${colors.border}` }} title="Send file">
                  📎<input type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} />
                </label>

                <textarea
                  value={text}
                  onChange={handleTypingInput}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder={`Message ${otherUser?.name?.split(" ")[0] || ""}… (Enter to send)`}
                  style={{ flex: 1, padding: "10px 16px", border: `2px solid ${colors.border}`, borderRadius: 22, fontFamily: "'Nunito',sans-serif", fontSize: "0.9rem", outline: "none", resize: "none", lineHeight: 1.4, maxHeight: 100, overflowY: "auto" }}
                  onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"; }}
                />

                <button style={{ width: 36, height: 36, borderRadius: "50%", background: colors.bg, border: `1px solid ${colors.border}`, fontSize: "1.2rem", cursor: "pointer", flexShrink: 0 }} title="Emoji">
                  😊
                </button>

                <button
                  onClick={handleSend}
                  disabled={sending || (!text.trim() && !imageFile)}
                  title="Send"
                  style={{ width: 44, height: 44, borderRadius: "50%", background: (text.trim() || imageFile) ? colors.primary : colors.border, border: "none", color: "white", fontSize: "1.2rem", cursor: (text.trim() || imageFile) ? "pointer" : "default", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
                >
                  {sending ? "⏳" : "➤"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}