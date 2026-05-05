import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { postAPI } from "../../api/services";
import { colors } from "../../styles/theme";

// ─── Pure utility — outside component to satisfy react-hooks/purity ───────────
function timeAgo(d) {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60)    return "just now";
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ─── Post type tag ────────────────────────────────────────────────────────────
function PostTag({ type }) {
  const styles = {
    notice:   { background: "#FFF3CD", color: "#856404" },
    event:    { background: "#D1FAE5", color: "#065F46" },
    academic: { background: "#DBEAFE", color: "#1E40AF" },
    social:   { background: "#FCE7F3", color: "#9D174D" },
    job:      { background: "#EDE9FE", color: "#5B21B6" },
    general:  { background: colors.bg, color: colors.textMuted },
  };
  const labels = {
    notice:   "📌 Notice",
    event:    "🎉 Event",
    academic: "📚 Academic",
    social:   "✨ Social",
    job:      "💼 Opportunity",
    general:  "💬 General",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: "0.7rem",
        fontWeight: 800,
        marginLeft: 8,
        verticalAlign: "middle",
        ...(styles[type] || styles.general),
      }}
    >
      {labels[type] || type}
    </span>
  );
}

// ─── Poll widget ──────────────────────────────────────────────────────────────
function PollWidget({ poll, postId, onPollVote }) {
  const { user } = useAuth();
  const totalVotes  = poll.options.reduce((s, o) => s + (o.votes?.length || 0), 0);
  const userVoteIdx = poll.options.findIndex((o) => o.votes?.includes(user?._id));

  return (
    <div style={{ border: `1.5px solid ${colors.border}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
      <div style={{ fontSize: "0.88rem", fontWeight: 800, marginBottom: 12 }}>{poll.question}</div>
      {poll.options.map((opt, i) => {
        const pct     = totalVotes > 0 ? Math.round(((opt.votes?.length || 0) / totalVotes) * 100) : 0;
        const isVoted = userVoteIdx === i;
        return (
          <div key={i} style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => onPollVote(postId, i)}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 8,
                border: `1.5px solid ${isVoted ? colors.primary : colors.border}`,
                background: colors.bg,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0, top: 0, bottom: 0,
                  width: `${pct}%`,
                  background: isVoted ? "#e0e8ff" : colors.primaryLight,
                  borderRadius: 8,
                  transition: "width 0.5s ease",
                }}
              />
              <span style={{ position: "relative", zIndex: 1, fontSize: "0.82rem", fontWeight: 700, flex: 1 }}>
                {opt.label}
              </span>
              <span style={{ position: "relative", zIndex: 1, fontSize: "0.78rem", fontWeight: 800, color: colors.primary }}>
                {pct}%
              </span>
            </div>
          </div>
        );
      })}
      <div style={{ fontSize: "0.72rem", color: colors.textMuted, marginTop: 8 }}>{totalVotes} votes</div>
    </div>
  );
}

// ─── Comment section ──────────────────────────────────────────────────────────
function CommentSection({ postId, initialComments }) {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [comments, setComments] = useState(initialComments || []);
  const [text, setText]         = useState("");
  const [loading, setLoading]   = useState(false);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await postAPI.addComment(postId, text);
      setComments((prev) => [...prev, data]);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "10px 16px 14px", background: colors.bg, borderTop: `1px solid ${colors.border}` }}>
      {comments.map((c, i) => (
        <div key={c._id || i} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {/* Avatar — clickable to author profile */}
          <div
            onClick={() => c.author?._id && navigate(`/profile/${c.author._id}`)}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: c.author?.avatar
                ? `url(${c.author.avatar}) center/cover`
                : "linear-gradient(135deg,#4F6EF7,#7B61FF)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.85rem", flexShrink: 0,
              cursor: c.author?._id ? "pointer" : "default",
            }}
          >
            {!c.author?.avatar && "🧑‍🎓"}
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "0 12px 12px 12px",
              padding: "8px 12px",
              border: `1px solid ${colors.border}`,
              flex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                onClick={() => c.author?._id && navigate(`/profile/${c.author._id}`)}
                style={{ fontSize: "0.78rem", fontWeight: 800, cursor: c.author?._id ? "pointer" : "default" }}
              >
                {c.author?.name || "User"}
              </span>
              <span style={{ fontSize: "0.68rem", color: colors.textMuted }}>{timeAgo(c.createdAt)}</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: colors.text, marginTop: 2 }}>{c.text}</div>
          </div>
        </div>
      ))}

      {/* Input row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        <div
          style={{
            width: 30, height: 30, borderRadius: "50%",
            background: user?.avatar
              ? `url(${user.avatar}) center/cover`
              : "linear-gradient(135deg,#4F6EF7,#7B61FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.8rem", flexShrink: 0,
          }}
        >
          {!user?.avatar && "🧑‍🎓"}
        </div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Write a comment… (Enter to post)"
          style={{
            flex: 1, padding: "8px 14px",
            border: `1.5px solid ${colors.border}`,
            borderRadius: 20,
            fontFamily: "'Nunito',sans-serif",
            fontSize: "0.82rem",
            outline: "none",
          }}
        />
        <button
          onClick={handleAdd}
          disabled={loading || !text.trim()}
          style={{
            width: 32, height: 32, borderRadius: "50%",
            background: text.trim() ? colors.primary : colors.border,
            border: "none", color: "white",
            fontSize: "0.9rem",
            cursor: text.trim() ? "pointer" : "default",
            flexShrink: 0,
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

// ─── Main PostCard ────────────────────────────────────────────────────────────
export default function PostCard({ post: initialPost, onDelete }) {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [post, setPost]                 = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu]         = useState(false);

  const isLiked  = post.likes?.includes(user?._id) ?? false;
  const isSaved  = user?.savedPosts?.includes(post._id) ?? false;
  const isAuthor = post.author?._id === user?._id;

  const goToAuthorProfile = () => {
    if (post.author?._id) navigate(`/profile/${post.author._id}`);
  };

  const handleLike = async () => {
    try {
      const { data } = await postAPI.toggleLike(post._id);
      setPost((p) => ({
        ...p,
        likes: data.liked
          ? [...(p.likes || []), user._id]
          : (p.likes || []).filter((id) => id !== user._id),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      await postAPI.toggleSave(post._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await postAPI.deletePost(post._id);
      onDelete?.(post._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePollVote = async (postId, optionIndex) => {
    try {
      const { data } = await postAPI.votePoll(postId, optionIndex);
      setPost((p) => ({ ...p, poll: data }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        marginBottom: 16,
        boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
        border: `1px solid ${colors.border}`,
        overflow: "hidden",
        borderLeft: post.type === "notice" ? `4px solid ${colors.warning}` : undefined,
      }}
    >
      {/* Notice banner */}
      {post.type === "notice" && (
        <div
          style={{
            background: "linear-gradient(135deg,#FFF3CD,#FFE69C)",
            padding: "10px 16px",
            fontSize: "0.78rem",
            fontWeight: 800,
            color: "#7c4d00",
          }}
        >
          📢 Official Notice
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 10px" }}>
        {/* Avatar — clickable */}
        <div
          onClick={goToAuthorProfile}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            background: post.author?.avatar
              ? `url(${post.author.avatar}) center/cover`
              : "linear-gradient(135deg,#4F6EF7,#7B61FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem", flexShrink: 0,
            cursor: post.author?._id ? "pointer" : "default",
            border: `2px solid ${colors.border}`,
          }}
        >
          {!post.author?.avatar && "🧑‍🎓"}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 800, color: colors.text }}>
            <span
              onClick={goToAuthorProfile}
              style={{ cursor: post.author?._id ? "pointer" : "default" }}
            >
              {post.author?.name || "Unknown"}
            </span>
            <PostTag type={post.type} />
          </div>
          <div style={{ fontSize: "0.73rem", color: colors.textMuted, marginTop: 1 }}>
            {post.author?.department && `${post.author.department} · `}
            {timeAgo(post.createdAt)} ·{" "}
            {post.audience === "everyone"
              ? "🌐 Everyone"
              : post.audience === "friends"
              ? "👥 Friends"
              : "🏫 Dept"}
          </div>
        </div>

        {/* 3-dot menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              border: "none", background: "transparent",
              cursor: "pointer", fontSize: "1.2rem", color: colors.textMuted,
            }}
          >
            ⋯
          </button>

          {showMenu && (
            <div
              style={{
                position: "absolute", right: 0, top: "100%",
                background: "white", borderRadius: 10,
                border: `1px solid ${colors.border}`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                zIndex: 10, minWidth: 160,
              }}
            >
              <div
                onClick={() => { handleSave(); setShowMenu(false); }}
                style={{ padding: "10px 14px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", color: colors.textMuted, display: "flex", gap: 8 }}
              >
                🔖 Save Post
              </div>
              <div
                onClick={() => { handleShare(); setShowMenu(false); }}
                style={{ padding: "10px 14px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", color: colors.textMuted, display: "flex", gap: 8 }}
              >
                ↗️ Share (copy link)
              </div>
              {!isAuthor && post.author?._id && (
                <div
                  onClick={() => { goToAuthorProfile(); setShowMenu(false); }}
                  style={{ padding: "10px 14px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", color: colors.textMuted, display: "flex", gap: 8 }}
                >
                  👤 View Profile
                </div>
              )}
              {isAuthor && (
                <div
                  onClick={() => { setShowMenu(false); handleDelete(); }}
                  style={{
                    padding: "10px 14px", fontSize: "0.82rem", fontWeight: 700,
                    cursor: "pointer", color: colors.accent,
                    borderTop: `1px solid ${colors.border}`,
                    display: "flex", gap: 8,
                  }}
                >
                  🗑️ Delete
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "0 16px 10px" }}>
        {post.text && (
          <div
            style={{ fontSize: "0.9rem", lineHeight: 1.6, color: colors.text, marginBottom: 10 }}
            dangerouslySetInnerHTML={{ __html: post.text }}
          />
        )}

        {/* Images */}
        {post.images?.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ width: "100%", borderRadius: 10, overflow: "hidden", maxHeight: 300 }}>
              <img src={post.images[0].url} alt="" style={{ width: "100%", objectFit: "cover" }} />
            </div>
            {post.images.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginTop: 2 }}>
                {post.images.slice(1).map((img, i) => (
                  <div key={i} style={{ height: 110, borderRadius: 8, overflow: "hidden" }}>
                    <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Documents */}
        {post.documents?.map((doc, i) => (
          <a
            key={i}
            href={doc.url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 14px", background: colors.bg,
              borderRadius: 8, border: `1px solid ${colors.border}`,
              fontSize: "0.8rem", fontWeight: 700,
              textDecoration: "none", color: colors.text, marginBottom: 8,
            }}
          >
            📎 {doc.name}
            {doc.size && <span style={{ color: colors.textMuted, fontWeight: 400 }}>· {doc.size}</span>}
          </a>
        ))}

        {/* Poll */}
        {post.poll && (
          <PollWidget poll={post.poll} postId={post._id} onPollVote={handlePollVote} />
        )}
      </div>

      {/* ── Stats row ── */}
      <div
        style={{
          display: "flex", alignItems: "center",
          padding: "6px 16px",
          borderTop: `1px solid ${colors.border}`,
          fontSize: "0.78rem", color: colors.textMuted,
        }}
      >
        <span>👍 {post.likes?.length || 0} reactions</span>
        <span
          style={{ marginLeft: "auto", cursor: "pointer" }}
          onClick={() => setShowComments(!showComments)}
        >
          💬 {post.comments?.length || 0} comments
        </span>
      </div>

      {/* ── Action buttons ── */}
      <div style={{ display: "flex", borderTop: `1px solid ${colors.border}`, padding: "4px 8px" }}>
        {[
          [isLiked ? "❤️ Loved"       : "👍 Like",  handleLike,                           isLiked],
          ["💬 Comment",                              () => setShowComments(!showComments),  showComments],
          ["↗️ Share",                                handleShare,                           false],
          [isSaved ? "🔖 Saved"       : "🔖 Save",  handleSave,                            isSaved],
        ].map(([label, fn, active]) => (
          <button
            key={label}
            onClick={fn}
            style={{
              flex: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 6, padding: "8px 4px",
              border: "none", background: "transparent",
              fontFamily: "'Nunito',sans-serif",
              fontSize: "0.82rem", fontWeight: 700,
              color: active ? colors.primary : colors.textMuted,
              cursor: "pointer", borderRadius: 8,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Comments ── */}
      {showComments && (
        <CommentSection postId={post._id} initialComments={post.comments || []} />
      )}
    </div>
  );
}