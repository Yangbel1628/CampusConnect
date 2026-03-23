import { useState } from "react";
import { colors } from "../../styles/theme";

// ── Tag badge ──
function PostTag({ type, label }) {
  const types = {
    notice:   { background: "#FFF3CD", color: "#856404" },
    event:    { background: "#D1FAE5", color: "#065F46" },
    academic: { background: "#DBEAFE", color: "#1E40AF" },
    social:   { background: "#FCE7F3", color: "#9D174D" },
    job:      { background: "#EDE9FE", color: "#5B21B6" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 800,
      marginLeft: 8, verticalAlign: "middle", ...types[type],
    }}>
      {label}
    </span>
  );
}

// ── Poll widget ──
function PollWidget({ poll }) {
  const [voted, setVoted] = useState(null);
  return (
    <div style={{ border: `1.5px solid ${colors.border}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
      <div style={{ fontSize: "0.88rem", fontWeight: 800, marginBottom: 12 }}>{poll.question}</div>
      {poll.options.map((opt, i) => (
        <div key={i} style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => setVoted(i)}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
            borderRadius: 8, border: `1.5px solid ${voted === i || opt.winner ? colors.primary : colors.border}`,
            background: colors.bg, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: `${opt.pct}%`,
              background: voted === i || opt.winner ? "#e0e8ff" : colors.primaryLight,
              borderRadius: 8, transition: "width 0.5s ease",
            }} />
            <span style={{ position: "relative", zIndex: 1, fontSize: "0.82rem", fontWeight: 700, flex: 1 }}>{opt.label}</span>
            <span style={{ position: "relative", zIndex: 1, fontSize: "0.78rem", fontWeight: 800, color: colors.primary }}>{opt.pct}%</span>
          </div>
        </div>
      ))}
      <div style={{ fontSize: "0.72rem", color: colors.textMuted, marginTop: 8 }}>{poll.meta}</div>
    </div>
  );
}

// ── Event attachment ──
function EventCard({ event }) {
  const [going, setGoing] = useState(false);
  return (
    <div style={{ border: `1.5px solid ${colors.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 10, cursor: "pointer" }}>
      <div style={{ background: "linear-gradient(135deg, #4F6EF7, #7B61FF)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "6px 10px", textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 900, lineHeight: 1 }}>{event.day}</div>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", opacity: 0.8 }}>{event.month}</div>
        </div>
        <div>
          <div style={{ color: "white", fontWeight: 800, fontSize: "0.95rem" }}>{event.title}</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem", marginTop: 2 }}>{event.sub}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "white" }}>
        <span style={{ fontSize: "0.8rem", color: colors.textMuted }}>
          👥 <strong>{event.going}</strong> going · {event.interested} interested
        </span>
        <button
          onClick={() => setGoing(true)}
          style={{
            padding: "6px 16px", borderRadius: 20, border: "none",
            background: going ? colors.success : colors.primary,
            color: "white", fontFamily: "'Nunito', sans-serif",
            fontSize: "0.78rem", fontWeight: 800, cursor: "pointer",
          }}
        >
          {going ? "✓ Going!" : "RSVP Now"}
        </button>
      </div>
    </div>
  );
}

// ── Job card ──
function JobCard({ job }) {
  return (
    <div style={{ border: `1.5px solid ${colors.border}`, borderRadius: 10, padding: 14, background: "#fafbff", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 44, height: 44, background: "white", borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem", border: `1px solid ${colors.border}`,
        }}>🌐</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>{job.title}</div>
          <div style={{ fontSize: "0.75rem", color: colors.textMuted }}>{job.sub}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {job.tags.map((t, i) => (
          <span key={i} style={{ background: t.bg, color: t.color, padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700 }}>
            {t.label}
          </span>
        ))}
      </div>
      <button style={{
        width: "100%", padding: 10,
        background: "linear-gradient(135deg, #4F6EF7, #7B61FF)",
        color: "white", border: "none", borderRadius: 10,
        fontFamily: "'Nunito', sans-serif", fontSize: "0.88rem", fontWeight: 800, cursor: "pointer",
      }}>
        Apply Now →
      </button>
    </div>
  );
}

// ── Image grid ──
function ImageGrid({ images }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{
        width: "100%", background: images[0].bg, height: 260,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "4rem", marginBottom: 2, cursor: "pointer",
      }}>
        {images[0].emoji}
      </div>
      {images.length > 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {images.slice(1).map((img, i) => (
            <div key={i} style={{
              height: 110, background: img.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", cursor: "pointer",
            }}>
              {img.emoji}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Comment section ──
function CommentSection({ comments }) {
  return (
    <div style={{ padding: "10px 16px 14px", background: colors.bg, borderTop: `1px solid ${colors.border}` }}>
      {comments?.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: c.avatarBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.9rem", flexShrink: 0,
          }}>
            {c.avatar}
          </div>
          <div style={{
            background: "white", borderRadius: "0 12px 12px 12px",
            padding: "8px 12px", border: `1px solid ${colors.border}`, flex: 1,
          }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800 }}>{c.author}</div>
            <div style={{ fontSize: "0.8rem", color: colors.text, marginTop: 2 }}>{c.text}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: "0.7rem", color: colors.textMuted, cursor: "pointer", fontWeight: 700 }}>👍 {c.likes}</span>
              <span style={{ fontSize: "0.7rem", color: colors.textMuted, cursor: "pointer", fontWeight: 700 }}>Reply</span>
            </div>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "linear-gradient(135deg, #4F6EF7, #7B61FF)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem",
        }}>🧑‍🎓</div>
        <input
          placeholder="Write a comment…"
          style={{
            flex: 1, padding: "8px 14px", border: `1.5px solid ${colors.border}`,
            borderRadius: 20, fontFamily: "'Nunito', sans-serif", fontSize: "0.82rem", outline: "none",
          }}
        />
        <button style={{
          width: 32, height: 32, borderRadius: "50%", background: colors.primary,
          border: "none", color: "white", fontSize: "0.9rem", cursor: "pointer",
        }}>➤</button>
      </div>
    </div>
  );
}

// ── Main PostCard ──
export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.initialLiked || false);
  const [showComments, setShowComments] = useState(false);

  const actionBtn = (label, onClick, isActive) => (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        gap: 6, padding: "8px 4px", border: "none", background: "transparent",
        fontFamily: "'Nunito', sans-serif", fontSize: "0.82rem", fontWeight: 700,
        color: isActive ? colors.primary : colors.textMuted, cursor: "pointer", borderRadius: 8,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{
      background: "white", borderRadius: 16, marginBottom: 16,
      boxShadow: "0 2px 16px rgba(79,110,247,0.08)", border: `1px solid ${colors.border}`,
      overflow: "hidden",
      borderLeft: post.isNotice ? `4px solid ${colors.warning}` : undefined,
    }}>
      {/* Notice banner */}
      {post.isNotice && (
        <div style={{
          background: "linear-gradient(135deg, #FFF3CD, #FFE69C)", padding: "10px 16px",
          display: "flex", alignItems: "center", gap: 8,
          fontSize: "0.78rem", fontWeight: 800, color: "#7c4d00",
        }}>
          📢 Official Notice — College Administration
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 10px" }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%", background: post.avatarGrad,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.2rem", flexShrink: 0,
        }}>
          {post.avatarEmoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 800, color: colors.text }}>
            {post.author}
            <PostTag type={post.tagType} label={post.tag} />
          </div>
          <div style={{ fontSize: "0.73rem", color: colors.textMuted, marginTop: 1 }}>
            {post.sub} · {post.time} · {post.audience}
          </div>
        </div>
        <button style={{
          width: 32, height: 32, borderRadius: "50%", border: "none",
          background: "transparent", cursor: "pointer", fontSize: "1rem", color: colors.textMuted,
        }}>⋯</button>
      </div>

      {/* Body */}
      <div style={{ padding: "0 16px 10px" }}>
        <div
          style={{ fontSize: "0.9rem", lineHeight: 1.6, color: colors.text, marginBottom: 10 }}
          dangerouslySetInnerHTML={{ __html: post.text }}
        />
        {post.attachment && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
            background: colors.bg, borderRadius: 8, border: `1px solid ${colors.border}`,
            fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
          }}>
            📎 {post.attachment.name}
            <span style={{ color: colors.textMuted, fontWeight: 400 }}>· {post.attachment.size}</span>
          </div>
        )}
        {post.event && <EventCard event={post.event} />}
        {post.poll && <PollWidget poll={post.poll} />}
        {post.jobCard && <JobCard job={post.jobCard} />}
      </div>

      {/* Images (outside body padding) */}
      {post.images && <ImageGrid images={post.images} />}

      {/* Stats */}
      <div style={{
        display: "flex", alignItems: "center", padding: "6px 16px",
        borderTop: `1px solid ${colors.border}`, fontSize: "0.78rem", color: colors.textMuted,
      }}>
        <span>{post.reactionEmojis}</span>&nbsp;<span>{post.reactions}</span>
        <span style={{ marginLeft: "auto" }}>{post.statsRight}</span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", borderTop: `1px solid ${colors.border}`, padding: "4px 8px" }}>
        {post.isNotice ? (
          <>
            {actionBtn("📥 Download", null, false)}
            {actionBtn(`💬 Comment (84)`, () => setShowComments(!showComments), showComments)}
            {actionBtn("🔔 Subscribe", null, false)}
          </>
        ) : (
          <>
            {actionBtn(liked ? "❤️ Loved" : "👍 Like", () => setLiked(!liked), liked)}
            {actionBtn("💬 Comment", () => setShowComments(!showComments), showComments)}
            {actionBtn("↗️ Share", null, false)}
            {actionBtn("🔖 Save", null, false)}
          </>
        )}
      </div>

      {/* Comments */}
      {showComments && <CommentSection comments={post.comments} />}
    </div>
  );
}
