import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/authContext";
import { storyAPI } from "../../api/services";
import { colors } from "../../styles/theme";

// ─── Story Viewer Modal ───────────────────────────────────────────────────────
function StoryViewer({ stories, startIndex, onClose }) {
  const [current, setCurrent]   = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const intervalRef             = useRef(null);
  const DURATION                = 5000; // 5 seconds per story

  const story = stories[current];

  const goNext = () => {
    if (current < stories.length - 1) {
      setCurrent((c) => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      setProgress(0);
    }
  };

  // Auto-advance progress bar
  useEffect(() => {
    setProgress(0);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(intervalRef.current); goNext(); return 100; }
        return p + (100 / (DURATION / 100));
      });
    }, 100);
    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // Mark as viewed
  useEffect(() => {
    if (story?._id) storyAPI.viewStory(story._id).catch(() => {});
  }, [story?._id]);

  if (!story) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: 380, maxWidth: "100vw", height: 680, maxHeight: "95vh", borderRadius: 20, overflow: "hidden", background: "#1a1a2e" }}
      >
        {/* Progress bars */}
        <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", gap: 4, zIndex: 10 }}>
          {stories.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.3)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 2,
                background: "white",
                width: i < current ? "100%" : i === current ? `${progress}%` : "0%",
                transition: i === current ? "none" : "none",
              }} />
            </div>
          ))}
        </div>

        {/* Author header */}
        <div style={{ position: "absolute", top: 24, left: 12, right: 50, display: "flex", alignItems: "center", gap: 10, zIndex: 10, paddingTop: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: story.author?.avatar ? `url(${story.author.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", border: "2px solid white", overflow: "hidden" }}>
            {!story.author?.avatar && "🧑‍🎓"}
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: "0.88rem" }}>{story.author?.name}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.68rem" }}>
              {timeAgo(story.createdAt)} · 👁 {story.views?.length || 0}
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 32, right: 12, zIndex: 10, background: "rgba(255,255,255,0.15)", border: "none", color: "white", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem" }}
        >
          ✕
        </button>

        {/* Story content */}
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {story.image ? (
            <img src={story.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{
              width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              background: story.bgColor || "linear-gradient(135deg,#4F6EF7,#7B61FF)",
              padding: 32,
            }}>
              <div style={{ color: "white", fontSize: "1.5rem", fontWeight: 800, textAlign: "center", lineHeight: 1.4, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                {story.text}
              </div>
            </div>
          )}
        </div>

        {/* Text overlay on image */}
        {story.image && story.text && (
          <div style={{ position: "absolute", bottom: 60, left: 16, right: 16, background: "rgba(0,0,0,0.6)", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: "0.95rem", fontWeight: 700, textAlign: "center" }}>
            {story.text}
          </div>
        )}

        {/* Tap zones */}
        <div onClick={goPrev} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "35%", cursor: "pointer", zIndex: 5 }} />
        <div onClick={goNext} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "35%", cursor: "pointer", zIndex: 5 }} />
      </div>
    </div>
  );
}

// ─── Create Story Modal ───────────────────────────────────────────────────────
const BG_OPTIONS = [
  "linear-gradient(135deg,#4F6EF7,#7B61FF)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  "linear-gradient(135deg,#fda085,#f6d365)",
  "linear-gradient(135deg,#667eea,#764ba2)",
];

function CreateStoryModal({ onClose, onCreated }) {
  const [tab, setTab]         = useState("text");   // "text" | "image"
  const [text, setText]       = useState("");
  const [bgColor, setBgColor] = useState(BG_OPTIONS[0]);
  const [imageFile, setFile]  = useState(null);
  const [imagePreview, setPrev] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const fileRef               = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    setPrev(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (tab === "text" && !text.trim()) { setError("Please write something"); return; }
    if (tab === "image" && !imageFile)  { setError("Please select an image"); return; }
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      if (tab === "text") { fd.append("text", text.trim()); fd.append("bgColor", bgColor); }
      if (tab === "image") { fd.append("image", imageFile); if (text.trim()) fd.append("text", text.trim()); }
      const { data } = await storyAPI.createStory(fd);
      onCreated(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(26,29,46,0.6)", backdropFilter: "blur(4px)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div style={{ background: "white", borderRadius: 20, width: 460, maxWidth: "95vw", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 900, fontSize: "1rem" }}>✨ Create Story</div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: colors.bg, cursor: "pointer" }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${colors.border}` }}>
          {[["text", "✍️ Text"], ["image", "🖼️ Photo"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{ flex: 1, padding: "12px", border: "none", borderBottom: `3px solid ${tab === key ? colors.primary : "transparent"}`, background: "transparent", fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem", fontWeight: 800, color: tab === key ? colors.primary : colors.textMuted, cursor: "pointer" }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ padding: 20 }}>
          {error && (
            <div style={{ background: "#FEE2E2", color: "#991B1B", borderRadius: 10, padding: "10px 14px", fontSize: "0.83rem", fontWeight: 700, marginBottom: 14 }}>
              ❌ {error}
            </div>
          )}

          {/* Text story */}
          {tab === "text" && (
            <>
              {/* Preview */}
              <div style={{ width: "100%", height: 200, borderRadius: 14, background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, padding: 20, boxSizing: "border-box" }}>
                <div style={{ color: "white", fontWeight: 800, fontSize: "1.1rem", textAlign: "center", lineHeight: 1.4, textShadow: "0 2px 8px rgba(0,0,0,0.25)", wordBreak: "break-word" }}>
                  {text || "Your story text will appear here…"}
                </div>
              </div>
              {/* Background picker */}
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                {BG_OPTIONS.map((bg, i) => (
                  <div
                    key={i}
                    onClick={() => setBgColor(bg)}
                    style={{ width: 32, height: 32, borderRadius: "50%", background: bg, cursor: "pointer", border: bgColor === bg ? `3px solid ${colors.primary}` : "3px solid transparent", transition: "border 0.15s" }}
                  />
                ))}
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={200}
                placeholder="Write your story… (max 200 characters)"
                rows={3}
                style={{ width: "100%", padding: "10px 14px", border: `2px solid ${colors.border}`, borderRadius: 10, fontFamily: "'Nunito',sans-serif", fontSize: "0.9rem", outline: "none", resize: "none", boxSizing: "border-box" }}
              />
              <div style={{ fontSize: "0.72rem", color: colors.textMuted, textAlign: "right", marginTop: 4 }}>{text.length}/200</div>
            </>
          )}

          {/* Image story */}
          {tab === "image" && (
            <>
              {imagePreview ? (
                <div style={{ position: "relative", marginBottom: 14 }}>
                  <img src={imagePreview} alt="" style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 12 }} />
                  <button onClick={() => { setFile(null); setPrev(null); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", color: "white", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: "0.8rem" }}>✕</button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{ width: "100%", height: 180, border: `2px dashed ${colors.border}`, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: 14, background: colors.bg }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>🖼️</div>
                  <div style={{ fontWeight: 700, color: colors.textMuted, fontSize: "0.88rem" }}>Click to select a photo</div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: "none" }} />
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={100}
                placeholder="Add a caption… (optional)"
                style={{ width: "100%", padding: "10px 14px", border: `2px solid ${colors.border}`, borderRadius: 10, fontFamily: "'Nunito',sans-serif", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${colors.border}`, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 22px", border: `1.5px solid ${colors.border}`, borderRadius: 20, background: "white", fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: "pointer", color: colors.textMuted }}>Cancel</button>
          <button
            onClick={handleCreate}
            disabled={loading}
            style={{ padding: "9px 24px", border: "none", borderRadius: 20, background: loading ? colors.border : colors.primary, color: "white", fontFamily: "'Nunito',sans-serif", fontWeight: 800, cursor: loading ? "default" : "pointer" }}
          >
            {loading ? "Posting…" : "✨ Share Story"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(d) {
  if (!d) return "";
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ─── Main StoryBar ────────────────────────────────────────────────────────────
export default function StoryBar() {
  const { user }                    = useAuth();
  const [stories, setStories]       = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [viewerData, setViewerData] = useState(null); // { stories, startIndex }
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    storyAPI.getStories()
      .then(({ data }) => setStories(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Group stories by author
  const grouped = stories.reduce((acc, story) => {
    const authorId = story.author?._id;
    if (!acc[authorId]) acc[authorId] = { author: story.author, stories: [] };
    acc[authorId].stories.push(story);
    return acc;
  }, {});

  const groupList = Object.values(grouped);

  const openStories = (storyList, index = 0) => {
    setViewerData({ stories: storyList, startIndex: index });
  };

  const myStories = grouped[user?._id]?.stories || [];
  const hasMyStory = myStories.length > 0;

  // Check if user has viewed all stories in a group
  const allViewed = (storyList) =>
    storyList.every((s) => s.views?.includes(user?._id));

  return (
    <>
      {showCreate && (
        <CreateStoryModal
          onClose={() => setShowCreate(false)}
          onCreated={(newStory) => {
            setStories((prev) => [newStory, ...prev]);
          }}
        />
      )}

      {viewerData && (
        <StoryViewer
          stories={viewerData.stories}
          startIndex={viewerData.startIndex}
          onClose={() => setViewerData(null)}
        />
      )}

      <div style={{
        background: "white", borderRadius: 16, padding: "14px 16px",
        border: `1px solid ${colors.border}`, marginBottom: 16,
        boxShadow: "0 2px 16px rgba(79,110,247,0.06)",
      }}>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4 }}>

          {/* Add Story button */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer" }} onClick={() => setShowCreate(true)}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: 58, height: 58, borderRadius: "50%", overflow: "hidden",
                background: user?.avatar ? `url(${user.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.3rem", border: `3px solid ${hasMyStory ? colors.primary : colors.border}`,
              }}>
                {!user?.avatar && "🧑‍🎓"}
              </div>
              <div style={{
                position: "absolute", bottom: 0, right: 0, width: 20, height: 20,
                background: colors.primary, borderRadius: "50%", border: "2px solid white",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "0.75rem", fontWeight: 900,
              }}>
                +
              </div>
            </div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: colors.text, textAlign: "center", maxWidth: 58, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {hasMyStory ? "My Story" : "Add Story"}
            </div>
          </div>

          {/* My story (if exists — click to view) */}
          {hasMyStory && (
            <div
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer" }}
              onClick={() => openStories(myStories)}
            >
              <StoryRing story={myStories[0]} viewed={false} size={58} />
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: colors.text, maxWidth: 58, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>
                View Mine
              </div>
            </div>
          )}

          {/* Skeleton loading */}
          {loading && [1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div style={{ width: 58, height: 58, borderRadius: "50%", background: colors.border }} />
              <div style={{ width: 48, height: 8, borderRadius: 4, background: colors.border }} />
            </div>
          ))}

          {/* Other users' stories */}
          {!loading && groupList
            .filter((g) => g.author?._id !== user?._id)
            .map((group) => (
              <div
                key={group.author?._id}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer" }}
                onClick={() => openStories(group.stories)}
              >
                <StoryRing story={group.stories[0]} viewed={allViewed(group.stories)} size={58} />
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: colors.text, maxWidth: 58, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>
                  {group.author?.name?.split(" ")[0]}
                </div>
              </div>
            ))}

          {/* Empty state */}
          {!loading && groupList.filter((g) => g.author?._id !== user?._id).length === 0 && (
            <div style={{ display: "flex", alignItems: "center", color: colors.textMuted, fontSize: "0.82rem", padding: "0 8px" }}>
              No stories yet — be the first! 👆
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Story ring avatar ────────────────────────────────────────────────────────
function StoryRing({ story, viewed, size }) {
  const borderColor = viewed
    ? colors.border
    : "transparent";
  const gradient = viewed
    ? "none"
    : "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)";

  return (
    <div style={{
      width: size + 6, height: size + 6, borderRadius: "50%",
      background: gradient, padding: 2,
      border: viewed ? `3px solid ${borderColor}` : "none",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: size, height: size, borderRadius: "50%", overflow: "hidden",
        background: story?.image
          ? `url(${story.image}) center/cover`
          : story?.bgColor || "linear-gradient(135deg,#4F6EF7,#7B61FF)",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "2px solid white",
        fontSize: "1.2rem",
      }}>
        {!story?.image && (story?.text ? (
          <span style={{ fontSize: "0.55rem", color: "white", fontWeight: 800, textAlign: "center", padding: 4, lineHeight: 1.2 }}>
            {story.text.slice(0, 20)}
          </span>
        ) : "🧑‍🎓")}
      </div>
    </div>
  );
}