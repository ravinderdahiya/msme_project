import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Search } from "lucide-react";
import { breadcrumbMap, ADMIN_AVATAR_SRC, handleAvatarError } from "./adminConfig";
import { clearAuthSession, getCurrentUser } from "../utils/authStorage";
import { logoutApi } from "../services/authService";
import Sidebar from "./components/Sidebar";

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
            <Sidebar displayName={displayName} displayRole={displayRole} onLogout={handleLogout} />

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
                            <ChevronDown size={16} />
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
