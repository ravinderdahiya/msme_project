import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { railMenu, toolsGrid } from "./config";

function RailIcon({ item }) {
  if (item.iconSrc) {
    return <img src={item.iconSrc} alt="" className="nm-rail-icon-img" />;
  }
  const Icon = item.icon;
  return Icon ? <Icon size={22} strokeWidth={1.8} aria-hidden /> : null;
}

function ToolIcon({ item }) {
  if (item.iconSrc) {
    return <img src={item.iconSrc} alt="" className="nm-tool-icon-img" />;
  }
  const Icon = item.icon;
  return Icon ? <Icon size={26} strokeWidth={1.6} aria-hidden /> : null;
}

export default function MainSidebar({
  toolSearch,
  setToolSearch,
  activeRailKey,
  setActiveRailKey,
  toolsPanelOpen = false,
  setToolsPanelOpen,
  isSidebarItemActive,
  onSidebarItemClick,
}) {
  const [internalRail, setInternalRail] = useState(null);
  const activeRail = activeRailKey ?? internalRail;
  const panelOpen = toolsPanelOpen;

  const setRail = (key) => {
    setActiveRailKey?.(key);
    if (activeRailKey === undefined) setInternalRail(key);
  };

  const activeRailItem = railMenu.find((r) => r.key === activeRail) ?? railMenu[0];

  const filteredTools = useMemo(() => {
    const q = toolSearch.trim().toLowerCase();
    if (!q) return toolsGrid;
    return toolsGrid.filter((t) => t.label.toLowerCase().includes(q));
  }, [toolSearch]);

  const handleRailClick = (item) => {
    if (item.route) {
      setRail(item.key);
      setToolsPanelOpen?.(false);
      onSidebarItemClick?.({ key: item.key, route: item.route });
      return;
    }

    if (activeRail === item.key && panelOpen) {
      setToolsPanelOpen?.(false);
      setRail(null);
      return;
    }

    setRail(item.key);
    setToolsPanelOpen?.(true);
  };

  const handleToolClick = (tool) => {
    if (tool.route) {
      onSidebarItemClick?.({ key: tool.key, route: tool.route });
      return;
    }
    onSidebarItemClick?.({ key: tool.key });
  };

  const isToolActive = (tool) => isSidebarItemActive?.({ key: tool.key, route: tool.route });

  return (
    <aside className="nm-sidebar nm-sidebar-dmp" aria-label="Map navigation">
      <nav className="nm-sidebar-rail" aria-label="Sidebar sections">
        <ul className="nm-rail-list">
          {railMenu.map((item) => {
            const railActive =
              (activeRail === item.key && panelOpen) ||
              (item.route && isSidebarItemActive?.({ key: item.key, route: item.route }));
            return (
              <li key={item.key}>
                <button
                  type="button"
                  className={`nm-rail-btn${railActive ? " active" : ""}`}
                  onClick={() => handleRailClick(item)}
                  title={item.label}
                >
                  <span className="nm-rail-icon">
                    <RailIcon item={item} />
                  </span>
                  <span className="nm-rail-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="nm-rail-brand" aria-hidden>
          <img src="/images/HARSAC-Logo.png" alt="" className="nm-rail-brand-img" />
        </div>
      </nav>

      <div className={`nm-sidebar-tools-panel${panelOpen ? " is-open" : ""}`} hidden={!panelOpen}>
        <h2 className="nm-tools-panel-title">{activeRailItem.label}</h2>

        <label className="nm-tools-search">
          <input
            type="search"
            value={toolSearch}
            onChange={(e) => setToolSearch?.(e.target.value)}
            placeholder="Search.."
            aria-label="Search tools"
          />
          <Search size={16} strokeWidth={2} aria-hidden />
        </label>

        {activeRail === "tools" || activeRail === "layers" || activeRail === "active-layers" ? (
          <div className="nm-tools-grid" role="list">
            {filteredTools.map((tool) => (
              <button
                key={tool.key}
                type="button"
                role="listitem"
                className={`nm-tool-cell${isToolActive(tool) ? " active" : ""}`}
                onClick={() => handleToolClick(tool)}
                title={tool.label}
              >
                <span className="nm-tool-icon">
                  <ToolIcon item={tool} />
                </span>
                <span className="nm-tool-label">{tool.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="nm-tools-placeholder">
            {activeRailItem.label} content will appear here. Replace icons in{" "}
            <code>config.js</code> when your assets are ready.
          </p>
        )}
      </div>
    </aside>
  );
}
