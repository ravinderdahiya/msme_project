import React, { useState } from 'react';
import { BarChart3, FileText, Layers3, MapPin } from 'lucide-react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
   const navigate =  useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const headlineLineOne = '\u0938\u0939\u0940 \u092d\u0942\u092e\u093f, \u0938\u0939\u0940 \u0928\u093f\u0935\u0947\u0936,';
    const headlineLineTwo = '\u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u092d\u0935\u093f\u0937\u094d\u092f';
    const featureItems = [
        {
            title: 'Smart Land Search',
            description: 'Find the best land based on location.',
            icon: <MapPin size={24} />,
        },
        {
            title: 'GIS Layer Analysis',
            description: 'Analyze map layers for smarter investment planning.',
            icon: <Layers3 size={24} />,
        },
        {
            title: 'Data Driven Decisions',
            description: 'Compare infrastructure and opportunities with confidence.',
            icon: <BarChart3 size={24} />,
        },
        {
            title: 'Reports & Insights',
            description: 'Generate clear reports for faster project evaluation.',
            icon: <FileText size={24} />,
        },
    ];

    return (
        <div className="login-wrapper">
            <div className="login-bg-image" />
            <div className="login-bg-overlay" />

            <header className="login-topbar">
                <div className="topbar-brand">
                    <div className="topbar-brand-logos">
                        <div className="topbar-logo-circle">
                            <img src="/har_govt.png" alt="Government of Haryana" />
                        </div>
                    </div>
                    <div className="topbar-brand-text">
                        <strong>MSME Investment GIS Portal</strong>
                        <span>Government of Haryana | HARSAC | HEPC</span>
                    </div>
                </div>

                <div className="topbar-meta">
                    <span>Investor Facilitation Platform</span>
                    <small>Industrial land, infrastructure and spatial intelligence</small>
                </div>
            </header>

            <div className="login-container">
                <div className="login-copy">
                    {/* <div className="copy-badge">Government of Haryana MSME Investment Portal</div> */}
                    <h1>
                        <span className="headline-light">{headlineLineOne}</span>
                        <span className="headline-accent">{headlineLineTwo}</span>
                    </h1>
                    <p>
                        Explore verified land parcels with GIS insights, analyze infrastructure,
                        and make smarter investment decisions through the official Haryana MSME
                        digital platform.
                    </p>

                    <div className="feature-list">
                        {featureItems.map((item) => (
                            <div key={item.title} className="feature-item">
                                <div className="feature-icon">{item.icon}</div>
                                <div className="feature-copy">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-column">
                    <div className="login-card1">
                        <div className="form-header1">
                            <div className="form-brandmark">
                                <div className="flip-logo">
                                    <div className="flip-logo-inner">
                                        <div className="flip-logo-face">
                                            <img src="/har_govt.png" alt="Government of Haryana" />
                                        </div>
                                        <div className="flip-logo-face flip-logo-back">
                                            <img src="/hepc-logo.png" alt="HEPC logo" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="portal-logo1">
                                <div className="logo-text1">
                                    <span className="brand1">MSME Investment GIS Portal</span>
                                    <span className="sub-brand1">Official access for investment mapping and analysis</span>
                                </div>
                            </div>
                        </div>

                        <div className="welcome-section">
                            <h2>Investor Sign In</h2>
                            <p>Login to access government-backed MSME investment services and spatial insights</p>
                        </div>

                        <form className="login-form">
                            <div className="input-field">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="input-field">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" /> Remember me
                                </label>
                                <a href="#" className="forgot-pass">Forgot Password?</a>
                            </div>

                            <button type="submit" className="login-btn" onClick={navigate("/msme-gis-map")}>Login</button>
                        </form>

                        <div className="signup-link">
                            Don&apos;t have an account? <a href="#">Sign up</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
