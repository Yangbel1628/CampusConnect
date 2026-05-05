import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import RightPanel from "../ImageGrid, CommentSection/RightPanel/RightPanel";
import StoryBar from "../components/Stories/StoryBar";
import FeedToggle from "../components/Feed/FeedToggle";
import CreatePost from "../components/Feed/CreatePost";
import PostCard from "../components/Post/PostCard";
import NotifDropdown from "../ImageGrid, CommentSection/Modals/NotifDropdown";
import PostModal from "../ImageGrid, CommentSection/Modals/PostModal";
import { postAPI } from "../api/services";
import { colors } from "../styles/theme";

export default function HomePage() {
  const [showNotif, setShowNotif]   = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [activeFeed, setActiveFeed] = useState(0);
  const [posts, setPosts]           = useState([]);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [hasMore, setHasMore]       = useState(true);

  const fetchFeed = useCallback(async (p = 1) => {
    try {
      setLoading(true);
      const { data } = await postAPI.getFeed(p);
      if (p === 1) setPosts(data);
      else setPosts((prev) => [...prev, ...data]);
      setHasMore(data.length === 10);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFeed(1); }, [fetchFeed]);

  return (
    <div style={{ fontFamily: "'Nunito',sans-serif", background: colors.bg, color: colors.text, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lora:ital,wght@0,600;1,400&display=swap" rel="stylesheet" />
      <Navbar onNotifClick={() => setShowNotif(!showNotif)} />
      {showNotif && <NotifDropdown onClose={() => setShowNotif(false)} />}
      {showModal && (
        <PostModal
          onClose={() => setShowModal(false)}
          onPostCreated={(p) => { setPosts((prev) => [p, ...prev]); setShowModal(false); }}
        />
      )}

      <div style={{ display: "grid", gridTemplateColumns: "255px 1fr 280px", paddingTop: 58, minHeight: "100vh" }}>
        <Sidebar />
        <main style={{ padding: "20px", maxWidth: 680, margin: "0 auto", width: "100%" }}>
          <FeedToggle active={activeFeed} onChange={setActiveFeed} />
          <StoryBar />
          <CreatePost onOpenModal={() => setShowModal(true)} />

          {/* Skeleton loaders */}
          {loading && posts.length === 0 && (
            [1, 2, 3].map((i) => (
              <div key={i} style={{ background: "white", borderRadius: 16, padding: 20, border: `1px solid ${colors.border}`, marginBottom: 16, height: 160 }}>
                {[["60%", 14], ["90%", 10], ["75%", 10]].map(([w, h], j) => (
                  <div key={j} style={{ width: w, height: h, background: colors.border, borderRadius: 8, marginBottom: 10 }} />
                ))}
              </div>
            ))
          )}

          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
            />
          ))}

          {!loading && posts.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: colors.textMuted }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>📭</div>
              <div style={{ fontWeight: 700, fontSize: "1rem" }}>No posts yet</div>
              <div style={{ fontSize: "0.85rem", marginTop: 6 }}>Be the first to post something!</div>
            </div>
          )}

          {hasMore && posts.length > 0 && (
            <button
              onClick={() => { const next = page + 1; setPage(next); fetchFeed(next); }}
              disabled={loading}
              style={{ width: "100%", padding: 12, background: "white", border: `1.5px solid ${colors.border}`, borderRadius: 12, fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem", fontWeight: 800, color: colors.primary, cursor: "pointer", marginBottom: 20 }}
            >
              {loading ? "Loading…" : "Load more posts"}
            </button>
          )}
        </main>
        <RightPanel />
      </div>
    </div>
  );
}