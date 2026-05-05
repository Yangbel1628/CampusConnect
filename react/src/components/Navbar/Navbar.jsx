import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useSocket } from "../../context/SocketContext";
import { userAPI } from "../../api/services";
import { colors } from "../../styles/theme";

function NavIconBtn({ icon, badge, badgeColor, onClick, active, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 38, height: 38, borderRadius: "50%", border: "none",
        background: active ? colors.primaryLight : "transparent",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.1rem", color: active ? colors.primary : colors.textMuted,
        position: "relative", transition: "background 0.15s",
      }}
    >
      {icon}
      {badge > 0 && (
        <span style={{
          position: "absolute", top: 3, right: 3, minWidth: 17, height: 17,
          background: badgeColor || colors.accent, borderRadius: 10,
          fontSize: "0.6rem", fontWeight: 900, color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid white", padding: "0 3px",
        }}>
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}

export default function Navbar({ onNotifClick }) {
  const { user }             = useAuth();
  const { unreadNotifCount } = useSocket();
  const navigate             = useNavigate();
  const location             = useLocation();
  const [search, setSearch]          = useState("");
  const [searchResults, setResults]  = useState([]);
  const [showSearch, setShowSearch]  = useState(false);
  const [searching, setSearching]    = useState(false);
  const searchTimer                  = useRef(null);
  const searchRef                    = useRef(null);

  // Debounced search
  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    clearTimeout(searchTimer.current);
    if (q.length < 2) { setResults([]); setShowSearch(false); setSearching(false); return; }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const { data } = await userAPI.searchUsers(q);
        setResults(data);
        setShowSearch(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goToProfile = (id) => {
    navigate(`/profile/${id}`);
    setShowSearch(false);
    setSearch("");
    setResults([]);
  };

  const clearSearch = () => {
    setSearch("");
    setResults([]);
    setShowSearch(false);
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 58,
      background: "white", borderBottom: `1px solid ${colors.border}`,
      display: "flex", alignItems: "center", padding: "0 20px", gap: 16,
      zIndex: 200, boxShadow: "0 2px 12px rgba(79,110,247,0.06)",
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        style={{ fontFamily: "'Lora',serif", fontSize: "1.35rem", fontWeight: 600, color: colors.text, whiteSpace: "nowrap", flexShrink: 0, cursor: "pointer" }}
      >
        Campus<span style={{ fontStyle: "italic", color: colors.primary }}>Connect</span>
      </div>

      {/* Search box */}
      <div ref={searchRef} style={{ flex: 1, maxWidth: 420, position: "relative" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: colors.textMuted, zIndex: 1 }}>
          {searching ? "⏳" : "🔍"}
        </span>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          onFocus={() => searchResults.length > 0 && setShowSearch(true)}
          placeholder="Search students, clubs, departments…"
          style={{
            width: "100%", padding: "9px 36px 9px 40px",
            border: `2px solid ${showSearch ? colors.primary : colors.border}`,
            borderRadius: 30, fontFamily: "'Nunito',sans-serif", fontSize: "0.88rem",
            background: colors.bg, outline: "none", boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
        />
        {/* Clear button */}
        {search && (
          <button
            onClick={clearSearch}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: colors.textMuted, fontSize: "0.85rem", padding: 2 }}
          >
            ✕
          </button>
        )}

        {/* Search results dropdown */}
        {showSearch && (
          <div style={{
            position: "absolute", top: "110%", left: 0, right: 0,
            background: "white", borderRadius: 12, border: `1px solid ${colors.border}`,
            boxShadow: "0 8px 24px rgba(79,110,247,0.12)", zIndex: 300, overflow: "hidden",
          }}>
            {searchResults.length === 0 && !searching && (
              <div style={{ padding: "16px", textAlign: "center", color: colors.textMuted, fontSize: "0.85rem" }}>
                No users found for "{search}"
              </div>
            )}
            {searchResults.map((u, i) => (
              <div
                key={u._id}
                onClick={() => goToProfile(u._id)}
                style={{
                  display: "flex", gap: 10, padding: "10px 14px", cursor: "pointer",
                  borderBottom: i < searchResults.length - 1 ? `1px solid ${colors.border}` : "none",
                  alignItems: "center", transition: "background 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.bg}
                onMouseLeave={(e) => e.currentTarget.style.background = "white"}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
                  background: u.avatar ? `url(${u.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
                }}>
                  {!u.avatar && "🧑‍🎓"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: colors.text }}>{u.name}</div>
                  <div style={{ fontSize: "0.72rem", color: colors.textMuted }}>{u.department} · {u.year} Year</div>
                </div>
                {/* Online indicator */}
                {u.isOnline && (
                  <div style={{ fontSize: "0.65rem", color: colors.success, fontWeight: 700, flexShrink: 0 }}>● Online</div>
                )}
                <div style={{ background: colors.primaryLight, color: colors.primary, padding: "3px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 800, flexShrink: 0 }}>
                  View
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
        <NavIconBtn icon="🏠"  title="Home"          active={location.pathname === "/"}         onClick={() => navigate("/")} />
        <NavIconBtn icon="📅"  title="Events"        active={location.pathname === "/events"}    onClick={() => navigate("/events")} />
        <NavIconBtn icon="💼"  title="Career"        active={location.pathname === "/career"}    onClick={() => navigate("/career")} />
        <NavIconBtn icon="📢"  title="Notices"       active={location.pathname === "/notices"}   onClick={() => navigate("/notices")} />
        <NavIconBtn icon="🔔"  title="Notifications" badge={unreadNotifCount}                    onClick={onNotifClick} />
        <NavIconBtn icon="💬"  title="Messages"      active={location.pathname === "/messages"}  onClick={() => navigate("/messages")} />

        {/* Profile avatar */}
        <div
          onClick={() => navigate("/profile")}
          title="My Profile"
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: user?.avatar ? `url(${user.avatar}) center/cover` : "linear-gradient(135deg,#4F6EF7,#7B61FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem", cursor: "pointer", border: `2px solid ${colors.border}`,
            marginLeft: 6, position: "relative", overflow: "hidden",
          }}
        >
          {!user?.avatar && "🧑‍🎓"}
          <div style={{ width: 10, height: 10, background: colors.success, borderRadius: "50%", border: "2px solid white", position: "absolute", bottom: 1, right: 1 }} />
        </div>
      </div>
    </nav>
  );
}