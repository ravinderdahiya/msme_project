import React, { useState } from "react";
import "./Header.css";

function Header() {
  const [showMeasure] = useState(false);

  return (
    <header className="app-header">
      <div className="app-header__top-row">
        <h2 className="app-header__title">MSME GIS Dashboard</h2>
      </div>

      <div
        className="app-header__dropdown"
        style={{
          maxHeight: showMeasure ? "300px" : "0px",
          padding: showMeasure ? "15px" : "0px",
        }}
      >
        {showMeasure && <></>}
      </div>
    </header>
  );
}

export default Header;
