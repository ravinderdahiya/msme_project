import React, { useEffect, useRef, useState } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
// import videoFile from "../../public/videos/gis-video.mp4";


const data = [
    { title: "Industrial Zone", img: "/zone.png" },
    { title: "Road Network", img: "/road.png" },
    { title: "Water Supply", img: "watersuppply.png" },
    { title: "Electricity Grid", img: "electricity.jpg" },
    { title: "Environmental Data", img: "environment.png" },
    { title: "Nearby Facilities", img: "facilites.png" },
    { title: "Water Supply", img: "watersuppply.png" },
    { title: "Electricity Grid", img: "electricity.jpg" },
    { title: "Environmental Data", img: "environment.png" },
    { title: "Nearby Facilities", img: "facilites.png" },
];

const steps = [
    {
        no: "1",
        title: "Search Location",
        img: "/landicon.jpg",
    },
    {
        no: "2",
        title: "View Map",
        img: "/road.png",
    },
    {
        no: "3",
        title: "Analyze Data",
        img: "/insight.png",
    },
    {
        no: "4",
        title: "Download Report",
        img: "/desicion.png",
    },
];

const features = [
    {
        icon: "📍",
        title: "Smart Location Analysis",
        desc: "Analyze land based on location and connectivity."
    },
    {
        icon: "⚡",
        title: "Fast Decision Making",
        desc: "Quick insights to make better investment decisions."
    },
    {
        icon: "🌍",
        title: "GIS Powered Data",
        desc: "Advanced GIS data for accurate land evaluation."
    },
    {
        icon: "📊",
        title: "Accurate Reports",
        desc: "Get detailed and reliable reports instantly."
    }
];


export default function HomePage() {
    const navigate = useNavigate();
    const sliderRef = useRef(null);


    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        const slider = sliderRef.current;

        const interval = setInterval(() => {
            if (slider) {
                slider.scrollLeft += 300;

                // Infinite loop reset
                if (
                    slider.scrollLeft + slider.clientWidth >=
                    slider.scrollWidth
                ) {
                    slider.scrollLeft = 0;
                }
            }
        }, 2000); // speed

        return () => clearInterval(interval);
    }, []);


    return (

        <>
            <div className="top-header">


                <div className="left-logo">
                    <img src="/har_govt.png" alt="logo" />
                </div>


                <div className="header-text">
                    <h3>MSME GIS-Based Land & Investment Platform</h3>
                    <p>Department of Industries & Commerce, Haryana</p>
                </div>


                <div className="right-logo">
                    <img src="/hepc-logo.png" alt="logo" />
                </div>

            </div>
            <div className="navbar">


                <div className="nav-links">
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Contact</a>
                    <a href="#">Help us</a>
                </div>


            </div>

            {/* <div className="home">
                <div className="hero">
                    <div className="overlay"></div>
                    <div className="blur-layer"></div>
                    <div className="search-box disabled">
                        <input type="text" placeholder="Search Location..." disabled />
                        <button disabled>Search</button>
                    </div>
                    <button
                        className="login-message-btn"
                        onClick={() => setShowModal(true)}
                    >
                        Please login to search location
                    </button>
                    {showModal && (
                        <div className="modal-overlay">
                            <div className="modal big-modal">                            
                                <span
                                    className="close-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    ✖
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="side-icons">
                        <div className="icon">📞</div>
                        <div className="icon">🛣️</div>
                        <div className="icon">💧</div>
                        <div className="icon">⚡</div>
                    </div>
                </div>
            </div> */}

            <div className="info-section">
                {/* LEFT TEXT */}
                <div className="info-text">
                    <h2>Choosing the Right Location</h2>
                    <p className="main-desc">
                        Make informed and strategic decisions for industrial investment using advanced GIS-based land analysis tools.
                        This platform helps investors identify the most suitable locations based on multiple critical parameters.
                    </p>
                    {/* Feature Points */}
                    <div className="info-points">
                        <div className="point">
                            <span>📍</span>
                            <p>Identify prime industrial zones based on location advantages and connectivity.</p>
                        </div>
                        <div className="point">
                            <span>🛣️</span>
                            <p>Analyze road networks and accessibility to highways, transport hubs, and logistics corridors.</p>
                        </div>
                        <div className="point">
                            <span>⚡</span>
                            <p>Evaluate availability of essential infrastructure like electricity, water supply, and utilities.</p>
                        </div>
                        <div className="point">
                            <span>🌱</span>
                            <p>Assess environmental conditions including green zones, pollution levels, and sustainability factors.</p>
                        </div>
                        <div className="point">
                            <span>🏢</span>
                            <p>Explore nearby facilities such as banks, hospitals, workforce availability, and industrial clusters.</p>
                        </div>
                        <div className="point">
                            <span>📊</span>
                            <p>Generate accurate reports and insights to support data-driven investment decisions.</p>
                        </div>
                        <div>
                            <p className="login-note">
                                To explore land and location details, please login first
                            </p>
                        </div>
                        <div className="info-btn-wrapper">

                            <button
                                className="login-btn"
                            // onClick={() => setShowModal(true)}
                            onClick={() => navigate("/Login")}
                            >
                                Login to search location
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT VIDEO */}
                <div className="info-video">
                    <video autoPlay loop muted playsInline>
                        <source src="/videos/gis-video.mp4" type="video/mp4" />
                    </video>
                </div>

            </div>
            <div className="about-section">
                <h2>About the Platform</h2>

                <div className="slider-wrapper" ref={sliderRef}>
                    <div className="card-grid">
                        {data.map((item, index) => (
                            <div className="card" key={index}>
                                <img src={item.img} alt={item.title} />
                                <div className="card-title">{item.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="why-section">
                <h2>Why Choose This Platform</h2>

                <div className="why-grid">
                    {features.map((item, index) => (
                        <div className="why-card" key={index}>
                            <div className="why-icon">{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="how-section">

                <h2>How It Works</h2>

                <div className="steps">
                    {steps.map((step, index) => (
                        <div className="step-card" key={index}>

                            {/* Number Circle */}
                            <div className="step-number">{step.no}</div>

                            {/* Title */}


                            {/* Image */}
                            <img src={step.img} alt={step.title} />
                            <h3>{step.title}</h3>

                        </div>
                    ))}
                </div>

            </div>
            <footer className="footer">

                <div className="footer-container">

                    {/* Column 1 */}
                    <div className="footer-col">
                        <h3>MSME GIS Platform</h3>
                        <p>
                            A GIS-based land and investment platform that helps investors find
                            suitable land using location-based data and analysis.
                        </p>
                    </div>

                    {/* Column 2 */}
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li>Home</li>
                            <li>About</li>
                            <li>Map</li>
                            <li>Contact</li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="footer-col">
                        <h4>GIS Layers</h4>
                        <ul>
                            <li>Industrial Zones</li>
                            <li>Road Network</li>
                            <li>Water Supply</li>
                            <li>Electricity Grid</li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div className="footer-col">
                        <h4>Contact</h4>
                        <ul>
                            <li>Email: info@msme.gov</li>
                            <li>Phone: +91 9876543210</li>
                            <li>Location: Haryana, India</li>
                        </ul>
                    </div>

                </div>

                {/* Bottom */}
                <div className="footer-bottom">
                    © 2025 MSME GIS Platform | All Rights Reserved
                </div>

            </footer>
        </>



    );
}





