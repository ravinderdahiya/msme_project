import React from "react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { ADMIN_AVATAR_SRC, handleAvatarError, iconMap } from "../adminConfig";
import { newAdminNavItems } from "../newAdminData";

export default function Sidebar({ displayName, displayRole, onLogout }) {
    return (
        <aside className="new-admin-sidebar">
            <div className="new-admin-brand">
                <div className="new-admin-brand-mark">
                    <img src="/images/hepc-logo.png" alt="MSME" />
                </div>
                <div>
                    <strong>MSME</strong>
                    <span>Investor GIS</span>
                </div>
            </div>

            <nav className="new-admin-nav">
                {newAdminNavItems.map((item) => {
                    const Icon = iconMap[item.icon];
                    return (
                        <NavLink key={item.key} to={`/newadmin/${item.key}`} className={({ isActive }) => `new-admin-nav-link${isActive ? " is-active" : ""}`}>
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="new-admin-sidebar-footer">
                <div className="new-admin-user-card">
                    <img src={ADMIN_AVATAR_SRC} alt="Admin User" onError={handleAvatarError} />
                    <div className="new-admin-profile-copy">
                        <strong>{displayName}</strong>
                        <span>{displayRole}</span>
                    </div>
                    <button type="button" className="new-admin-logout-btn" onClick={onLogout} aria-label="Logout">
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
