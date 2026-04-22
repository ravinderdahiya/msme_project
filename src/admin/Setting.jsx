import React, { useState } from 'react';
import { User, Lock, Settings as SystemIcon, Palette, Bell, Database, Camera, EyeOff,UserPlus,RefreshCw, FileText,  Upload, Download, } from 'lucide-react';
import './Setting.css';

const Setting = () => {
    const [activeTab, setActiveTab] = useState('Profile'); // Default set to Security for preview
    const [twoFactor, setTwoFactor] = useState(true);

    const tabs = [
        { name: 'Profile', icon: <User size={16} /> },
        { name: 'Security', icon: <Lock size={16} /> },
        { name: 'System', icon: <SystemIcon size={16} /> },
        { name: 'Appearance', icon: <Palette size={16} /> },
        { name: 'Notifications', icon: <Bell size={16} /> },
        { name: 'Data Management', icon: <Database size={16} /> },
    ];

    return (
        <div className="settings-wrapper">
            <div className="settings-header-top">
                <h1>Settings</h1>
            </div>

            <div className="settings-tabs-nav">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        className={`tab-btn ${activeTab === tab.name ? 'active1' : ''}`}
                        onClick={() => setActiveTab(tab.name)}
                    >
                        {tab.icon} {tab.name}
                    </button>
                ))}
            </div>

            <div className="settings-card-body">
                {/* Profile Tab */}
                {activeTab === 'Profile' && (
                    <div className="settings-inner">
                        <h3>Profile Settings</h3>
                        <p className="sub-label">Update your personal information and profile details</p>

                        <div className="profile-section">
                            <div className="avatar-box">
                                <div className="circle-img">
                                    <User size={40} color="#64748b" />
                                </div>
                                <button className="upload-btn"><Camera size={14} /> Change Photo</button>
                                <span>JPG, PNG or GIF. Max size 2MB</span>
                            </div>

                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <input type="text" defaultValue="Anil Kumar" />
                                </div>
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <input type="email" defaultValue="anil.kumar@example.com" />
                                </div>
                                <div className="input-group">
                                    <label>Phone Number</label>
                                    <input type="text" defaultValue="+91 9876543210" />
                                </div>
                                <div className="input-group">
                                    <label>Role</label>
                                    <select><option>Administrator</option></select>
                                </div>
                            </div>
                        </div>
                        <div className="btn-container"><button className="primary-btn">Update Profile</button></div>
                    </div>
                )}

                {/* Security Tab - Updated as per Screenshot */}
                {activeTab === 'Security' && (
                    <div className="security-section-wrapper">
                        <div className="security-content-header">
                            <h3>Security Settings</h3>
                            <p className="sub-label">Manage your password and account security</p>
                        </div>

                        <div className="security-form-container">
                            <div className="security-input-row">
                                <label>Current Password</label>
                                <div className="password-field">
                                    <input type="password" placeholder="**********" />
                                    <EyeOff size={18} className="eye-icon" />
                                </div>
                            </div>

                            <div className="security-input-row">
                                <label>New Password</label>
                                <div className="password-field">
                                    <input type="password" placeholder="**********" />
                                    <EyeOff size={18} className="eye-icon" />
                                </div>
                            </div>

                            <div className="security-input-row">
                                <label>Confirm New Password</label>
                                <div className="password-field">
                                    <input type="password" placeholder="**********" />
                                    <EyeOff size={18} className="eye-icon" />
                                </div>
                            </div>

                            <div className="two-factor-auth">
                                <div className="auth-text">
                                    <span className="auth-label">Two-Factor Authentication</span>
                                    <p className="sub-label">Add an extra layer of security to your account</p>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            <div className="security-footer">
                                <button className="change-password-btn">Change Password</button>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'System' && (
                    <div className="system-tab-content">
                        <div className="system-card-header">
                            <h3>System Settings</h3>
                            <p className="sub-label">Configure system preferences and defaults</p>
                        </div>

                        <div className="system-form-body">
                            <div className="system-main-grid">
                                {/* Left Side: Select Options */}
                                <div className="system-left-col">
                                    <div className="system-input-group">
                                        <label>Default Language</label>
                                        <select className="system-select">
                                            <option>English</option>
                                            <option>Hindi</option>
                                        </select>
                                    </div>

                                    <div className="system-input-group">
                                        <label>Timezone</label>
                                        <select className="system-select">
                                            <option>Asia/Kolkata (UTC +05:30)</option>
                                            <option>London (UTC +00:00)</option>
                                        </select>
                                    </div>

                                    <div className="system-input-group">
                                        <label>Date Format</label>
                                        <select className="system-select">
                                            <option>DD/MM/YYYY</option>
                                            <option>MM/DD/YYYY</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Right Side: Toggles */}
                                <div className="system-right-col">
                                    <div className="system-toggle-item">
                                        <div className="toggle-text">
                                            <span className="toggle-label">Enable Email Alerts</span>
                                            <p className="sub-label">Receive email notifications for important updates</p>
                                        </div>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>

                                    <div className="system-toggle-item">
                                        <div className="toggle-text">
                                            <span className="toggle-label">Enable System Notifications</span>
                                            <p className="sub-label">Show system notifications in the dashboard</p>
                                        </div>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>

                                    <div className="system-toggle-item">
                                        <div className="toggle-text">
                                            <span className="toggle-label">Auto Logout</span>
                                            <p className="sub-label">Automatically logout after 30 minutes of inactivity</p>
                                        </div>
                                        <label className="switch">
                                            <input type="checkbox" />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="system-action-footer">
                                <button className="blue-save-btn">Save Settings</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Appearance' && (
                    <div className="appearance-tab-content">
                        <div className="appearance-header">
                            <h3>Appearance Settings</h3>
                            <p className="sub-label">Customize the look and feel of the dashboard</p>
                        </div>

                        <div className="appearance-body-grid">
                            {/* Left Side: Theme & Sidebar */}
                            <div className="appearance-left">
                                <div className="setting-block">
                                    <label className="block-title">Theme Mode</label>
                                    <div className="theme-options">
                                        <div className="theme-card active-theme">
                                            <div className="theme-icon-circle dark-bg">🌙</div>
                                            <span>Dark Mode</span>
                                        </div>
                                        <div className="theme-card">
                                            <div className="theme-icon-circle light-bg">☀️</div>
                                            <span>Light Mode</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="setting-block">
                                    <label className="block-title">Sidebar Style</label>
                                    <div className="sidebar-style-options">
                                        <label className="radio-container">
                                            <input type="radio" name="sidebar" value="compact" />
                                            <span className="radio-label">Compact</span>
                                        </label>
                                        <label className="radio-container">
                                            <input type="radio" name="sidebar" value="expanded" defaultChecked />
                                            <span className="radio-label">Expanded</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Colors & Patterns */}
                            <div className="appearance-right">
                                <div className="setting-block">
                                    <label className="block-title">Primary Color</label>
                                    <div className="color-palette">
                                        <div className="color-swatch blue active-swatch">✓</div>
                                        <div className="color-swatch green"></div>
                                        <div className="color-swatch purple"></div>
                                        <div className="color-swatch orange"></div>
                                        <div className="color-swatch pink"></div>
                                        <div className="color-swatch cyan"></div>
                                    </div>
                                </div>

                                <div className="setting-block">
                                    <label className="block-title">Background Pattern</label>
                                    <div className="pattern-grid">
                                        <div className="pattern-box p1 active-pattern">✓</div>
                                        <div className="pattern-box p2"></div>
                                        <div className="pattern-box p3"></div>
                                        <div className="pattern-box p4"></div>
                                        <div className="pattern-box p5"></div>
                                        <div className="pattern-box p6"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="appearance-footer">
                            <button className="apply-btn">Apply Changes</button>
                        </div>
                    </div>
                )}
                {activeTab === 'Notifications' && (
                    <div className="notification-tab-content">
                        <div className="notification-header">
                            <h3>Notification Settings</h3>
                            <p className="sub-label">Manage what notifications you want to receive</p>
                        </div>

                        <div className="notification-body-grid">
                            {/* Left Section: Alerts with Icons */}
                            <div className="notification-col">
                                <div className="notification-item">
                                    <div className="notif-icon-box green-icon">
                                        <UserPlus size={20} />
                                    </div>
                                    <div className="notif-text">
                                        <span className="notif-title">User Registration Alerts</span>
                                        <p className="sub-label">Get notified when new users register</p>
                                    </div>
                                </div>

                                <div className="notification-item">
                                    <div className="notif-icon-box blue-icon">
                                        <RefreshCw size={20} />
                                    </div>
                                    <div className="notif-text">
                                        <span className="notif-title">Data Update Alerts</span>
                                        <p className="sub-label">Get notified when data is updated</p>
                                    </div>
                                </div>

                                <div className="notification-item">
                                    <div className="notif-icon-box teal-icon">
                                        <FileText size={20} />
                                    </div>
                                    <div className="notif-text">
                                        <span className="notif-title">Report Generation Alerts</span>
                                        <p className="sub-label">Get notified when reports are generated</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section: Toggles */}
                            <div className="notification-col">
                                <div className="notification-toggle-row">
                                    <div className="toggle-info">
                                        <span className="notif-title">System Error Alerts</span>
                                        <p className="sub-label">Get notified about system errors</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="notification-toggle-row">
                                    <div className="toggle-info">
                                        <span className="notif-title">Email Notifications</span>
                                        <p className="sub-label">Receive notifications via email</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="notification-toggle-row">
                                    <div className="toggle-info">
                                        <span className="notif-title">SMS Notifications</span>
                                        <p className="sub-label">Receive notifications via SMS</p>
                                    </div>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="notification-footer">
                            <button className="save-prefs-btn">Save Preferences</button>
                        </div>
                    </div>
                )}
                {activeTab === 'Data Management' && (
    <div className="data-management-content">
        <div className="data-header">
            <h3>Data Management</h3>
            <p className="sub-label">Backup, import or export system data</p>
        </div>

        <div className="data-options-list">
            {/* Backup Row */}
            <div className="data-action-row">
                <div className="data-info">
                    <div className="data-icon teal-icon">
                        <Database size={20} />
                    </div>
                    <div className="data-text">
                        <span className="data-title">Backup Data</span>
                        <p className="sub-label">Create a backup of all system data</p>
                    </div>
                </div>
                <button className="data-btn blue-btn">Backup Now</button>
            </div>

            {/* Import Row */}
            <div className="data-action-row">
                <div className="data-info">
                    <div className="data-icon blue-icon">
                        <Upload size={20} />
                    </div>
                    <div className="data-text">
                        <span className="data-title">Import Data</span>
                        <p className="sub-label">Import data from CSV or Excel file</p>
                    </div>
                </div>
                <button className="data-btn blue-btn">Import</button>
            </div>

            {/* Export Row */}
            <div className="data-action-row">
                <div className="data-info">
                    <div className="data-icon blue-icon">
                        <Download size={20} />
                    </div>
                    <div className="data-text">
                        <span className="data-title">Export Data</span>
                        <p className="sub-label">Export system data to CSV file</p>
                    </div>
                </div>
                <button className="data-btn blue-btn">Export</button>
            </div>

            {/* Reset Row */}
            <div className="data-action-row border-danger">
                <div className="data-info">
                    <div className="data-icon red-icon">
                        <RefreshCw size={20} />
                    </div>
                    <div className="data-text">
                        <span className="data-title">Reset System</span>
                        <p className="sub-label">Reset all system settings and data</p>
                    </div>
                </div>
                <button className="data-btn red-btn">Reset</button>
            </div>
        </div>
    </div>
)}
            </div>
        </div>
    );
};

export default Setting;