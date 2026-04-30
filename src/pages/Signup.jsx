import axiosInstance from "../api/axios";
import "./Signup.css";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
    const navigate = useNavigate();

    const model = {
        fullname: "fdsg",
        email: "abc@gmail.com",
        password: "1234123",
        mobile: "9090909090"
    };

    const [signupForm, setSignupForm] = useState(model);

    const handleInput = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        setSignupForm({
            ...signupForm,
            [name]: value
        });
    };

    const signup = async (e) => {
        try {
            e.preventDefault();
            console.log(signupForm);
            const { data } = await axiosInstance.post("/user/signup", signupForm);
            toast.success(data.message, { position: "top-center" });
            navigate("/login");
        } catch (err) {
            const message = err.response?.data?.message || "Something went wrong";
            console.log(message);
            toast.error(err.response ? err.response.data.message : err.message, {
                position: "top-center"
            });
        } finally {
            setSignupForm(model);
        }
    };

    return (
        <>
            <div className="page-wrapper">
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="left-section">
                            <h1 className="hero-title">
                                Unlock Business Growth <br /> with GIS Insights!
                            </h1>
                            <p className="hero-description">
                                Utilize GIS technology to find the most suitable land with optimal
                                connectivity, infrastructure and resources for your investment
                                and business expansion.
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
                                <div className="feature-item">
                                    <span className="check-badge">✓</span>
                                    <span>Make informed site selection decisions</span>
                                </div>
                            </div>
                        </div>

                        <div className="right-section">
                            <div className="login-card">
                                <div className="left-logo">
                                    <div className="signup-flip-logo">
                                        <div className="signup-flip-logo-inner">
                                            <div className="signup-flip-logo-face">
                                                <img src="/HARSAC-Logo.png" alt="HARSAC logo" />
                                            </div>
                                            <div className="signup-flip-logo-face signup-flip-logo-back">
                                                <img src="/hepc-logo.png" alt="HEPC logo" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h2>Sign Up to Your Account</h2>

                                <form className="login-form" onSubmit={signup}>
                                    <div className="input-field">
                                        <i className="fa-solid fa-user"></i>
                                        <input
                                            type="text"
                                            name="fullname"
                                            value={signupForm.fullname}
                                            onChange={handleInput}
                                            placeholder="Enter your fullname"
                                            required
                                        />
                                    </div>

                                    <div className="input-field">
                                        <i className="fa-solid fa-user"></i>
                                        <input
                                            type="email"
                                            name="email"
                                            value={signupForm.email}
                                            onChange={handleInput}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div className="input-field">
                                        <i className="fa-solid fa-lock"></i>
                                        <input
                                            type="password"
                                            name="password"
                                            value={signupForm.password}
                                            onChange={handleInput}
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>

                                    <div className="input-field">
                                        <i className="fa-solid fa-lock"></i>
                                        <input
                                            type="number"
                                            name="mobile"
                                            value={signupForm.mobile}
                                            onChange={handleInput}
                                            placeholder="Enter your mob no."
                                            required
                                        />
                                    </div>

                                    <div className="form-options">
                                        <label className="checkbox-container">
                                            <input type="checkbox" required />
                                            <span className="checkmark"></span>
                                            I agree to the Terms & Conditions
                                        </label>
                                    </div>

                                    <button type="submit" className="login-button">Create Acount</button>

                                    <p className="signup-text">
                                        Already have an account?
                                        <span
                                            style={{ cursor: 'pointer', color: '#4ade80', fontWeight: 'bold' }}
                                            onClick={() => navigate('/Login')}
                                        >
                                            Login
                                        </span>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
