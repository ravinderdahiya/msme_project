import React, { useState } from 'react';
import Sidebar from './Sidebar';
// import TopHeader from './TopHeader';
import Dashboard from './Dashboard';
import Location from './Location';
import IndustrialZones from './IndustrialZone';
import InfrastructureData from './InfrastructureData';
import Report from './Report';
import Users from './User';
import './Admin.css';

const Admin = () => {
  // Default tab 'dashboard' rakha hai
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="admin-layout">
      {/* Sidebar ko setActiveTab function bhej rahe hain */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="admin-content">
        {/* <TopHeader title={activeTab === 'dashboard' ? 'Dashboard' : 'Manage Locations'} /> */}
        
        <main className="main-viewport">
          {/* Conditional Rendering: Bina URL change kiye page badalna */}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'locations' && <Location />}
           {activeTab === 'zones' && <IndustrialZones />}
            {activeTab === 'data' && <InfrastructureData />}
             {activeTab === 'users' && <Users />}
             {activeTab === 'reports' && <Report />}
        </main>
      </div>
    </div>
  );
};

export default Admin;