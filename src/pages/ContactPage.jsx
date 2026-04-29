import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BarChart3,
    BookOpen,
    Clock,
    FileText,
    Layers3,
    Mail,
    MapPin,
    Menu,
    Moon,
    Phone,
    Send,
} from 'lucide-react';
import { toast } from 'react-toastify';
import './ContactPage.css';

const stats = [
    { icon: <BookOpen size={22} />, value: '2,500+', label: 'Land Parcels' },
    { icon: <Layers3 size={22} />, value: '24+', label: 'Data Layers' },
    { icon: <BarChart3 size={22} />, value: '500+', label: 'Analyses Done' },
    { icon: <FileText size={22} />, value: '100+', label: 'Reports Generated' },
];

const contactItems = [
    { icon: <Phone size={20} />, label: '+91 12345 67890' },
    { icon: <Mail size={20} />, label: 'support@msmeinvestorgis.in' },
    { icon: <MapPin size={20} />, label: 'HARSAC, CCS HAU Campus, Hisar, Haryana' },
    { icon: <Clock size={20} />, label: 'Mon - Fri: 9:00 AM - 6:00 PM' },
];

const BrandLogo = () => (
    <div className="cp-flip-logo" aria-hidden="true">
        <div className="cp-flip-logo-inner">
            <div className="cp-flip-logo-face">
                <img src="/hepc-logo.png" alt="" />
            </div>
            <div className="cp-flip-logo-face cp-flip-logo-back">
                <img src="/HARSAC-Logo.png" alt="" />
            </div>
        </div>
    </div>
);

export default function ContactPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        toast.success('Message sent successfully', { position: 'top-center' });
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page">
            <header className="cp-header">
                <Link to="/newhomepage" className="cp-brand">
                    <BrandLogo />
                    <div>
                        <strong>MSME</strong>
                        <span>INVESTOR GIS</span>
                    </div>
                </Link>

                <nav className="cp-nav">
                    <Link to="/newhomepage">Home</Link>
                    <Link to="/msme-gis-map">Map</Link>
                    <a href="#">Analysis</a>
                    <a href="#">Reports</a>
                    <Link to="/about">About Us</Link>
                    <Link to="/contact" className="active">Contact</Link>
                </nav>

                <div className="cp-actions">
                    <button type="button" className="cp-icon-btn" aria-label="Theme">
                        <Moon size={18} />
                    </button>
                    <button type="button" className="nh-btn nh-btn-ghost" onClick={() => navigate('/LoginPage')}>Login</button>
                    <button type="button" className="nh-btn nh-btn-ghost" onClick={() => navigate('/newsignup')}>Sign Up</button>
                    <button type="button" className="cp-menu-btn" aria-label="Menu">
                        <Menu size={20} />
                    </button>
                </div>
            </header>

            <main>
                <section className="cp-hero">
                    <div className="cp-hero-copy">
                        <span>Contact Us</span>
                        <h1>We'd Love to Hear From You</h1>
                        <p>
                            Have questions about land parcels, GIS layers, reports or investor support?
                            Send your query and our team will get back to you.
                        </p>

                        <div className="cp-contact-list">
                            {contactItems.map((item) => (
                                <div key={item.label} className="cp-contact-item">
                                    <div>{item.icon}</div>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="cp-hero-visual">
                        <img src="/images/haryanamap.png" alt="GIS land parcel overview" />
                        <div className="cp-map-overlay" />
                        <div className="cp-map-pin">
                            <MapPin size={42} />
                        </div>
                    </div>
                </section>

                <section className="cp-stat-card" aria-label="Platform statistics">
                    {stats.map((stat) => (
                        <div key={stat.label} className="cp-stat-item">
                            <div className="cp-stat-icon">{stat.icon}</div>
                            <div>
                                <strong>{stat.value}</strong>
                                <span>{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="cp-form-section">
                    <div className="cp-form-copy">
                        <span>Send Message</span>
                        <h2>Tell Us How We Can Help</h2>
                        <p>
                            Share your requirement, feedback or support request. The form is optimized
                            for desktop and mobile users.
                        </p>
                    </div>

                    <form className="cp-contact-form" onSubmit={handleSubmit}>
                        <div className="cp-form-row">
                            <label>
                                <span>Your Name</span>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                <span>Email Address</span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>

                        <label>
                            <span>Subject</span>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Enter subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            <span>Message</span>
                            <textarea
                                name="message"
                                placeholder="Write your message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="6"
                                required
                            />
                        </label>

                        <button type="submit" className="cp-submit-btn">
                            <span>Send Message</span>
                            <Send size={18} />
                        </button>
                    </form>
                </section>
            </main>

            <footer className="cp-footer">
                <div className="cp-footer-grid">
                    <div className="cp-footer-brand">
                        <div className="cp-brand cp-footer-brand-logo">
                            <BrandLogo />
                            <div>
                                <strong>MSME</strong>
                                <span>INVESTOR GIS</span>
                            </div>
                        </div>
                        <p>
                            A smart GIS platform to discover land opportunities, analyze surroundings,
                            and make data-driven investment decisions.
                        </p>
                    </div>

                    <div>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/newhomepage">Home</Link></li>
                            <li><Link to="/msme-gis-map">Map</Link></li>
                            <li><a href="#">Analysis</a></li>
                            <li><a href="#">Reports</a></li>
                            <li><Link to="/about">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Platform</h4>
                        <ul>
                            <li><a href="#">Explore Map</a></li>
                            <li><a href="#">Data Layers</a></li>
                            <li><a href="#">Proximity Analysis</a></li>
                            <li><a href="#">Reports & Insights</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Contact Us</h4>
                        <ul>
                            <li>+91 12345 67890</li>
                            <li>support@msmeinvestorgis.in</li>
                            <li>HARSAC, Hisar, Haryana</li>
                        </ul>
                    </div>
                </div>
                <div className="cp-footer-bottom">© 2024 MSME Investor GIS. All rights reserved.</div>
            </footer>
        </div>
    );
}
