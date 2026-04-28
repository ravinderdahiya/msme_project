import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { 
  LayoutDashboard, 
  MapPin, 
  Factory, 
  Database, 
  FileText, 
  Users, 
  Settings,
  Menu,
  X
} from 'lucide-react';

// Props receive kar rahe hain: activeTab aur setActiveTab
const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth > 768;
  });

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setIsOpen(true);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // path ya id add ki hai taaki setActiveTab mein pass kar sakein
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'locations', name: 'Manage Locations', icon: <MapPin size={20} /> },
    { id: 'zones', name: 'Industrial Zones', icon: <Factory size={20} /> },
    { id: 'data', name: 'Infrastructure Data', icon: <Database size={20} /> },
    { id: 'reports', name: 'Reports', icon: <FileText size={20} /> },
    { id: 'users', name: 'Users', icon: <Users size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-toggle-btn" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      {/* Sidebar Container */}
      <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
        
        {/* Logo Section */}
        <div className="sidebar-logo-section">
          <img src="/har_govt.png" alt="Govt Logo" className="gov-logo" />
          {isOpen && <span className="admin-title">Admin Panel</span>}
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div
              key={item.id}
              /* Click hone par setActiveTab call hoga */
              onClick={() => {
                setActiveTab(item.id);
                if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                  setIsOpen(false);
                }
              }}
              /* Active class check karne ka logic */
              className={`nav-item ${activeTab === item.id ? 'active1' : ''}`}
            >
              <div className="nav-icon">{item.icon}</div>
              {isOpen && <span className="nav-text">{item.name}</span>}
            </div>
          ))}
        </nav>

        {/* User Profile Section (Bottom) */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <img src="/admin-avatar.jpg" alt="Admin" className="user-avatar" />
            {isOpen && (
              <div className="user-info">
                <span className="user-name">Admin</span>
                {/* <span className="user-role">Super Admin</span> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
