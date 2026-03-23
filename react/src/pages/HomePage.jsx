import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import RightPanel from "../ImageGrid, CommentSection/RightPanel/RightPanel"
import StoryBar from "../components/Stories/StoryBar";
import FeedToggle from "../components/Feed/FeedToggle";
import CreatePost from "../components/Feed/CreatePost";
import PostCard from "../components/Post/PostCard";
import NotifDropdown from "../ImageGrid, CommentSection/Modals/NotifDropdown";
import PostModal from "../ImageGrid, CommentSection/Modals/PostModal";
import { posts } from "../data/mockData";

export default function HomePage() {
  const [showNotif, setShowNotif] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeFeed, setActiveFeed] = useState(0);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#f0f2fc", color: "#1a1d2e", minHeight: "100vh" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,600;1,400&display=swap"
        rel="stylesheet"
      />

      <Navbar
        onNotifClick={() => setShowNotif(!showNotif)}
        onAvatarClick={() => {}}
      />

      {showNotif && <NotifDropdown />}
      {showModal && <PostModal onClose={() => setShowModal(false)} />}

      <div style={{
        display: "grid",
        gridTemplateColumns: "255px 1fr 280px",
        paddingTop: 58,
        minHeight: "100vh",
      }}>
        <Sidebar />

        <main style={{ padding: "20px", maxWidth: 680, margin: "0 auto", width: "100%" }}>
          <FeedToggle active={activeFeed} onChange={setActiveFeed} />
          <StoryBar />
          <CreatePost onOpenModal={() => setShowModal(true)} />
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>

        <RightPanel />
      </div>
    </div>
  );
}
