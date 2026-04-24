import React from 'react';
import { Search, Plus, Edit2, Download, ChevronLeft, ChevronRight, Settings, Bell, Power } from 'lucide-react';
import './Location.css';

const Location = () => {
    const tableData = [
        { name: 'Gurgram Industrial Hub', dist: 'Gurgaon', area: '250 Acre', status: 'Active' },
        { name: 'Sonipat Expansion Area', dist: 'Faridabad', area: '180 Acre', status: 'Active' },
        { name: 'Bhiwan Tech Area', dist: 'Sonipat', area: '220 Acre', status: 'Active' },
        { name: 'Faridabad Manufacturing Park', dist: 'Sonipat', area: '220 Acre', status: 'Active' },
        { name: 'Panipat Business District', dist: 'Ambala', area: '160 Acre', status: 'Active' },
        { name: 'Ambala Logistics Hub', dist: 'Ambala', area: '150 Acre', status: 'Active' },
        { name: 'Karnal Agro Zone', dist: 'Karnal', area: '150 Acre', status: 'Active' },
    ];

    return (
        <div className="manage-page-wrapper">
            {/* Top Utility Bar */}
            {/* <div className="top-utility-bar">
                <div className="search-container">
                    <Search size={16} className="search-icon" />
                    <input type="text" placeholder="Detailed Reports" className="top-search-input" />
                </div>
                <div className="user-actions">
                    <div className="profile-img-small">
                        <img src="/admin-avatar.jpg" alt="Admin" />
                    </div>
                    <Bell size={20} className="action-icon" />
                    <Settings size={20} className="action-icon" />
                    <Power size={20} className="action-icon logout" />
                </div>
            </div> */}

            {/* Main Heading & Add Button */}
            <div className="users-nav-header">
                <div className="breadcrumb">Dashboard {'>'} Location</div>
                <div className="top-right-actions">
                    <div className="user-info-pill">
                        <img src="/avatar.jpg" alt="User" className="small-avatar" />
                        <span>Anil Kumar</span>
                    </div>
                    <Settings size={18} className="header-icon" />
                </div>
            </div>
            <div className="content-header">
                <h1 className="main-title">Manage Locations</h1>
                <button className="add-location-btn">
                    <Plus size={18} /> Add Location
                </button>
            </div>

            {/* Table Section */}
            <div className="table-glass-container">
                <div className="table-responsive">
                    <table className="location-data-table">
                        <thead>
                            <tr>
                                <th>Location Name</th>
                                <th>District</th>
                                <th>Area</th>
                                <th>Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((item, index) => (
                                <tr key={index}>
                                    <td className="location-name">{item.name}</td>
                                    <td>{item.dist}</td>
                                    <td>{item.area}</td>
                                    <td>
                                        <span className="status-badge-active">{item.status}</span>
                                    </td>
                                    <td className="action-cell">
                                        <button className="row-btn edit"><Edit2 size={14} /></button>
                                        <button className="row-btn download"><Download size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Custom Pagination Bar */}
                <div className="table-footer-pagination">
                    <div className="pagination-left">
                        <button className="nav-btn disabled"><ChevronLeft size={16} /></button>
                        <span className="page-num active">1</span>
                        <button className="nav-btn"><ChevronRight size={16} /></button>
                    </div>
                    <div className="pagination-right">
                        <button className="nav-btn"><ChevronLeft size={16} /></button>
                        <span className="total-label">Meal</span>
                        <button className="nav-btn"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Location;