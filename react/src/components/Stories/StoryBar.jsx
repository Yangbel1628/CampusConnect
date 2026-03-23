import { colors } from "../../styles/theme";
import { stories } from "../../data/mockData";

function StoryItem({ emoji, label, grad, isAdd }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 6, cursor: "pointer", flexShrink: 0,
    }}>
      <div style={{
        width: 58, height: 58, borderRadius: "50%", padding: 2.5,
        background: isAdd ? colors.border : (grad || "linear-gradient(135deg, #4F6EF7, #FF6B6B)"),
      }}>
        <div style={{
          width: "100%", height: "100%", borderRadius: "50%", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem", border: "2px solid white",
        }}>
          {emoji}
        </div>
      </div>
      <span style={{
        fontSize: "0.68rem", fontWeight: 700, color: colors.textMuted,
        maxWidth: 58, textAlign: "center", overflow: "hidden",
        textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {label}
      </span>
    </div>
  );
}

export default function StoryBar() {
  return (
    <div style={{
      display: "flex", gap: 10, overflowX: "auto",
      paddingBottom: 4, marginBottom: 16,
      scrollbarWidth: "none",
    }}>
      {stories.map((s, i) => (
        <StoryItem key={i} {...s} />
      ))}
    </div>
  );
}
