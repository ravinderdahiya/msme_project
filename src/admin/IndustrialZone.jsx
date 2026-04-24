import React, { useState } from 'react';
import { Search, Plus, Edit3, Trash2, ChevronLeft, ChevronRight, Settings, Bell, Power } from 'lucide-react';
import './IndustrialZone.css';

const IndustrialZones = () => {
    const [activeTab, setActiveTab] = useState('Road Network');

    const roadData = [
        { id: 'NH-8', type: 'National Highway', status: 'Updated' },
        { id: 'NH-44', type: 'National Highway', status: 'Updated' },
        { id: 'SH-10', type: 'State Highway', status: 'Updated' },
        { id: 'NH-71A', type: 'National Highway', status: 'Updated' },
        { id: 'SH-7', type: 'State Highway', status: 'Pending' },
    ];

    return (
        <div className="zone-page-container">
            {/* Top Header Section */}
            <div className="zone-header-utility">
                <div className="breadcrumb-text">Dashboard {'>'} Industrial Zones</div>
                <div className="user-profile-nav">
                    <div className="user-capsule">
                        <img src="/admin-avatar.jpg" alt="Anil" className="nav-avatar" />
                        <span>Anil Kumar</span>
                    </div>
                    <Settings size={18} className="nav-icon" />
                </div>
            </div>

            {/* Main Action Row */}
            <div className="title-action-row">
                <h1 className="zone-title">Add Industrial Zone</h1>
                <button className="add-zone-btn">
                    <Plus size={18} /> Add Industrial Zone
                </button>
            </div>

            {/* Glass Card Container */}
            <div className="zone-glass-card">
                {/* Tab Navigation */}
                <div className="zone-tabs">
                    {['Road Network', 'Water Supply', 'Electricity'].map((tab) => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active1' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search & Internal Add Row */}
                <div className="table-filter-bar">
                    <button className="inner-add-btn"><Plus size={14} /> Add Road Data</button>
                    <div className="inner-search">
                        <Search size={14} />
                        <input type="text" placeholder="Search" />
                    </div>
                </div>

                {/* Responsive Table */}
                <div className="zone-table-wrapper">
                    <table className="industrial-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Route Type</th>
                                <th>Status</th>
                                <th>Status</th> {/* Screenshot mein do status column hain */}
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roadData.map((row, index) => (
                                <tr key={index}>
                                    <td className="row-id">{row.id}</td>
                                    <td>{row.type}</td>
                                    <td>
                                        <span className={`status-pill ${row.status.toLowerCase()}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td></td> {/* Empty column as per UI */}
                                    <td className="action-btns">
                                        <button className="icon-btn-glass"><Edit3 size={14} /></button>
                                        <button className="icon-btn-glass"><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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

export default IndustrialZones;