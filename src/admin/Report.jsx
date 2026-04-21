import React from 'react';
import { 
  FileText, CheckCircle, Clock, Download, Search, 
  Calendar, MapPin, Filter, Eye, Trash2, Plus 
} from 'lucide-react';
import './Report.css';

const Report = () => {
  const reportStats = [
    { label: 'Total Reports', value: '152', sub: 'All time reports', icon: <FileText color="#3b82f6" />, class: 'blue-grad' },
    { label: 'Generated', value: '120', sub: 'Successfully generated', icon: <CheckCircle color="#10b981" />, class: 'green-grad' },
    { label: 'Pending', value: '18', sub: 'Awaiting generation', icon: <Clock color="#f59e0b" />, class: 'orange-grad' },
    { label: 'Downloaded', value: '312', sub: 'Total downloads', icon: <Download color="#a855f7" />, class: 'purple-grad' },
  ];

  const reportList = [
    { name: 'Land Availability Report', type: 'PDF', loc: 'Gurugram Industrial Hub', date: '22 Apr 2024, 10:30 AM', status: 'Ready' },
    { name: 'Industrial Zones Summary', type: 'PDF', loc: 'Faridabad Zone', date: '21 Apr 2024, 04:15 PM', status: 'Ready' },
    { name: 'Infrastructure Data Report', type: 'XLS', loc: 'Panipat Region', date: '20 Apr 2024, 11:20 AM', status: 'Ready' },
    { name: 'Utilities Consumption Report', type: 'PDF', loc: 'Ambala Industrial Area', date: '19 Apr 2024, 02:45 PM', status: 'Pending' },
    { name: 'Investment Potential Report', type: 'PDF', loc: 'Sonipat Area', date: '18 Apr 2024, 09:10 AM', status: 'Ready' },
  ];

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="header-left">
          <h1>Reports</h1>
          <p>View and manage all generated reports</p>
        </div>
        <button className="gen-report-btn">
          <Plus size={18} /> Generate New Report
        </button>
      </div>

      {/* Summary Stats Row */}
      <div className="reports-stats-grid">
        {reportStats.map((stat, idx) => (
          <div key={idx} className={`report-stat-card ${stat.class}`}>
            <div className="stat-icon-bg">{stat.icon}</div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <h2 className="stat-value">{stat.value}</h2>
              <span className="stat-subtext">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="reports-filter-bar glass-card">
        <div className="filter-group">
          <label><Calendar size={14} /> Date Range</label>
          <input type="text" placeholder="01/04/2024 - 30/04/2024" className="filter-input" />
        </div>
        <div className="filter-group">
          <label><MapPin size={14} /> Location</label>
          <select className="filter-input">
            <option>All Locations</option>
          </select>
        </div>
        <div className="filter-group">
          <label><Filter size={14} /> Report Type</label>
          <select className="filter-input">
            <option>All Types</option>
          </select>
        </div>
        <div className="filter-group search-group">
          <label>Search Report</label>
          <div className="search-input-wrapper">
            <Search size={14} />
            <input type="text" placeholder="Search by report name..." />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="reports-table-card glass-card">
        <div className="table-responsive">
          <table className="custom-reports-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Date Generated</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reportList.map((item, i) => (
                <tr key={i}>
                  <td>
                    <div className="report-name-cell">
                      <strong>{item.name}</strong>
                      <span>Detailed analysis report</span>
                    </div>
                  </td>
                  <td>
                    <span className={`file-tag ${item.type.toLowerCase()}`}>
                      <FileText size={12} /> {item.type}
                    </span>
                  </td>
                  <td>{item.loc}</td>
                  <td className="date-cell">{item.date}</td>
                  <td>
                    <span className={`status-tag ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="action-btns">
                    <button className="icon-btn view"><Eye size={14} /></button>
                    <button className="icon-btn download"><Download size={14} /></button>
                    <button className="icon-btn delete"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>Showing 1 to 5 of 152 reports</span>
          <div className="pagination">
             <button className="page-nav">{"<"}</button>
             <button className="page-num active">1</button>
             <button className="page-num">2</button>
             <button className="page-num">3</button>
             <button className="page-nav">{">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;