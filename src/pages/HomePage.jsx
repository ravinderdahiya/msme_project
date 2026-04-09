import React from "react";
import "./HomePage.css";

export default function Home() {
  return (
    <div className="home-container">

      {/* ===== TOP GOVT HEADER ===== */}
      <header className="gov-header">

        {/* TOP STRIP */}
        <div className="top-strip">
          <span>Government of India | Ministry of MSME</span>
    <span>MSME Support Helpline: 1800-180-6763</span>
    <span>MSME Portal | Digital India Initiative</span>
        </div>

        {/* MAIN HEADER */}
        <div className="main-header">
          <img src="/harsac-logo.png" className="logo left" />

          <div className="title">
            <h2>सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय</h2>
      <h3>Ministry of Micro, Small & Medium Enterprises</h3>
      <p>Government Monitoring & Economic Vulnerability Dashboard</p>
          </div>

          <img src="/har_govt.png" className="logo right" />
        </div>

        {/* NAVBAR */}
        <nav className="menu-bar">
          <ul>
           <li>HOME</li>
      <li>MSME DASHBOARD</li>
      <li>STATE ANALYTICS</li>
      <li>ECONOMIC TRACKER</li>
      <li>REPORTS</li>
      <li>DATA & INSIGHTS</li>
      <li>CONTACT</li>
          </ul>
        </nav>

      </header>

      {/* ===== CENTER CONTENT ===== */}
      <div className="hero-content">
      <h1>MSME Monitoring Dashboard</h1>
<p>
Government Analytics Platform for MSME Growth, Risk Assessment
and Economic Activity Monitoring
</p>
        <button className="explore-btn">Login</button>
      </div>

    </div>

  );
}