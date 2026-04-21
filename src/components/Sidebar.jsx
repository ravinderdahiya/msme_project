import React, { useState } from "react";
import  "../css/Sidebar.css"

const hierarchyData = {
  india: {
    haryana: {
      Ambala: ["Village A1", "Village A2"],
      Bhiwani: ["Village B1", "Village B2"],
      "Charkhi Dadri": ["Village C1", "Village C2"],
      Faridabad: ["Village F1", "Village F2"],
      Fatehabad: ["Village FA1", "Village FA2"],
      Gurugram: ["Village G1", "Village G2"],
      Hisar: ["Village H1", "Village H2"],
      Jhajjar: ["Village JH1", "Village JH2"],
      Jind: ["Village JI1", "Village JI2"],
      Kaithal: ["Village K1", "Village K2"],
      Karnal: ["Village KR1", "Village KR2"],
      Kurukshetra: ["Village KU1", "Village KU2"],
      Mahendragarh: ["Village M1", "Village M2"],
      Nuh: ["Village N1", "Village N2"],
      Palwal: ["Village PA1", "Village PA2"],
      Panchkula: ["Village PAN1", "Village PAN2"],
      Panipat: ["Village PNP1", "Village PNP2"],
      Rewari: ["Village R1", "Village R2"],
      Rohtak: ["Village RO1", "Village RO2"],
      Sirsa: ["Village S1", "Village S2"],
      Sonipat: ["Village SO1", "Village SO2"],
      Yamunanagar: ["Village Y1", "Village Y2"],
    },
  },
};

function Sidebar({ filters, setFilters }) {
  const [manualCoords, setManualCoords] = useState("");
  const [locationInfo, setLocationInfo] = useState({
    lat: "",
    lng: "",
    accuracy: null,
    address: "",
    status: "idle",
  });
  const [searchingPlace, setSearchingPlace] = useState(false);

  const forwardGeocode = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          display_name: data[0].display_name,
        };
      }

      return null;
    } catch (error) {
      console.error("Geocoding failed:", error);
      return null;
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || "Unknown address";
    } catch (error) {
      return "Address unavailable";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "country") {
        updated.state = "";
        updated.district = "";
        updated.village = "";
      }

      if (name === "state") {
        updated.district = "";
        updated.village = "";
      }

      if (name === "district") {
        updated.village = "";
      }

      return updated;
    });
  };

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLocationInfo((prev) => ({ ...prev, status: "fetching" }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const address = await reverseGeocode(latitude, longitude);

        setLocationInfo({
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
          accuracy: accuracy.toFixed(0),
          address,
          status: "success",
        });

        setFilters((prev) => ({
          ...prev,
          currentLocation: `${latitude},${longitude}`,
          locationAccuracy: accuracy,
          locationAddress: address,
        }));
      },
      (error) => {
        setLocationInfo((prev) => ({ ...prev, status: "error" }));
        alert("GPS Error: " + error.message);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleManualLocation = async () => {
    const query = manualCoords.trim();
    if (!query) {
      alert("Enter place name or coordinates");
      return;
    }

    setSearchingPlace(true);
    let coords = await forwardGeocode(query);

    if (!coords) {
      const parts = query.split(",").map((s) => s.trim());
      if (parts.length === 2) {
        const [lat, lng] = parts.map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          coords = {
            lat,
            lng,
            display_name: query,
          };
        }
      }
    }

    setSearchingPlace(false);

    if (coords) {
      setFilters((prev) => ({
        ...prev,
        currentLocation: `${coords.lat},${coords.lng}`,
        locationAddress: coords.display_name,
      }));

      setLocationInfo({
        lat: coords.lat.toFixed(6),
        lng: coords.lng.toFixed(6),
        address: coords.display_name,
        status: "manual",
      });
    } else {
      alert("Place not found");
    }
  };

  const states = filters.country
    ? Object.keys(hierarchyData[filters.country] || {})
    : [];

  const districts =
    filters.country && filters.state
      ? Object.keys(hierarchyData[filters.country][filters.state] || {})
      : [];

  const villages =
    filters.country && filters.state && filters.district
      ? hierarchyData[filters.country][filters.state][filters.district] || []
      : [];

  return (
    <div style={styles.sidebar}>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Administrative</h3>

        <select
          name="country"
          value={filters.country || ""}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Country</option>
          <option value="india">India</option>
        </select>

        <select
          name="state"
          value={filters.state || ""}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state.charAt(0).toUpperCase() + state.slice(1)}
            </option>
          ))}
        </select>

        <select
          name="district"
          value={filters.district || ""}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">District</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>

        <select
          name="village"
          value={filters.village || ""}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">Village</option>
          {villages.map((village) => (
            <option key={village} value={village}>
              {village}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>My Location</h3>

        <button style={styles.btnPrimary} onClick={handleCurrentLocation}>
          Get GPS Location
        </button>

        {locationInfo.status !== "idle" && (
          <div style={styles.locationInfo}>
            {locationInfo.lat && (
              <div>
                <div>
                  {locationInfo.lat}, {locationInfo.lng}
                </div>
                <div>{locationInfo.address}</div>
              </div>
            )}
          </div>
        )}

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            placeholder="Taj Mahal or 28.7041,77.1025"
            value={manualCoords}
            onChange={(e) => setManualCoords(e.target.value)}
          />
          <button
            style={styles.btnSecondary}
            onClick={handleManualLocation}
            disabled={searchingPlace}
          >
            {searchingPlace ? "..." : "Go"}
          </button>
        </div>
      </div>

      <button style={styles.btnRed} onClick={() => setFilters({})}>
        Clear All Filters
      </button>
    </div>
  );
}

export default Sidebar;

const styles = {
  sidebar: {
    width: "320px",
    background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
    color: "white",
    height: "100vh",
    overflowY: "auto",
    padding: "20px",
    boxShadow: "4px 0 20px rgba(0,0,0,0.3)",
  },
  section: {
    marginBottom: "25px",
    paddingBottom: "20px",
    borderBottom: "1px solid #334155",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 15px 0",
    color: "#f8fafc",
  },
  select: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    background: "#1e293b",
    color: "white",
    border: "1px solid #475569",
    borderRadius: "8px",
    fontSize: "14px",
  },
  btnPrimary: {
    width: "100%",
    padding: "12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  btnSecondary: {
    padding: "12px 16px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  btnRed: {
    width: "100%",
    padding: "12px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "10px",
  },
  input: {
    flex: 1,
    padding: "12px",
    background: "#1e293b",
    color: "white",
    border: "1px solid #475569",
    borderRadius: "8px",
    fontSize: "14px",
  },
  locationInfo: {
    background: "#1e40af",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    fontSize: "13px",
    wordBreak: "break-word",
  },
};