// App.js
import React from "react";
import "./HomePage.css";

export default function HomePage() {
  return (
    <>
      <div className="home">

        {/* Navbar */}
        <nav className="navbar">
          <div className="logo">MSME</div>

          <ul className="nav-links">
            <li>Home</li>
            <li>About</li>
            <li>Features</li>
            <li className="login-btn">Login</li>
          </ul>

          <button className="signup">Sign Up</button>
        </nav>
        {/* Top Info Strip */}
        <div className="top-strip">
          <div className="strip-left">
            <img src="/har_govt.png" alt="logo" />
          </div>

          <div className="strip-center">
            <p>
              Discover the best land for your industrial & commercial projects
            </p>
          </div>

          <div className="strip-right">
            <img src="/logo-hewp.png" alt="logo" />
          </div>
        </div>
        <div className="center-cta-section">
          <div className="center-cta">
            <h3>Unlock Powerful GIS Tools</h3>
            <p>Login to explore interactive GIS map</p>
            <button className="cta-btn">Login to Unlock</button>
          </div>
        </div>

       
        <section className="slider">
          <div className="slide-track">

            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="card">
                  <img src="/landicon.jpg" alt="" />
                  <h3>Find Land</h3>
                  <p>Search location-based properties</p>
                </div>

                <div className="card">
                  <img src="/insight.png" alt="" />
                  <h3>Get Insights</h3>
                  <p>Analyze GIS data layers</p>
                </div>

                <div className="card">
                  <img src="/desicion.png" alt="" />
                  <h3>Make Decisions</h3>
                  <p>Download land reports</p>
                </div>

                <div className="card">
                  <img src="/zone.png" alt="" />
                  <h3>Industrial Zones</h3>
                  <p>Zone analysis</p>
                </div>

                <div className="card">
                  <img src="/road.png" alt="" />
                  <h3>Road Network</h3>
                  <p>Connectivity insights</p>
                </div>
              </React.Fragment>
            ))}

          </div>
        </section>

       
      </div>
      <footer className="footer">

        <div className="footer-container">

          {/* About Project */}
          <div className="footer-section">
            <h2>About Project</h2>
            <p>
              यह प्रोजेक्ट एक GIS आधारित वेब प्लेटफॉर्म है, जिसका उद्देश्य निवेशकों को
              उपयुक्त भूमि खोजने और उसका विश्लेषण करने में मदद करना है।
            </p>
          </div>

          {/* Objectives */}
          <div className="footer-section">
            <h2>🎯 उद्देश्य</h2>
            <ul>
              <li>सही लोकेशन पर भूमि उपलब्ध कराना</li>
              <li>लोकेशन आधारित डेटा एनालिसिस</li>
              <li>सही निर्णय लेने में सहायता</li>
            </ul>
          </div>

          {/* GIS Layers */}
          <div className="footer-section">
            <h2>🗺️ GIS Layers</h2>
            <ul>
              <li>🏭 Industrial Zones</li>
              <li>🛣️ Road Network</li>
              <li>🚰 Water Supply</li>
              <li>⚡ Electricity Grid</li>
              <li>🏥 Nearby Facilities</li>
              <li>🌱 Environmental Data</li>
            </ul>
          </div>

          {/* Features */}
          <div className="footer-section">
            <h2>🔍 Features</h2>
            <ul>
              <li>📍 Location-based Search</li>
              <li>🗺️ Interactive Map</li>
              <li>🎛️ Layer Control</li>
              <li>📊 Data Visualization</li>
              <li>📄 Reports</li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          © 2024 InvestSmart | Government GIS Platform
        </div>

      </footer>
    </>



  );
};

