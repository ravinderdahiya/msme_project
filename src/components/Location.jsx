// import { useState, useEffect } from "react";
// // import "./Sidebar.css";

// function Location({ filters, setFilters }) {
//   const [manualCoords, setManualCoords] = useState("");
//   const [point1, setPoint1] = useState({ lat: "", lng: "", name: "" });
//   const [point2, setPoint2] = useState({ lat: "", lng: "", name: "" });
//   const [distance, setDistance] = useState(null);
//   const [showMeasure, setShowMeasure] = useState(false);
//   const [locationInfo, setLocationInfo] = useState({
//     lat: "",
//     lng: "",
//     accuracy: null,
//     address: "",
//     status: "idle"
//   });
//   const [trackingId, setTrackingId] = useState(null);
//   const [searchingPlace, setSearchingPlace] = useState(false);

//   // ================= FORWARD GEOCODING (NEW) =================
//   const forwardGeocode = async (query) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`
//       );
//       const data = await response.json();
//       if (data.length > 0) {
//         return {
//           lat: parseFloat(data[0].lat),
//           lng: parseFloat(data[0].lon),
//           display_name: data[0].display_name,
//           name: data[0].display_name.split(',')[0] // First part as name
//         };
//       }
//       return null;
//     } catch (error) {
//       console.error("Forward geocoding failed:", error);
//       return null;
//     }
//   };

//   // ================= REVERSE GEOCODING =================
//   const reverseGeocode = async (lat, lng) => {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`
//       );
//       const data = await response.json();
//       return data.display_name || "Unknown address";
//     } catch (error) {
//       console.error("Reverse geocoding failed:", error);
//       return "Address unavailable";
//     }
//   };

//   // ================= ACCURACY RATING =================
//   const getAccuracyRating = (accuracy) => {
//     if (accuracy < 20) return { emoji: "✅", text: "Excellent", color: "#10b981" };
//     if (accuracy < 50) return { emoji: "👍", text: "Good", color: "#059669" };
//     if (accuracy < 200) return { emoji: "⚠️", text: "Fair", color: "#d97706" };
//     return { emoji: "❌", text: "Poor", color: "#dc2626" };
//   };

//   // ================= CURRENT LOCATION (UNCHANGED) =================
//   const handleCurrentLocation = async () => {
//     if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
//       alert("🔒 Accurate GPS requires HTTPS (localhost OK for testing)");
//       return;
//     }

//     if (!navigator.geolocation) {
//       alert("❌ Geolocation not supported by this browser");
//       return;
//     }

//     setLocationInfo({ ...locationInfo, status: "fetching" });

//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude, longitude, accuracy } = pos.coords;
//         const address = await reverseGeocode(latitude, longitude);
//         const rating = getAccuracyRating(accuracy);

//         console.log("📍 GPS Success:", { latitude, longitude, accuracy, address });

//         setLocationInfo({
//           lat: latitude.toFixed(6),
//           lng: longitude.toFixed(6),
//           accuracy: accuracy.toFixed(0),
//           address,
//           rating,
//           status: "success"
//         });

//         if (accuracy < 100 || confirm(
//           `${rating.emoji} Accuracy: ${accuracy.toFixed(0)}m\n` +
//           `📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n` +
//           `🏠 ${address.substring(0, 60)}...\n\nAccept this location?`
//         )) {
//           setFilters((prev) => ({
//             ...prev,
//             currentLocation: `${latitude},${longitude}`,
//             locationAccuracy: accuracy,
//             locationAddress: address,
//           }));
//         }
//       },
//       (error) => {
//         console.error("❌ GPS Error:", error);
//         const errorMessages = {
//           1: "🚫 Location access denied\nFix: Settings → Privacy → Location → Allow",
//           2: "📴 Location unavailable\nFix: Enable GPS/WiFi/Bluetooth",
//           3: "⏰ Location timeout\nFix: Move outside, retry"
//         };
//         setLocationInfo({
//           ...locationInfo,
//           status: "error",
//           message: errorMessages[error.code] || "Unknown error"
//         });
//         alert(errorMessages[error.code] || "GPS error");
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 25000,
//         maximumAge: 10000,
//       }
//     );
//   };

//   // ================= LIVE TRACKING (UNCHANGED) =================
//   const startTracking = () => {
//     if (trackingId) {
//       navigator.geolocation.clearWatch(trackingId);
//       setTrackingId(null);
//       return;
//     }

//     const id = navigator.geolocation.watchPosition(
//       async (pos) => {
//         const { latitude, longitude } = pos.coords;
//         const address = await reverseGeocode(latitude, longitude);
        
//         setFilters((prev) => ({
//           ...prev,
//           currentLocation: `${latitude},${longitude}`,
//           locationAddress: address,
//         }));
        
//         setLocationInfo(prev => ({
//           ...prev,
//           lat: latitude.toFixed(6),
//           lng: longitude.toFixed(6),
//           address,
//           status: "tracking"
//         }));
//       },
//       (err) => console.error("Tracking error:", err),
//       { enableHighAccuracy: true }
//     );
    
//     setTrackingId(id);
//   };

//   // ================= MANUAL LOCATION - NOW SUPPORTS PLACE NAMES =================
//   const handleManualLocation = async () => {
//     const query = manualCoords.trim();
//     if (!query) {
//       alert("❌ Enter a place name or coordinates");
//       return;
//     }

//     setSearchingPlace(true);

//     // First try forward geocoding (place name)
//     let coords = await forwardGeocode(query);
    
//     // If no results, try parsing as coordinates
//     if (!coords) {
//       const coordParts = query.split(",").map(s => s.trim());
//       if (coordParts.length === 2) {
//         const [lat, lng] = coordParts.map(Number);
//         if (!isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
//           coords = {
//             lat,
//             lng,
//             display_name: `Manual: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
//             name: "Manual coordinates"
//           };
//         }
//       }
//     }

//     setSearchingPlace(false);

//     if (!coords) {
//       alert("❌ Place not found. Try a different name or use format: lat,lng");
//       return;
//     }

//     setFilters((prev) => ({
//       ...prev,
//       currentLocation: `${coords.lat},${coords.lng}`,
//       locationAddress: coords.display_name,
//     }));

//     setLocationInfo({
//       lat: coords.lat.toFixed(6),
//       lng: coords.lng.toFixed(6),
//       address: coords.display_name,
//       status: "manual",
//       accuracy: "Geocoded"
//     });
//   };

//   // ================= DISTANCE MEASUREMENT - NOW SUPPORTS PLACE NAMES =================
//   const handlePointSearch = async (point, setPoint) => {
//     setSearchingPlace(true);
//     const result = await forwardGeocode(point.name);
//     setSearchingPlace(false);

//     if (result) {
//       setPoint({
//         lat: result.lat.toFixed(6),
//         lng: result.lng.toFixed(6),
//         name: result.name
//       });
//     } else {
//       alert("❌ Place not found for this point");
//     }
//   };

//   const calculateDistance = () => {
//     const toRad = (v) => (v * Math.PI) / 180;
//     const lat1 = parseFloat(point1.lat);
//     const lon1 = parseFloat(point1.lng);
//     const lat2 = parseFloat(point2.lat);
//     const lon2 = parseFloat(point2.lng);

//     if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
//       alert("❌ Enter valid places or coordinates for both points");
//       return;
//     }

//     const R = 6371; // Earth radius in km

//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);
//     const a = 
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
//     const dist = (R * c).toFixed(2);
//     setDistance(dist);
//   };

//   // ================= CLEAR LOCATION =================
//   const clearLocation = () => {
//     setFilters(prev => ({ ...prev, currentLocation: "" }));
//     setLocationInfo({ lat: "", lng: "", accuracy: null, address: "", status: "idle" });
//   };

//   return (
//     <div className="location-panel">
//       <h3>📍 Location Tools</h3>

//       {/* CURRENT LOCATION */}
//       <div className="section">
//         <button className="btn blue full-width" onClick={handleCurrentLocation}>
//           🎯 Get My GPS Location
//         </button>

//         {/* LOCATION INFO */}
//         {locationInfo.status !== "idle" && (
//           <div className={`location-info ${locationInfo.status}`}>
//             <div style={{ fontSize: "12px", marginBottom: "5px" }}>
//               {locationInfo.status === "fetching" && "🔄 Getting GPS..."}
//               {locationInfo.status === "error" && "❌ Error:"}
//               {locationInfo.status === "tracking" && "📡 Tracking..."}
//               {searchingPlace && "🔍 Searching place..."}
//             </div>
//             {locationInfo.lat && (
//               <>
//                 <div style={{ fontSize: "14px", fontWeight: "bold" }}>
//                   📍 {locationInfo.lat}, {locationInfo.lng}
//                 </div>
//                 {locationInfo.accuracy && (
//                   <div style={{ 
//                     color: locationInfo.rating?.color || "#666",
//                     fontSize: "12px"
//                   }}>
//                     📏 {locationInfo.rating?.emoji} {locationInfo.accuracy}m
//                   </div>
//                 )}
//                 {locationInfo.address && (
//                   <div style={{ fontSize: "11px", opacity: 0.8 }}>
//                     🏠 {locationInfo.address}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )}

//         {/* TRACKING */}
//         <button 
//           className={`btn orange full-width ${trackingId ? "btn-danger" : ""}`}
//           onClick={startTracking}
//         >
//           {trackingId ? "🛑 Stop Tracking" : "📡 Start Live Tracking"}
//         </button>

//         {/* MANUAL INPUT - NOW PLACE NAMES */}
//         <div className="row" style={{ marginTop: "10px" }}>
//           <input
//             placeholder="Eiffel Tower, Paris or 40.7128,-74.0060"
//             value={manualCoords}
//             onChange={(e) => setManualCoords(e.target.value)}
//             className="input"
//           />
//           <button 
//             className="btn green" 
//             onClick={handleManualLocation}
//             disabled={searchingPlace}
//           >
//             {searchingPlace ? "🔍" : "📍 Set Location"}
//           </button>
//         </div>

//         {filters.currentLocation && (
//           <button className="btn red full-width" onClick={clearLocation} style={{ marginTop: "5px" }}>
//             ❌ Clear Location
//           </button>
//         )}
//       </div>

//       {/* MEASURE DISTANCE */}
//       <div className="section">
//         <button
//           className="btn orange full-width"
//           onClick={() => setShowMeasure(!showMeasure)}
//         >
//           📏 Measure Distance {showMeasure ? "−" : "+"}
//         </button>

//         {showMeasure && (
//           <div className="measureBox">
//             {/* POINT 1 */}
//             <div style={{ marginBottom: "10px" }}>
//               <div style={{ fontSize: "12px", marginBottom: "5px", fontWeight: "bold" }}>📍 Point 1</div>
//               <div className="row">
//                 <input
//                   placeholder="Eiffel Tower, Paris"
//                   value={point1.name}
//                   onChange={(e) => setPoint1({ ...point1, name: e.target.value, lat: "", lng: "" })}
//                   className="input"
//                 />
//                 <button 
//                   className="btn blue small" 
//                   onClick={() => handlePointSearch(point1, setPoint1)}
//                   disabled={searchingPlace}
//                 >
//                   🔍
//                 </button>
//               </div>
//               {point1.lat && (
//                 <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "3px" }}>
//                   📍 {point1.lat}, {point1.lng}
//                 </div>
//               )}
//             </div>

//             {/* POINT 2 */}
//             <div style={{ marginBottom: "10px" }}>
//               <div style={{ fontSize: "12px", marginBottom: "5px", fontWeight: "bold" }}>📍 Point 2</div>
//               <div className="row">
//                 <input
//                   placeholder="Times Square, NYC"
//                   value={point2.name}
//                   onChange={(e) => setPoint2({ ...point2, name: e.target.value, lat: "", lng: "" })}
//                   className="input"
//                 />
//                 <button 
//                   className="btn blue small" 
//                   onClick={() => handlePointSearch(point2, setPoint2)}
//                   disabled={searchingPlace}
//                 >
//                   🔍
//                 </button>
//               </div>
//               {point2.lat && (
//                 <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "3px" }}>
//                   📍 {point2.lat}, {point2.lng}
//                 </div>
//               )}
//             </div>

//             <button className="btn green full-width" onClick={calculateDistance} disabled={searchingPlace}>
//               Calculate Distance
//             </button>
//             {distance && (
//               <div style={{ 
//                 marginTop: "10px", 
//                 padding: "8px", 
//                 background: "#10b981", 
//                 color: "white", 
//                 borderRadius: "4px",
//                 textAlign: "center",
//                 fontWeight: "bold"
//               }}>
//                 📏 {distance} KM
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Location;