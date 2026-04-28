import "./Login.css";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

export default function Login() {
    const navigate = useNavigate();
    const [showOTP, setShowOTP] = useState(false); // OTP field control karne ke liye
    const [mobileNumber, setMobileNumber] = useState("");
    // const [otp, setOtp] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);

    // Pehla step: OTP mangwane ke liye
    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (mobileNumber.length === 10) {
            // Yahan aap apni API call kar sakte hain OTP bhejne ke liye
            toast.info("OTP sent to your mobile number", { position: "top-center" });
            setShowOTP(true); // OTP field dikhao
        } else {
            toast.error("Please enter a valid 10-digit mobile number");
        }
    };

    // Doosra step: Login karne ke liye
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Yahan aap OTP verify karne ki API call karenge
            console.log("Logging in with:", mobileNumber, otp);
            // Temporary navigation for testing
            navigate('/msme-gis-map');
        } catch (err) {
            toast.error("Invalid OTP", { position: "top-center" });
        }
    };
    // हैंडलर: एक बॉक्स से दूसरे पर ऑटो-फोकस करने के लिए
const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // अगर वैल्यू डाली गई है, तो अगले बॉक्स पर फोकस करें
    if (element.nextSibling && element.value) {
        element.nextSibling.focus();
    }
};

    return (
        <div className="page-wrapper">
            <div className="hero-container">
                <div className="hero-content">
                    {/* Left Section: Text */}
                    <div className="left-section">
                        <h1 className="hero-title">
                            Unlock Business Growth <br /> with GIS Insights!
                        </h1>
                        <p className="hero-description">
                            Utilize GIS technology to find the most suitable land for your investment.
                        </p>
                        <div className="features-list">
                            <div className="feature-item">
                                <span className="check-badge">✓</span>
                                <span>Analyze land and investment opportunities</span>
                            </div>
                            <div className="feature-item">
                                <span className="check-badge">✓</span>
                                <span>Identify prime industrial zones</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Login Card */}
                    <div className="right-section">
                        <div className="login-card">
                            <div className="left-logo">
                                <img src="/hepc-logo.png" alt="logo" />
                            </div>
                            <h2>Welcome to <br /><b>MSME Investor Portal</b></h2>
                            <p className="sub-text">One stop solution for MSME Investors</p>

                            <form className="login-form">
                                {/* Mobile Number Field */}
                                <div className="mobile-input-container">
                                    {/* <span className="country-code">+91 ⌵</span> */}
                                    <input
                                        type="text"
                                        placeholder="Enter Mobile Number"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        disabled={showOTP} // OTP aane ke baad field lock ho jaye
                                        maxLength="10"
                                    />
                                </div>

                                {/* OTP Field: Sirf tab dikhega jab showOTP true hoga */}
                                {showOTP && (
                                    <div className="otp-container otp-animation">
                                        {otp.map((data, index) => {
                                            return (
                                                <input
                                                    className="otp-box"
                                                    type="text"
                                                    name="otp"
                                                    maxLength="1"
                                                    key={index}
                                                    value={data}
                                                    onChange={e => handleOtpChange(e.target, index)}
                                                    onFocus={e => e.target.select()}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                                {/* Button Logic Change */}
                                {!showOTP ? (
                                    <button type="button" className="login-button" onClick={handleSendOTP}>
                                        Send OTP
                                    </button>
                                ) : (
                                    <button type="submit" className="login-button" onClick={handleLogin}>
                                        Login
                                    </button>
                                )}

                                {/* <p className="signup-text">
                                    New to the portal? 
                                    <span onClick={() => navigate('/Signup')}> Register Now</span>
                                </p> */}
                                <p className="signup-text">
                                   New to the portal?
                                    <span
                                        style={{ cursor: 'pointer', color: '#4ade80', fontWeight: 'bold' }}
                                        onClick={() => navigate('/Signup')}
                                    >
                                       Register now
                                    </span>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}