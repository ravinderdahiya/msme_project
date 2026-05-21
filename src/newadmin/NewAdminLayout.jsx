import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, Search } from "lucide-react";
import { newAdminNavItems } from "./newAdminData";
import { breadcrumbMap, iconMap, ADMIN_AVATAR_SRC, handleAvatarError } from "./adminConfig";
import { clearAuthSession, getCurrentUser } from "../utils/authStorage";
import { logoutApi } from "../services/authService";

export default function NewAdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

    const currentKey = location.pathname.split("/").filter(Boolean).at(-1) || "dashboard";
    const breadcrumbs = breadcrumbMap[currentKey] || ["Dashboard"];
    const displayName = currentUser?.fullname || currentUser?.email || "Admin User";
    const displayRole = currentUser?.role || "Admin";

    useEffect(() => {
        setCurrentUser(getCurrentUser());
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.warn("Logout request failed:", error?.message || error);
        } finally {
            clearAuthSession();
            navigate("/login", { replace: true });
        }
    };

    return (
        <div className="new-admin-shell">
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
                            <NavLink
                                key={item.key}
                                to={`/newadmin/${item.key}`}
                                className={({ isActive }) =>
                                    `new-admin-nav-link${isActive ? " is-active" : ""}`
                                }
                            >
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
                        <button type="button" className="new-admin-logout-btn" onClick={handleLogout} aria-label="Logout">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            <section className="new-admin-main">
                <header className="new-admin-topbar">
                    <div>
                        <h1>{breadcrumbs[breadcrumbs.length - 1]}</h1>
                        <p>{breadcrumbs.join(" / ")}</p>
                    </div>

                    <div className="new-admin-topbar-actions">
                        <label className="new-admin-search">
                            <Search size={16} />
                            <input type="text" placeholder="Search anything..." />
                        </label>
                        <button type="button" className="new-admin-icon-btn" aria-label="Notifications">
                            <Bell size={18} />
                            <span className="new-admin-dot" />
                        </button>
                        <div className="new-admin-profile-pill">
                            <img src={ADMIN_AVATAR_SRC} alt="Admin User" onError={handleAvatarError} />
                            <div className="new-admin-profile-copy">
                                <strong>{displayName}</strong>
                                <span>{displayRole}</span>
                            </div>
                            <button type="button" className="new-admin-logout-btn" onClick={handleLogout} aria-label="Logout">
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="new-admin-content">
                    <Outlet />
                </main>
            </section>
        </div>
    );
}
