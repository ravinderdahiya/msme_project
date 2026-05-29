import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import "./NewMainMapHeader.css";
import { logoutApi } from "../../services/authService";
import { clearAuthSession } from "../../utils/authStorage";

const NAV_LINKS = [
  { key: "switch-portal", label: "Switch Portal" },
  { key: "help-desk", label: "Help Desk" },
  { key: "data-upload", label: "Data Upload System" },
];

export default function NewMainMapHeader() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.warn("Logout request failed:", error?.message || error);
    } finally {
      clearAuthSession();
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <header className="nmhdr nmhdr-dmp">
      <div className="nmhdr-dmp-left">
        <img src="/images/hepc-logo.png" alt="MSME Haryana" className="nmhdr-dmp-logo" />
        <span className="nmhdr-dmp-sep" aria-hidden />
        <div className="nmhdr-dmp-titles">
          <span className="nmhdr-dmp-title">MSME GIS Portal</span>
          <span className="nmhdr-dmp-subtitle">District Master Plan — Haryana</span>
        </div>
      </div>

      <nav className="nmhdr-dmp-nav" aria-label="Portal links">
        {NAV_LINKS.map((link, idx) => (
          <span key={link.key} className="nmhdr-dmp-nav-item">
            {idx > 0 && <span className="nmhdr-dmp-nav-sep" aria-hidden />}
            <button type="button" className="nmhdr-dmp-nav-link">
              {link.label}
            </button>
          </span>
        ))}
      </nav>

      <div className="nmhdr-dmp-right">
        <div className="nmhdr-dmp-menu-wrap" ref={menuRef}>
          <button
            type="button"
            className={`nmhdr-dmp-menu-btn${menuOpen ? " is-open" : ""}`}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu size={20} strokeWidth={2} />
            <ChevronDown size={16} strokeWidth={2} aria-hidden />
          </button>
          {menuOpen && (
            <div className="nmhdr-dmp-dropdown" role="menu">
              <button type="button" role="menuitem" className="nmhdr-dmp-dropdown-item" onClick={handleLogout}>
                <LogOut size={16} strokeWidth={2} />
                Logout
              </button>
            </div>
          )}
        </div>
        <img src="/images/HARSAC-Logo.png" alt="Government emblem" className="nmhdr-dmp-emblem" />
      </div>
    </header>
  );
}
