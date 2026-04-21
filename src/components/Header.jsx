import React, { useState } from "react";

function Header() {
  const [showMeasure, setShowMeasure] = useState(false);

  const [point1, setPoint1] = useState({ lat: "", lng: "" });
  const [point2, setPoint2] = useState({ lat: "", lng: "" });
  const [distance, setDistance] = useState(null);

  // 🌍 Haversine Formula
  const calculateDistance = () => {
    const toRad = (value) => (value * Math.PI) / 180;

    const lat1 = parseFloat(point1.lat);
    const lon1 = parseFloat(point1.lng);
    const lat2 = parseFloat(point2.lat);
    const lon2 = parseFloat(point2.lng);

    if (!lat1 || !lon1 || !lat2 || !lon2) {
      alert("Please enter valid coordinates");
      return;
    }

    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    setDistance(d.toFixed(2));
  };

  return (
    <div style={container}>
      {/* 🔹 Top Bar */}
      <div style={topRow}>
        <h2 style={{ margin: 0 }}>MSME GIS Dashboard</h2>

  
      </div>

      {/* 🔽 Dropdown Panel */}
      <div
        style={{
          ...dropdown,
          maxHeight: showMeasure ? "300px" : "0px",
          padding: showMeasure ? "15px" : "0px"
        }}
      >
        {showMeasure && (
          <>
         
          </>
        )}
      </div>
    </div>
  );
}

// 🎨 Styles
const container = {
  width: "100%",
  background: "linear-gradient(90deg, #1e3c72, #2a5298)",
  color: "#fff",
  padding: "15px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const measureBtn = {
  padding: "8px 16px",
  background: "#fff",
  color: "#1e3c72",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "500"
};

const loginBtn = {
  padding: "8px 16px",
  borderRadius: "20px",
  border: "2px solid #fff",
  background: "transparent",
  color: "#fff",
  cursor: "pointer"
};

const dropdown = {
  overflow: "hidden",
  transition: "all 0.4s ease",
  background: "#fff",
  color: "#333",
  borderRadius: "10px",
  marginTop: "10px"
};

const inputRow = {
  display: "flex",
  gap: "10px",
  marginBottom: "10px"
};

const calcBtn = {
  padding: "8px",
  width: "100%",
  background: "#2a5298",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

export default Header;