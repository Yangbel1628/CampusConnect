import { useState } from "react";
import { colors } from "../../styles/theme";

const deadlineStyles = {
  urgent:  { background: "#FEE2E2", color: "#FF6B6B" },
  warning: { background: "#FEF3C7", color: "#92400E" },
  safe:    { background: "#D1FAE5", color: "#065F46" },
};

export default function JobCard({ job }) {
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(job.initialSaved || false);

  return (
    <div style={{
      background: job.featured ? "#fafbff" : "white",
      borderRadius: 16,
      border: job.featured ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
      boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
      padding: 18, marginBottom: 12, cursor: "pointer",
      position: "relative",
      transition: "box-shadow 0.2s, transform 0.1s",
    }}>
      {/* Ribbon */}
      {job.ribbon && (
        <span style={{
          position: "absolute", top: 14, right: 14,
          background: job.ribbonBg, color: "white",
          fontSize: "0.62rem", fontWeight: 900,
          padding: "3px 10px", borderRadius: 20, letterSpacing: "0.4px",
        }}>{job.ribbon}</span>
      )}

      {/* Header */}
      <div style={{ display: "flex", gap: 14, marginBottom: 12, alignItems: "flex-start" }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12, border: `1px solid ${colors.border}`,
          background: "white", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.6rem", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}>{job.logo}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "1rem", fontWeight: 900, color: colors.text, marginBottom: 3, paddingRight: 70 }}>{job.title}</div>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: colors.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
            {job.company}
            {job.verified && <span style={{ color: colors.primary, fontSize: "0.7rem" }}>✓ Verified</span>}
            {" · "}{job.location}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 12 }}>
        {job.tags.map((t, i) => (
          <span key={i} style={{ padding: "4px 12px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 800, ...t.style }}>{t.label}</span>
        ))}
      </div>

      {/* Description */}
      <div style={{ fontSize: "0.84rem", color: colors.textMuted, lineHeight: 1.55, marginBottom: 12 }}>{job.desc}</div>

      {/* Match bar */}
      {job.match && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 800, color: colors.textMuted, display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            Profile Match <span style={{ color: colors.success, fontWeight: 900 }}>{job.match}% match</span>
          </div>
          <div style={{ height: 6, background: colors.border, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ width: `${job.match}%`, height: "100%", borderRadius: 10, background: "linear-gradient(90deg,#6BCB77,#3da74a)", transition: "width 0.8s ease" }} />
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, borderTop: `1px solid ${colors.border}`, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", fontWeight: 800, padding: "4px 12px", borderRadius: 20, ...deadlineStyles[job.deadline.type] }}>
          {job.deadline.label}
        </span>
        <span style={{ fontSize: "0.75rem", color: colors.textMuted, fontWeight: 700 }}>{job.applicants}</span>
        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          <button
            onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
            style={{
              width: 34, height: 34, borderRadius: "50%",
              border: `1.5px solid ${saved ? "#FFD93D" : colors.border}`,
              background: saved ? "#fffbeb" : "white",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.9rem", color: saved ? "#FFD93D" : colors.textMuted,
            }}
          >🔖</button>
          <button
            onClick={(e) => { e.stopPropagation(); setApplied(true); }}
            style={{
              padding: "8px 22px",
              background: applied ? "linear-gradient(135deg,#6BCB77,#3da74a)" : "linear-gradient(135deg,#4F6EF7,#7B61FF)",
              color: "white", border: "none", borderRadius: 20,
              fontFamily: "'Nunito', sans-serif", fontSize: "0.82rem", fontWeight: 900,
              cursor: applied ? "default" : "pointer",
            }}
          >{applied ? "✓ Applied" : "Apply Now →"}</button>
        </div>
      </div>
    </div>
  );
}
