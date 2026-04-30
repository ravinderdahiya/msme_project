import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Layers3, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axios';
import './LoginPage.css';

const initialSignupForm = {
    fullname: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
};

const NewSignup = () => {
    const navigate = useNavigate();
    const [signupForm, setSignupForm] = useState(initialSignupForm);
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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const nextValue = name === 'mobile' ? value.replace(/\D/g, '').slice(0, 10) : value;

        setSignupForm((currentForm) => ({
            ...currentForm,
            [name]: nextValue,
        }));
    };

    const handleSignup = async (event) => {
        event.preventDefault();

        if (signupForm.mobile.length !== 10) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        if (signupForm.password !== signupForm.confirmPassword) {
            toast.error('Password and confirm password must match');
            return;
        }

        try {
            const { confirmPassword, ...payload } = signupForm;
            const { data } = await axiosInstance.post('/user/signup', payload);
            toast.success(data.message || 'Account created successfully', { position: 'top-center' });
            setSignupForm(initialSignupForm);
            navigate('/LoginPage');
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Something went wrong', {
                position: 'top-center',
            });
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-bg-image" />
            <div className="login-bg-overlay" />

            <header className="login-topbar">
                <div className="topbar-brand">
                    <div className="topbar-brand-logos">
                        <div className="flip-logo topbar-flip-logo">
                            <div className="flip-logo-inner">
                                <div className="flip-logo-face">
                                    <img src="/HARSAC-Logo.png" alt="HARSAC logo" />
                                </div>
                                <div className="flip-logo-face flip-logo-back">
                                    <img src="/hepc-logo.png" alt="HEPC logo" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="topbar-brand-text">
                        <strong>MSME Investment GIS Portal</strong>
                        <span>Government of Haryana | HARSAC | HEPC</span>
                    </div>
                </div>

                <div className="topbar-meta">
                    <span>Investor Registration Platform</span>
                    <small>Create your access for land, infrastructure and GIS insights</small>
                </div>
            </header>

            <div className="login-container">
                <div className="login-copy">
                    <h1>
                        <span className="headline-light">{headlineLineOne}</span>
                        <span className="headline-accent">{headlineLineTwo}</span>
                    </h1>
                    <p>
                        Register to explore verified land parcels with GIS insights, analyze infrastructure,
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
                                            <img src="/HARSAC-Logo.png" alt="HARSAC logo" />
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
                                    <span className="sub-brand1">Official registration for investment mapping and analysis</span>
                                </div>
                            </div>
                        </div>

                        <div className="welcome-section">
                            <h2>Investor Sign Up</h2>
                            <p>Create your account to access government-backed MSME investment services</p>
                        </div>

                        <form className="login-form" onSubmit={handleSignup}>
                            <div className="input-field">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullname"
                                    placeholder="Enter full name"
                                    value={signupForm.fullname}
                                    onChange={handleInputChange}
                                    autoComplete="name"
                                    required
                                />
                            </div>

                            <div className="input-field">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={signupForm.email}
                                    onChange={handleInputChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="input-field">
                                <label>Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    placeholder="Enter mobile number"
                                    value={signupForm.mobile}
                                    onChange={handleInputChange}
                                    maxLength="10"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    required
                                />
                            </div>

                            <div className="input-field">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create password"
                                    value={signupForm.password}
                                    onChange={handleInputChange}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <div className="input-field">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={signupForm.confirmPassword}
                                    onChange={handleInputChange}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            <button type="submit" className="login-btn">Create Account</button>
                        </form>

                        <div className="signup-link">
                            Already have an account? <button type="button" onClick={() => navigate('/LoginPage')}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewSignup;
