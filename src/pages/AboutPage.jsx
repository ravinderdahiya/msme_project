import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    CheckCircle2,
    Eye,
    FileText,
    Gem,
    Layers3,
    Mail,
    MapPin,
    Menu,
    Moon,
    Phone,
    Target,
    UsersRound,
} from 'lucide-react';
import './AboutPage.css';

const values = [
    'Accuracy & Reliability',
    'Innovation & Excellence',
    'Transparency & Integrity',
    'Customer Success',
];

const impactStats = [
    { icon: <BookOpen size={23} />, value: '2,500+', label: 'Land Parcels Mapped' },
    { icon: <Layers3 size={23} />, value: '24+', label: 'Data Layers Available' },
    { icon: <BarChart3 size={23} />, value: '500+', label: 'Analyses Completed' },
    { icon: <FileText size={23} />, value: '100+', label: 'Reports Generated' },
    { icon: <UsersRound size={23} />, value: '1,000+', label: 'Happy Users' },
];

const team = [
    { name: 'Rahul Verma', role: 'Founder & CEO', initials: 'RV' },
    { name: 'Priya Sharma', role: 'Head of Geospatial', initials: 'PS' },
    { name: 'Amit Kumar', role: 'Lead Data Scientist', initials: 'AK' },
    { name: 'Neha Gupta', role: 'Product Manager', initials: 'NG' },
];

const BrandLogo = () => (
    <div className="ap-flip-logo" aria-hidden="true">
        <div className="ap-flip-logo-inner">
            <div className="ap-flip-logo-face">
                <img src="/hepc-logo.png" alt="" />
            </div>
            <div className="ap-flip-logo-face ap-flip-logo-back">
                <img src="/HARSAC-Logo.png" alt="" />
            </div>
        </div>
    </div>
);

export default function AboutPage() {
    const navigate = useNavigate();

    return (
        <div className="about-page">
            <header className="ap-header">
                <Link to="/newhomepage" className="ap-brand">
                    <BrandLogo />
                    <div>
                        <strong>MSME</strong>
                        <span>INVESTOR GIS</span>
                    </div>
                </Link>

                <nav className="ap-nav">
                    <Link to="/newhomepage">Home</Link>
                    <Link to="/msme-gis-map">Map</Link>
                    <a href="#">Analysis</a>
                    <a href="#">Reports</a>
                    <Link to="/about" className="active">About Us</Link>
                    <Link to="/contact">Contact</Link>
                </nav>

                <div className="ap-actions">
                    <button type="button" className="ap-icon-btn" aria-label="Theme">
                        <Moon size={18} />
                    </button>
                    <button type="button" className="nh-btn nh-btn-ghost" onClick={() => navigate('/LoginPage')}>Login</button>
                    <button type="button" className="nh-btn nh-btn-ghost" onClick={() => navigate('/newsignup')}>Sign Up</button>
                    <button type="button" className="ap-menu-btn" aria-label="Menu">
                        <Menu size={20} />
                    </button>
                </div>
            </header>

            <main>
                <section className="ap-hero">
                    <div className="ap-hero-copy">
                        <span>About Us</span>
                        <h1>Empowering Smarter Investments with GIS</h1>
                        <p>
                            MSME Investor GIS is a smart geospatial platform that provides
                            data-driven insights to help investors, businesses, and decision-makers
                            identify the best land opportunities.
                        </p>
                        <button type="button" className="ap-outline-btn" onClick={() => navigate('/msme-gis-map')}>
                            <span>Explore Platform</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="ap-hero-visual">
                        <img src="/images/haryanamap.png" alt="GIS land investment overview" />
                        <div className="ap-map-overlay" />
                        <div className="ap-map-pin">
                            <MapPin size={42} />
                        </div>
                    </div>
                </section>

                <section className="ap-section">
                    <div className="ap-section-head">
                        <span>Our Purpose</span>
                        <h2>Our Mission, Vision & Values</h2>
                    </div>

                    <div className="ap-purpose-grid">
                        <article className="ap-purpose-card">
                            <div className="ap-purpose-icon tone-green"><Target size={28} /></div>
                            <h3>Our Mission</h3>
                            <p>
                                To empower investors and businesses with accurate geospatial data,
                                advanced analytics, and easy-to-use tools for smarter land investment decisions.
                            </p>
                        </article>

                        <article className="ap-purpose-card">
                            <div className="ap-purpose-icon tone-blue"><Eye size={28} /></div>
                            <h3>Our Vision</h3>
                            <p>
                                To become the leading geospatial intelligence platform that drives sustainable
                                development by connecting data, technology, and opportunity.
                            </p>
                        </article>

                        <article className="ap-purpose-card">
                            <div className="ap-purpose-icon tone-violet"><Gem size={28} /></div>
                            <h3>Our Values</h3>
                            <div className="ap-value-list">
                                {values.map((value) => (
                                    <div key={value} className="ap-value-item">
                                        <CheckCircle2 size={18} />
                                        <span>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>
                </section>

                <section className="ap-impact-card">
                    <div className="ap-section-head">
                        <span>Making an Impact</span>
                        <h2>Trusted by Investors and Organizations</h2>
                    </div>
                    <div className="ap-impact-grid">
                        {impactStats.map((stat) => (
                            <div key={stat.label} className="ap-impact-item">
                                <div className="ap-impact-icon">{stat.icon}</div>
                                <div>
                                    <strong>{stat.value}</strong>
                                    <span>{stat.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="ap-section ap-team-section">
                    <div className="ap-section-head">
                        <span>Our Team</span>
                        <h2>Meet the People Behind MSME Investor GIS</h2>
                        <p>
                            A passionate team of geospatial experts, data scientists, and developers working together
                            to deliver accurate insights and powerful solutions.
                        </p>
                    </div>

                    <div className="ap-team-grid">
                        {team.map((member) => (
                            <article key={member.name} className="ap-team-card">
                                <div className="ap-avatar">{member.initials}</div>
                                <h3>{member.name}</h3>
                                <p>{member.role}</p>
                                <div className="ap-team-actions">
                                    <a href="#" aria-label={`${member.name} LinkedIn`}>in</a>
                                    <a href="#" aria-label={`Email ${member.name}`}><Mail size={17} /></a>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="ap-footer">
                <div className="ap-footer-grid">
                    <div className="ap-footer-brand">
                        <div className="ap-brand ap-footer-brand-logo">
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
                            <li><Link to="/contact">Contact</Link></li>
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
                            <li><Phone size={16} /> +91 12345 67890</li>
                            <li><Mail size={16} /> support@msmeinvestorgis.in</li>
                            <li><MapPin size={16} /> HARSAC, Hisar, Haryana</li>
                        </ul>
                    </div>
                </div>
                <div className="ap-footer-bottom">© 2024 MSME Investor GIS. All rights reserved.</div>
            </footer>
        </div>
    );
}
