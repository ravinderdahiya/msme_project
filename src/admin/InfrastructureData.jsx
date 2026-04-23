import React from 'react';
import { Search, ChevronDown, MapPin, Save, X,Settings } from 'lucide-react';
import './InfrastructureData.css';

const InfrastructureData = () => {
  return (
    <div className="form-page-container">
       <div className="users-nav-header">
        <div className="breadcrumb">Dashboard {'>'} Industrial Data</div>
        <div className="top-right-actions">
          <div className="user-info-pill">
            <img src="/avatar.jpg" alt="User" className="small-avatar" />
            <span>Anil Kumar</span>
          </div>
          <Settings size={18} className="header-icon" />
        </div>
      </div>
      {/* Header Section */}
      <div className="form-header">
        <h1 className="form-title">Add Industrial Zone</h1>
        <button className="top-add-btn">+ Add Industrial Zone</button>
      </div>

      {/* Main Glass Form Card */}
      <div className="glass-form-card">
        {/* Navigation Tabs */}
        <div className="form-tabs">
          <button className="tab-item active1">Road Network</button>
          <button className="tab-item">Water Supply</button>
          <button className="tab-item">Electricity</button>
          <div className="tab-search">
            <Search size={14} />
            <input type="text" placeholder="Search" />
          </div>
        </div>

        {/* Form Body */}
        <div className="form-body">
          {/* Full Width Row */}
          <div className="form-group">
            <label>Zone Name</label>
            <input type="text" placeholder="Bhwani Tech Area" className="dark-input" />
          </div>

          {/* Two Column Row */}
          <div className="form-row">
            <div className="form-group">
              <label>Zone Type</label>
              <div className="select-wrapper">
                <select className="dark-input">
                  <option>Technology Park</option>
                  <option>Manufacturing Hub</option>
                </select>
                <ChevronDown className="select-icon" size={16} />
              </div>
            </div>
            <div className="form-group">
              <label>Coordinates</label>
              <div className="input-split">
                <input type="text" placeholder="28.799850" className="dark-input" />
                <input type="text" placeholder="76.175603" className="dark-input" />
              </div>
            </div>
          </div>

          {/* Two Column Row */}
          <div className="form-row">
            <div className="form-group">
              <label>Map Coordinates</label>
              <div className="input-with-button">
                <input type="text" placeholder="28.799850    76.173668" className="dark-input" />
                <button className="map-btn">Update</button>
              </div>
            </div>
            <div className="form-group">
              <label>Total Area</label>
              <div className="input-with-icons">
                <input type="text" placeholder="200 Acres" className="dark-input" />
                <div className="inner-icons">
                   <MapPin size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Half Width Select */}
          <div className="form-row">
            <div className="form-group half">
              <label>Availability</label>
              <div className="select-wrapper">
                <select className="dark-input">
                  <option>Available</option>
                  <option>Sold Out</option>
                </select>
                <ChevronDown className="select-icon" size={16} />
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="form-actions">
            <button className="save-btn">Save</button>
            <button className="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureData;