import React from "react";
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, FileText, Layers3, LocateFixed, Map, MapPinned, Menu, Moon, Search, UserRound, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./NewHomepage.css";

const topNav = ["Home", "Map", "Analysis", "Reports", "About Us", "Contact"];

const stats = [
    { icon: <BookOpen size={22} />, value: "2,500+", label: "Land Parcels" },
    { icon: <Layers3 size={22} />, value: "24+", label: "Data Layers" },
    { icon: <BarChart3 size={22} />, value: "500+", label: "Analyses Done" },
    { icon: <FileText size={22} />, value: "100+", label: "Reports Generated" },
];

const tools = [
    { icon: <Map size={26} />, title: "Explore Map", desc: "Search and explore land parcels on an interactive map with ease.", cta: "Explore Now", tone: "green" },
    { icon: <Layers3 size={26} />, title: "View Data Layers", desc: "Access multiple geographic and infrastructure data layers.", cta: "View Layers", tone: "blue" },
    { icon: <BarChart3 size={26} />, title: "Proximity Analysis", desc: "Analyze nearby amenities and infrastructure within your selected range.", cta: "Start Analysis", tone: "violet" },
    { icon: <MapPin size={26} />, title: "Land Suitability", desc: "Evaluate land suitability for different investment purposes.", cta: "Check Suitability", tone: "orange" },
    { icon: <FileText size={26} />, title: "Reports & Insights", desc: "Generate detailed reports and export insights easily.", cta: "View Reports", tone: "teal" },
];

const steps = [
    { no: "01", icon: <Search size={26} />, title: "Search Location", desc: "Search any location, district or village on the map." },
    { no: "02", icon: <Layers3 size={26} />, title: "Select & Explore", desc: "Select land parcel and explore available data layers." },
    { no: "03", icon: <BarChart3 size={26} />, title: "Analyze & Evaluate", desc: "Run proximity and suitability analysis for better insights." },
    { no: "04", icon: <FileText size={26} />, title: "Download Reports", desc: "Generate and download detailed reports for your decisions." },
];

const benefits = [
    "Accurate & Updated Data",
    "Advanced GIS Analysis",
    "User Friendly Interface",
    "Save Time & Resources",
    "Secure & Reliable Platform",
    "Better Investment Decisions",
];

const testimonials = [
    { quote: "MSME Investor GIS made land analysis so simple and accurate. It helps us take faster and better investment decisions.", name: "Rahul Verma", role: "Investor" },
    { quote: "The proximity analysis and data layers are extremely helpful for evaluating land potential in any location.", name: "Priya Sharma", role: "Real Estate Consultant" },
    { quote: "Detailed reports and easy to use interface saves our time and improves our decision-making process.", name: "Amit Kumar", role: "Business Analyst" },
];

export default function NewHomepage() {
    const navigate = useNavigate();

    return (
        <div className="new-homepage">
            <header className="nh-header">
                <div className="nh-brand">
                    <img src="/hepc-logo.png" alt="MSME Investor GIS" />
                    <div>
                        <strong>MSME</strong>
                        <span>INVESTOR GIS</span>
                    </div>
                </div>

                <nav className="nh-nav">
                    {topNav.map((item, index) => (
                        <a href="#" key={item} className={index === 0 ? "active" : ""}>
                            {item}
                        </a>
                    ))}
                </nav>

                <div className="nh-actions">
                    <button type="button" className="nh-icon-btn" aria-label="Theme">
                        <Moon size={18} />
                    </button>
                    <button type="button" className="nh-btn nh-btn-ghost" onClick={() => navigate("/LoginPage")}>Login</button>
                    <button type="button" className="nh-btn nh-btn-primary" onClick={() => navigate("/signup")}>Sign Up</button>
                    <button type="button" className="nh-menu-btn" aria-label="Menu">
                        <Menu size={20} />
                    </button>
                </div>
            </header>

            <section className="nh-hero">
                <div className="nh-hero-overlay" />
                <div className="nh-hero-content">
                    <div className="nh-hero-copy">
                        <div className="nh-chip">Smarter Land Decisions, Better Investments</div>
                        <h1>
                            Explore. Analyze. Invest
                            <span>with Confidence.</span>
                        </h1>
                        <p>
                            A smart GIS platform to discover land opportunities, analyze surroundings,
                            and make data-driven investment decisions.
                        </p>

                        <div className="nh-search-bar">
                            <div className="nh-search-input">
                                <LocateFixed size={18} />
                                <input type="text" placeholder="Search location, district, village..." />
                            </div>
                            <button type="button" className="nh-btn nh-btn-primary nh-search-btn">
                                <Map size={18} />
                                <span>Explore Map</span>
                            </button>
                        </div>

                        <div className="nh-stat-row">
                            {stats.map((stat) => (
                                <div key={stat.label} className="nh-stat-item">
                                    <div className="nh-stat-icon">{stat.icon}</div>
                                    <div>
                                        <strong>{stat.value}</strong>
                                        <span>{stat.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="nh-hero-visual">
                        <div className="nh-map-card">
                            <div className="nh-map-highlight" />
                            <div className="nh-map-pin">
                                <MapPinned size={42} />
                            </div>
                            <span className="node node-a" />
                            <span className="node node-b" />
                            <span className="node node-c" />
                            <span className="node node-d" />
                            <span className="node node-e" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="nh-section">
                <div className="nh-section-head">
                    <span>What You Can Do</span>
                    <h2>Powerful Tools for Smart Decisions</h2>
                    <p>Everything you need to analyze land and its potential in one platform.</p>
                </div>
                <div className="nh-tools-grid">
                    {tools.map((tool) => (
                        <article key={tool.title} className={`nh-tool-card tone-${tool.tone}`}>
                            <div className="nh-tool-icon">{tool.icon}</div>
                            <h3>{tool.title}</h3>
                            <p>{tool.desc}</p>
                            <a href="#">
                                {tool.cta}
                                <ArrowRight size={16} />
                            </a>
                        </article>
                    ))}
                </div>
            </section>

            <section className="nh-section nh-how">
                <div className="nh-section-head">
                    <span>How It Works</span>
                    <h2>Simple Steps to Get Started</h2>
                </div>
                <div className="nh-steps-row">
                    {steps.map((step) => (
                        <div key={step.no} className="nh-step-card">
                            <div className="nh-step-icon">{step.icon}</div>
                            <div>
                                <strong>{step.no}</strong>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="nh-section nh-why">
                <div className="nh-why-media">
                    <img src="/images/haryanamap.png" alt="GIS land map overview" />
                </div>
                <div className="nh-why-copy">
                    <span>Why Choose MSME Investor GIS?</span>
                    <h2>Data-Driven Insights, Better Investments</h2>
                    <div className="nh-benefits-grid">
                        {benefits.map((benefit) => (
                            <div key={benefit} className="nh-benefit-item">
                                <CheckCircle2 size={18} />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="nh-section">
                <div className="nh-section-head">
                    <span>What Our Users Say</span>
                    <h2>Trusted by Investors and Professionals</h2>
                </div>
                <div className="nh-testimonial-grid">
                    {testimonials.map((item) => (
                        <article key={item.name} className="nh-testimonial-card">
                            <p>"{item.quote}"</p>
                            <div className="nh-testimonial-user">
                                <div className="nh-user-avatar">
                                    <UserRound size={18} />
                                </div>
                                <div>
                                    <strong>{item.name}</strong>
                                    <span>{item.role}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="nh-cta-strip">
                <div>
                    <h2>Ready to Explore Smarter?</h2>
                    <p>Join thousands of investors who trust MSME Investor GIS for their land investment decisions.</p>
                </div>
                <div className="nh-cta-actions">
                    <button type="button" className="nh-btn nh-btn-light" onClick={() => navigate("/msme-gis-map")}>Explore Map</button>
                    <button type="button" className="nh-btn nh-btn-primary-alt" onClick={() => navigate("/LoginPage")}>Get Started Now</button>
                </div>
            </section>

            <footer className="nh-footer">
                <div className="nh-footer-grid">
                    <div className="nh-footer-brand">
                        <div className="nh-brand">
                            <img src="/hepc-logo.png" alt="MSME Investor GIS" />
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
                            <li><Link to="/">Home</Link></li>
                            <li><a href="#">Map</a></li>
                            <li><a href="#">Analysis</a></li>
                            <li><a href="#">Reports</a></li>
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
                            <li>B-123, Business Park, New Delhi, India - 110001</li>
                        </ul>
                    </div>
                </div>
                <div className="nh-footer-bottom">© 2024 MSME Investor GIS. All rights reserved.</div>
            </footer>
        </div>
    );
}
