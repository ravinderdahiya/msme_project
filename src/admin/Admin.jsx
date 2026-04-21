import React, { useState } from 'react';
import Sidebar from './Sidebar';
// import TopHeader from './TopHeader';
import Dashboard from './Dashboard';
// import ManageLocations from './ManageLocations';
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
          {/* {activeTab === 'locations' && <ManageLocations />} */}
        </main>
      </div>
    </div>
  );
};

export default Admin;