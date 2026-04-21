import React from 'react';
import './Dashboard.css';
import { Menu, Search, Bell, Settings, User } from 'lucide-react';
import { MapPin, Landmark, Users, FileBarChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {  ChevronDown } from 'lucide-react';
import {  Download, ExternalLink, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

const Dashboard = ({ pageTitle = "Dashboard" }) => {

    const stats = [
        {
            id: 1,
            label: 'Total Locations',
            value: '234',
            icon: <MapPin size={24} />,
            className: 'card-blue'
        },
        {
            id: 2,
            label: 'Available Land/Acres',
            value: '1,342',
            icon: <Landmark size={24} />,
            className: 'card-green'
        },
        {
            id: 3,
            label: 'Active Users',
            value: '1,567',
            icon: <Users size={24} />,
            className: 'card-cyan'
        },
        {
            id: 4,
            label: 'Reports Generated',
            value: '892',
            icon: <FileBarChart size={24} />,
            className: 'card-yellow'
        }
    ];
    const data = [
        { name: 'JUN 2023', value: 150 },
        { name: 'JUL 2023', value: 250 },
        { name: 'AUG 2023', value: 200 },
        { name: 'SEP 2023', value: 350 },
        { name: 'OCT 2023', value: 300 },
        { name: 'OCT 2025', value: 450 },
        { name: 'NOV 2023', value: 500 },
    ];
    const reports = [
    { name: 'Gurugram Industrial Zone Analysis', date: 'April 10, 2024', size: '1.0 MB' },
    { name: 'Faridabad Land Availability', date: 'April 10, 2024', size: '1.0 MB' },
    { name: 'Monthly Usage Report', date: 'March 28, 2024', size: '1.0 MB' },
    { name: 'Electrical Infrastructure Status', date: 'March 20, 2024', size: '1.0 MB' },
  ];
const locations = [
    { name: 'Gurgaon', district: 'Gurgaon', area: '250 Acre' },
    { name: 'Faridabad', district: 'Faridabad', area: '180 Acre' },
    { name: 'Panipat', district: 'Panipat', area: '300 Acre' },
    { name: 'Sonipat', district: 'Sonipat', area: '220 Acre' },
    { name: 'Ambala', district: 'Ambala', area: '150 Acre' },
  ];




    return (
        <>    
        
        {/* <header className="top-header">
            <div className="header-left">
                <button className="menu-toggle">
                    <Menu size={20} />
                </button>
                <h2 className="page-title">{pageTitle}</h2>
            </div>

            <div className="header-right">
                
                <div className="icon-btn search-btn">
                    <Search size={18} />
                </div>

               
                <div className="user-section">
                    <div className="user-details">
                        <span className="user-name">Anil Kumar</span>
                    </div>
                    <div className="avatar-wrapper">
                        <img
                            src="/admin-avatar.jpg"
                            alt="User"
                            className="user-avatar"
                        />
                    </div>
                </div>

              
                <div className="icon-btn settings-btn">
                    <Settings size={18} />
                </div>
            </div>
        </header> */}


            <div className="stats-grid">
                {stats.map((item) => (
                    <div key={item.id} className={`stat-card ${item.className}`}>
                        <div className="stat-icon-wrapper">
                            {item.icon}
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-value">{item.value}</h3>
                            <p className="stat-label">{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="middle-grid">
                {/* Left: Statistics Overview Graph */}
                <div className="glass-card graph-container">
                    <div className="card-header">
                        <div>
                            <h3 className="card-title">Statistics Overview</h3>
                            <p className="card-subtitle">Investment Growth | Over Time</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Area type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Recent Reports List */}
                <div className="glass-card reports-container">
                    <div className="card-header border-none">
                        <h3 className="card-title">Recent Reports</h3>
                        <div className="search-dropdown">
                            <span>Search</span>
                            <ChevronDown size={14} />
                        </div>
                    </div>

                    <div className="reports-list">
                        {[
                            { title: 'Gurugram Industrial Area Analysis', date: 'March 10, 2024', size: '1.5 MB' },
                            { title: 'Faridabad Land Availability', date: 'April 12, 2024', size: '1.2 MB' },
                            { title: 'Monthly Usage Report', date: 'March 28, 2024', size: '1.1 MB' }
                        ].map((report, index) => (
                            <div key={index} className="report-item">
                                <div className="report-icon">
                                    <FileText size={18} />
                                </div>
                                <div className="report-info">
                                    <p className="report-title">{report.title}</p>
                                    <p className="report-meta">Math to, 2021</p>
                                </div>
                                <div className="report-size-badge">
                                    {report.size}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="dashboard-bottom-container">
      {/* Left Table: Recent Locations */}
      <div className="table-glass-card">
        <div className="table-top-bar">
          <h3 className="table-heading">Recent Locations</h3>
          <div className="table-search-box">
            <span>Search</span>
            <Search size={14} />
          </div>
        </div>
        <div className="responsive-table-holder">
          <table className="admin-custom-table">
            <thead>
              <tr>
                <th>Location Name</th>
                <th>District</th>
                <th>Area</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc, index) => (
                <tr key={index}>
                  <td>{loc.name}</td>
                  <td>{loc.district}</td>
                  <td>{loc.area}</td>
                  <td>
                    <button className="icon-action-btn">
                      <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Table: Recent Reports with Pagination */}
      <div className="table-glass-card">
        <div className="table-top-bar">
          <h3 className="table-heading">Recent Reports</h3>
          <div className="table-search-box search-with-icon">
            <Search size={14} />
            <input type="text" placeholder="Search..." className="table-input" />
            <ChevronLeft size={14} className="input-arrow" />
          </div>
        </div>
        <div className="responsive-table-holder">
          <table className="admin-custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Size</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  <td className="text-truncate">{report.name}</td>
                  <td>{report.date}</td>
                  <td>{report.size}</td>
                  <td>
                    <button className="icon-action-btn download-btn">
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Bar from Image */}
        <div className="pagination-footer">
          <div className="page-nav">
            <ChevronLeft size={16} className="nav-arrow disabled" />
            <span className="current-page">1</span>
            <ChevronRight size={16} className="nav-arrow" />
          </div>
          <div className="total-badge">Total</div>
        </div>
      </div>
    </div>
        </>

    );
};

export default Dashboard;