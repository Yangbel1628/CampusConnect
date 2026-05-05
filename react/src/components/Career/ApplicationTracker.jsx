import { colors } from "../../styles/theme";

const dotStyle = {
  done:     { background: colors.success, borderColor: colors.success, color: "white" },
  active:   { background: colors.primary, borderColor: colors.primary, color: "white", boxShadow: "0 0 0 4px rgba(79,110,247,0.15)" },
  rejected: { background: colors.accent, borderColor: colors.accent, color: "white" },
  pending:  { background: "white", borderColor: colors.border, color: colors.textMuted },
};

const labelStyle = {
  done:    { color: colors.success },
  active:  { color: colors.primary, fontWeight: 900 },
  rejected:{ color: colors.accent },
  pending: { color: colors.textMuted },
};

export default function ApplicationTracker({ app }) {
  return (
    <div style={{
      background: "white", borderRadius: 16, border: `1px solid ${colors.border}`,
      boxShadow: "0 2px 16px rgba(79,110,247,0.08)",
      overflow: "hidden", opacity: app.opacity || 1,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderBottom: `1px solid ${colors.border}` }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, border: `1px solid ${colors.border}`,
          background: "white", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem", flexShrink: 0,
        }}>{app.logo}</div>
        <div>
          <div style={{ fontSize: "0.95rem", fontWeight: 900 }}>{app.title}</div>
          <div style={{ fontSize: "0.78rem", color: colors.textMuted, marginTop: 2 }}>{app.company}</div>
        </div>
        <span style={{
          marginLeft: "auto", padding: "5px 14px", borderRadius: 20,
          fontSize: "0.72rem", fontWeight: 900, whiteSpace: "nowrap", ...app.statusStyle,
        }}>{app.statusLabel}</span>
      </div>

      {/* Pipeline */}
      <div style={{ padding: "14px 16px" }}>
        {/* Dots + lines */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          {app.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < app.steps.length - 1 ? 1 : "none" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 900,
                border: "2px solid", position: "relative", zIndex: 1,
                transition: "all 0.2s", flexShrink: 0,
                ...dotStyle[step.state],
              }}>
                {step.state === "done" ? "✓" : step.state === "rejected" ? "✗" : i + 1}
              </div>
              {i < app.steps.length - 1 && (
                <div style={{
                  flex: 1, height: 2, marginBottom: 0,
                  background: step.state === "done" ? colors.success : colors.border,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Labels */}
        <div style={{ display: "flex" }}>
          {app.steps.map((step, i) => (
            <div key={i} style={{ flex: i < app.steps.length - 1 ? 1 : "none", textAlign: "center" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, ...labelStyle[step.state] }}>{step.label}</div>
            </div>
          ))}
        </div>

        {/* Meta */}
        <div style={{ display: "flex", gap: 16, fontSize: "0.75rem", color: colors.textMuted, fontWeight: 700, marginTop: 10, flexWrap: "wrap" }}>
          {app.meta.map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>
    </div>
  );
}
