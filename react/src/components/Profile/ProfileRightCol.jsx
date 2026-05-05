import { colors } from "../../styles/theme";
import { profileData } from "../../data/profileData";

function Card({ children, style }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: 18,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Posts Tab ──
function PostsTab() {
  if (!profileData?.posts) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "14px 16px",
          border: `1px solid ${colors.border}`,
          boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#4F6EF7,#7B61FF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          🧑‍🎓
        </div>
        <div
          style={{
            flex: 1,
            padding: "10px 16px",
            border: `2px solid ${colors.border}`,
            borderRadius: 30,
            fontSize: "0.88rem",
            color: colors.textMuted,
            background: colors.bg,
          }}
        >
          Share something with your campus…
        </div>
      </div>

      {profileData.posts.map((post) => (
        <div
          key={post.id}
          style={{
            background: "white",
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
            boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "14px 16px" }}>
            <strong>{post.title}</strong>
            <div style={{ fontSize: "0.75rem", color: colors.textMuted }}>
              {post.time}
            </div>
          </div>

          <div
            style={{ padding: "0 16px 14px" }}
            dangerouslySetInnerHTML={{ __html: post.text }}
          />

          {post.stats?.map((s, i) => (
            <span key={i} style={{ marginRight: 10 }}>
              {s}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── About Tab ──
function TimelineItem({ title, sub, date }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <strong>{title}</strong>
      <div>{sub}</div>
      <small>{date}</small>
    </div>
  );
}

function AboutTab() {
  if (!profileData) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        {profileData.education?.map((e, i) => (
          <TimelineItem key={i} {...e} />
        ))}
      </Card>

      <Card>
        {profileData.experience?.map((e, i) => (
          <TimelineItem key={i} {...e} />
        ))}
      </Card>

      <Card>
        {profileData.interests?.map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </Card>
    </div>
  );
}

// ── Projects Tab ──
function ProjectsTab() {
  if (!profileData?.projects) return null;

  return (
    <div>
      {profileData.projects.map((p) => (
        <Card key={p.id}>
          <strong>{p.title}</strong>
          <div>{p.desc}</div>
        </Card>
      ))}
    </div>
  );
}

// ── Achievements Tab ──
function AchievementsTab() {
  if (!profileData?.achievements) return null;

  return (
    <div>
      {profileData.achievements.competitions?.map((item, i) => (
        <Card key={i}>{item.title}</Card>
      ))}
    </div>
  );
}

// ── Photos Tab ──
function PhotosTab() {
  if (!profileData?.photos) return null;

  return (
    <Card>
      {profileData.photos.map((p, i) => (
        <div key={i}>{p.emoji}</div>
      ))}
    </Card>
  );
}

// ── Friends Tab ──
function FriendsTab() {
  if (!profileData?.friends) return null;

  return (
    <Card>
      {profileData.friends.map((f, i) => (
        <div key={i}>{f.name}</div>
      ))}
    </Card>
  );
}

// ── MAIN ──
export default function ProfileRightCol({ activeTab }) {
  const panels = {
    posts: <PostsTab />,
    about: <AboutTab />,
    projects: <ProjectsTab />,
    achievements: <AchievementsTab />,
    photos: <PhotosTab />,
    friends: <FriendsTab />,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {panels[activeTab] || <div>No tab selected</div>}
    </div>
  );
}