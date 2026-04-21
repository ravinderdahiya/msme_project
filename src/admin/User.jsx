import React from 'react';
import { Search, Plus, Edit2, Trash2, Settings, Bell, Power, ChevronLeft, ChevronRight } from 'lucide-react';
import './User.css';

const Users = () => {
  const usersData = [
    { name: 'Anil Kumar', email: 'anil.kumar@example.com', role: 'Admin', status: 'Active' },
    { name: 'Surbhi Sharma', email: 'surbhi.sharma@example.com', role: 'Manager', status: 'Active' },
    { name: 'Rohit Mehra', email: 'rohit.mehra@example.com', role: 'User', status: 'Inactive' },
    { name: 'Akash Patel', email: 'akash.patel@example.com', role: 'User', status: 'Inactive' },
    { name: 'Sandeep Agarwal', email: 'sandeep.agarwal@example.com', role: 'User', status: 'Pending' },
  ];

  return (
    <div className="users-page-container">
      {/* Top Header Section */}
      <div className="users-nav-header">
        <div className="breadcrumb">Dashboard {'>'} Users</div>
        <div className="top-right-actions">
           <div className="user-info-pill">
             <img src="/avatar.jpg" alt="User" className="small-avatar" />
             <span>Anil Kumar</span>
           </div>
           <Settings size={18} className="header-icon" />
        </div>
      </div>

      {/* Title and Add Button */}
      <div className="users-title-bar">
        <h1 className="page-title">Users</h1>
        <button className="add-user-btn">
          <Plus size={18} /> Add User
        </button>
      </div>

      {/* Table Glass Card */}
      <div className="users-glass-card">
        {/* Filter & Search Bar */}
        <div className="table-controls">
          <button className="filter-chip">All Roles</button>
          <div className="search-box-container">
            <Search size={14} />
            <input type="text" placeholder="Search" />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user, index) => (
                <tr key={index}>
                  <td className="user-name-cell">{user.name}</td>
                  <td className="user-email-cell">{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status-pill ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button className="action-icon-btn"><Edit2 size={14} /></button>
                    <button className="action-icon-btn"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="users-table-footer">
          <div className="pagination-numbers">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">5</button>
            <button className="page-btn">3</button>
          </div>
          <div className="footer-right-nav">
             <button className="nav-arrow"><ChevronLeft size={16} /></button>
             <span className="footer-label">Image</span>
             <button className="nav-arrow"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;