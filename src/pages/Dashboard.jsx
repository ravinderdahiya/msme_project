import React from "react";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header">
        <h1>MSME’s STATEWIDE VULNERABILITY TRACKER</h1>

        <button className="tracker-btn">
          ECONOMIC VULNERABILITY TRACKER
        </button>
      </div>

      <p className="subtitle">
        ISOLATING AREAS IN INDIA WHERE MICRO, SMALL AND MEDIUM ENTERPRISES (MSMEs)
        ARE THE MOST VULNERABLE
      </p>

      {/* FILTERS */}
      <div className="filters">
        <select>
          <option>Delhi</option>
        </select>

        <select>
          <option>Urban</option>
        </select>
      </div>

      <div className="content">

        {/* LEFT MAP */}
        <div className="map-section">
          <img
            src="/map.png"
            alt="India Map"
            className="map-img"
          />

          <div className="legend">
            <span className="high"></span> High Vulnerability
            <span className="medium"></span> Medium Vulnerability
            <span className="low"></span> Low Vulnerability
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          <h2>Delhi - Urban</h2>

          <div className="score-card">
            <div>
              <p>MSME VULNERABILITY SCORE</p>
              <h3>56.8%</h3>
            </div>

            <div className="rank">
              High Vulnerability Rank: 1
            </div>
          </div>

          {/* DEMOGRAPHICS */}
          <h3 className="section-title">DEMOGRAPHICS</h3>

          <div className="grid">
            <div className="box">
              <p># Employed by MSMEs</p>
              <h4>1,892,819</h4>
            </div>

            <div className="box">
              <p># of MSME Enterprises</p>
              <h4>1,025,169</h4>
            </div>

            <div className="box">
              <p># of Registered MSMEs</p>
              <h4>137,008</h4>
            </div>

            <div className="box">
              <p>Unemp % Jan 2020</p>
              <h4>22.5%</h4>
            </div>
          </div>

          {/* KEY METRICS */}
          <h3 className="section-title">KEY METRICS</h3>

          <div className="metric">
            <span>Employed by MSMEs</span>
            <div className="bar red" style={{ width: "70%" }}></div>
          </div>

          <div className="metric">
            <span>% Registered MSMEs</span>
            <div className="bar green" style={{ width: "40%" }}></div>
          </div>

          <div className="metric">
            <span>% of Migrants</span>
            <div className="bar orange" style={{ width: "60%" }}></div>
          </div>

        </div>
      </div>
    </div>
  );
}