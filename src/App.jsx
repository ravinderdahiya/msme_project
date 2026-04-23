import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import 'remixicon/fonts/remixicon.css'
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./routes/ProtectedRoute";
import Admin from "./admin/Admin";

import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import Haryana_map from "./components/Haryana_map";
import Header from "./components/Header.jsx"
import Sidebar from "../src/components/Sidebar"
import { useState } from "react";
import MSMEMapPage from "./pages/MSMEMapPage.jsx";

//import Main from "./Main";

// lazy load demo map
const HaryanaDemoMap = lazy(() => import("./pages/HaryanaDemoMap"));

function App() {
   const [filters, setFilters] = useState({
    country: "",
    state: "",
    district: "",
    village: "",
    currentLocation: ""
  });
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* 1. STARTING PAGE: Jab user website khole, Homepage dikhe */}
          <Route path="/" element={<Homepage />} />


          {/* 2. PROTECTED ROUTES (Sirf Login ke baad dikhenge) */}
          <Route
            path="/Admin"
            element={
              // <ProtectedRoute>
                <Admin />
              // </ProtectedRoute>
            }
          />
        

        <Route path="/msme-gis-map" element={<MSMEMapPage />} />

          <Route
            path="/demo-map"
            element={
              // <ProtectedRoute>
                <HaryanaDemoMap />
              // </ProtectedRoute>
            }
          />
         
          {/* 3. OTHER PAGES */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Agar aap purana link preserve rakhna chahte hain */}
          <Route path="/" element={<Navigate to="/" replace />} />

          {/* 4. FALLBACK: Agar koi galat URL daale toh Login par bhej do */}
          {/* <Route path="*" element={<Navigate to="/Login" replace />} /> */}

        </Routes>
      </Suspense>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;