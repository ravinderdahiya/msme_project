import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Homepage from "./pages/Homepage";
import NewHomepage from "./pages/NewHomepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./admin/Admin";
// import MSMEMapPage from "./pages/MSMEMapPage.jsx";
import LoginPage from "./pages/LoginPage";
import NewSignup from "./pages/NewSignup";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import NewAdmin from "./newadmin/NewAdmin.jsx";

import "./App.css";

// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import Haryana_map from "./components/Haryana_map";
import Header from "./components/Header.jsx"
import Sidebar from "../src/components/Sidebar"
// import { useState } from "react";
import MSMEMapPage from "./pages/MSMEMapPage.jsx";
import NotFound from "./components/InfoCards";
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
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/newhomepage" element={<NewHomepage />} />
                    <Route path="/Admin" element={<Admin />} />
                    <Route path="/newadmin/*" element={<NewAdmin />} />
                    <Route path="/msme-gis-map" element={<MSMEMapPage />} />
                    <Route path="/demo-map" element={<HaryanaDemoMap />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/newsignup" element={<NewSignup />} />
                    <Route path="/LoginPage" element={<LoginPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
            <ToastContainer />
        </BrowserRouter>
    );

}

export default App;
