import { ArrowRight, Menu } from "lucide-react";

export default function MainSidebar({ sidebarMenu, otherMenu, isSidebarItemActive, onSidebarItemClick }) {
  return (
    <aside className="nm-sidebar">
      <div className="nm-sidebar-brand">
        <div>
          <span className="nm-sidebar-brand-title">MENU</span>
          <p className="nm-sidebar-brand-subtitle">Map tools for land selection</p>
        </div>
        <button type="button" className="nm-sidebar-toggle" aria-label="Open menu">
          <Menu size={18} />
        </button>
      </div>

      <div className="nm-sidebar-block">
        <div className="nm-sidebar-heading">MAP TOOLS</div>
        <div className="nm-sidebar-list">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                className={`nm-sidebar-item${isSidebarItemActive(item) ? " active" : ""}`}
                onClick={() => onSidebarItemClick(item)}
              >
                <span className="nm-sidebar-icon">
                  <Icon size={18} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="nm-sidebar-block">
        <div className="nm-sidebar-heading">OTHER</div>
        <div className="nm-sidebar-list">
          {otherMenu.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.title} type="button" className="nm-sidebar-item nm-secondary-item">
                <span className="nm-sidebar-icon">
                  <Icon size={18} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* <div className="nm-sidebar-upgrade">
        <div>
          <strong>Unlock Premium Features</strong>
          <p>Get advanced analytics, more layers & detailed reports.</p>
        </div>
        <button type="button" className="nm-btn nm-btn-primary">
          Upgrade Now <ArrowRight size={16} />
        </button>
      </div> */}
    </aside>
  );
}
