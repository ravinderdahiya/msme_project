import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Layers3, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import './LoginPage.css';

const LoginPage = () => {
   const navigate =  useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const otpRefs = useRef([]);
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

    const handleMobileChange = (event) => {
        const value = event.target.value.replace(/\D/g, '').slice(0, 10);
        setMobileNumber(value);
    };

    const handleSendOtp = (event) => {
        event.preventDefault();

        if (mobileNumber.length !== 10) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        setShowOtp(true);
        toast.info('OTP sent to your mobile number', { position: 'top-center' });
        setTimeout(() => otpRefs.current[0]?.focus(), 0);
    };

    const handleOtpChange = (event, index) => {
        const value = event.target.value.replace(/\D/g, '').slice(-1);
        const nextOtp = [...otp];
        nextOtp[index] = value;
        setOtp(nextOtp);

        if (value && index < otpRefs.current.length - 1) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (event, index) => {
        if (event.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (event) => {
        event.preventDefault();
        const pastedOtp = event.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 4)
            .split('');

        if (!pastedOtp.length) return;

        const nextOtp = [...otp];
        pastedOtp.forEach((digit, index) => {
            nextOtp[index] = digit;
        });
        setOtp(nextOtp);
        otpRefs.current[Math.min(pastedOtp.length, 4) - 1]?.focus();
    };

    const handleLogin = (event) => {
        event.preventDefault();

        if (otp.some((digit) => !digit)) {
            toast.error('Please enter the 4-digit OTP');
            return;
        }

        navigate('/msme-gis-map');
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
                                    <span className="sub-brand1">Official access for investment mapping and analysis</span>
                                </div>
                            </div>
                        </div>

                        <div className="welcome-section">
                            <h2>Investor Sign In</h2>
                            <p>Login to access government-backed MSME investment services and spatial insights</p>
                        </div>

                        <form className="login-form" onSubmit={showOtp ? handleLogin : handleSendOtp}>
                            <div className="input-field">
                                <label>Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="Enter mobile number"
                                    value={mobileNumber}
                                    onChange={handleMobileChange}
                                    maxLength="10"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    disabled={showOtp}
                                />
                            </div>

                            {showOtp && (
                                <div className="otp-field">
                                    <label>Enter OTP</label>
                                    <div className="otp-inputs">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(element) => {
                                                    otpRefs.current[index] = element;
                                                }}
                                                type="text"
                                                value={digit}
                                                onChange={(event) => handleOtpChange(event, index)}
                                                onKeyDown={(event) => handleOtpKeyDown(event, index)}
                                                onPaste={handleOtpPaste}
                                                onFocus={(event) => event.target.select()}
                                                maxLength="1"
                                                inputMode="numeric"
                                                autoComplete="one-time-code"
                                                aria-label={`OTP digit ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" /> Remember me
                                </label>
                                <a href="#" className="forgot-pass">Forgot Password?</a>
                            </div>

                            {/* <button type="submit" className="login-btn" onClick={navigate("/msme-gis-map")}>Login</button> */}
                            <button type="submit" className="login-btn">
                                {showOtp ? 'Login' : 'Send OTP'}
                            </button>

                        </form>

                        <div className="signup-link">
                            Don't have an account? <button type="button" onClick={() => navigate('/newsignup')}>Sign up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
