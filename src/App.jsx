import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Homepage from "./pages/Homepage";
import NewHomepage from "./pages/NewHomepage";
import NewMainMap from "./pages/NewMainMap";
import Login from "./pages/Login.jsx";

// import MSMEMapPage from "./pages/MSMEMapPage.jsx";

import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import NewAdmin from "./newadmin/NewAdmin.jsx";

import NewAdminPage from "./pages/NewAdminPage.jsx";

import "./App.css";

// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import Haryana_map from "./components/Haryana_map";
// import Sidebar from "../src/components/Sidebar";
// import { useState } from "react";
import MSMEMapPage from "./pages/MSMEMapPage.jsx";
import NotFound from "./components/InfoCards";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// import LoginPage from "./pages/LoginPage";


const HaryanaDemoMap = lazy(() => import("./pages/HaryanaDemoMap"));

function App() {
    const [filters] = useState({
        country: "",
        state: "",
        district: "",
        village: "",
        currentLocation: "",
    });

    void filters;


    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<MSMEMapPage />} />
                    <Route path="/home" element={<Homepage />} />
                    <Route path="/newhomepage" element={<NewHomepage />} />
                    <Route path="/newmainmap/select-land" element={<NewMainMap />} />
                    <Route path="/newmainmap/layers" element={<NewMainMap />} />
                    <Route path="/newmainmap/analysis" element={<NewMainMap />} />
                    <Route path="/newmainmap/nearby-places" element={<NewMainMap />} />
                    <Route path="/newmainmap/buffer" element={<NewMainMap />} />
                    <Route path="/newmainmap" element={<NewMainMap />} />
                    <Route path="/msme-gis-map" element={<Navigate to="/" replace />} />
                    <Route path="/demo-map" element={<HaryanaDemoMap />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/newadmin/login" element={<NewAdminPage />} />
                    <Route
                      path="/newadmin/*"
                      element={
                        <ProtectedRoute requiredRoles={["admin", "superadmin"]}>
                          <NewAdmin />
                        </ProtectedRoute>
                      }
                    />
            
                </Routes>
            </Suspense>
            <ToastContainer />
        </BrowserRouter>
    );

}

export default App;
