import {
    ArrowLeft,
    ArrowRight,
    BarChart3,
    Eye,
    EyeOff,
    FileText,
    Globe,
    KeyRound,
    Layers3,
    Lock,
    MapPinned,
    Phone,
    ShieldCheck,
    UserRoundCog,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import bgImage from "../assets/images/full-bg.png";
import hepcLogo from "../assets/images/hepc-logo.png";
import govtLogo from "../assets/images/govtlogo.png";
import { useIn } from "../in/useIn";
import { sendOtpApi, verifyOtpApi } from "../services/authService";

const LOGIN_TEXT = {
    en: {
        languageTitle: "Switch language",
        brandTitle: "MSME Investment",
        platform: "GIS Based Land & Investment Platform",
        headlineTop: "Right Land, Right Investment,",
        headlineBottom: "Secure Future - Secure State",
        intro:
            "Explore verified land parcels with GIS insights, analyze infrastructure, and make smarter investment decisions.",
        features: [
            ["Smart Land Search", "Find the best land based on location"],
            ["GIS Layer Analysis", "Analyze infrastructure and nearby resources"],
            ["Data Driven Decisions", "Use insights for investment planning"],
            ["Reports & Insights", "Generate reports and investment analysis"],
        ],
        trustTitle: "Trusted. Transparent. Technology Driven.",
        trustText:
            "Empowering investors with accurate GIS data for a better tomorrow.",
        investorTitle: "Secure Investor Access",
        investorSubtitle: "Login with mobile number and OTP verification",
        departmentTitle: "Department Access",
        departmentSubtitle: "Secure access for authorized officials",
        investorLogin: "Investor Login",
        departmentLogin: "Department Login",
        mobileLabel: "Mobile Number",
        mobilePlaceholder: "Enter 10 digit mobile number",
        otpLabel: "Enter OTP",
        otpPlaceholder: "6 digit OTP",
        changeNumber: "Change Number",
        otpHelp: "Did not receive OTP?",
        sending: "Sending...",
        resendIn: "Resend in",
        resendOtp: "Resend OTP",
        sendOtp: "Send OTP",
        verifyOtp: "Verify OTP & Login",
        orLoginWith: "or login with",
        googleLogin: "Login with Google",
        securityTitle: "OTP Based Secure Login",
        securityText:
            "Passwordless access for investors through mobile verification.",
        adminSecurityTitle: "Department Secure Login",
        adminSecurityText:
            "Restricted access for authorized officials using department credentials.",
        departmentId: "Department ID",
        departmentIdPlaceholder: "Enter Department ID",
        password: "Password",
        passwordPlaceholder: "Enter password",
        invalidMobile: "Please enter a valid 10 digit mobile number.",
        otpSent: "OTP sent successfully",
        otpSentAgain: "OTP sent again successfully",
        sendFailed: "Failed to send OTP",
        invalidOtp: "Please enter the 6 digit OTP.",
        verifyFailed: "Invalid OTP",
        loginSuccess: "Login successful",
        invalidAdmin: "Please enter department ID and password.",
    },
    hi: {
        languageTitle: "भाषा बदलें",
        brandTitle: "एमएसएमई निवेश",
        platform: "जीआईएस आधारित भूमि और निवेश प्लेटफॉर्म",
        headlineTop: "सही भूमि, सही निवेश,",
        headlineBottom: "सुरक्षित भविष्य - सुरक्षित प्रदेश",
        intro:
            "जीआईएस जानकारी के साथ सत्यापित भूमि पार्सल खोजें, आधारभूत संरचना का विश्लेषण करें और बेहतर निवेश निर्णय लें.",
        features: [
            ["स्मार्ट भूमि खोज", "स्थान के आधार पर सबसे उपयुक्त भूमि खोजें"],
            ["जीआईएस लेयर विश्लेषण", "आधारभूत संरचना और नजदीकी संसाधनों का विश्लेषण करें"],
            ["डेटा आधारित निर्णय", "निवेश योजना के लिए जानकारी का उपयोग करें"],
            ["रिपोर्ट और जानकारी", "रिपोर्ट और निवेश विश्लेषण तैयार करें"],
        ],
        trustTitle: "विश्वसनीय. पारदर्शी. तकनीक आधारित.",
        trustText:
            "बेहतर भविष्य के लिए निवेशकों को सटीक जीआईएस डेटा से सशक्त बनाना.",
        investorTitle: "सुरक्षित निवेशक प्रवेश",
        investorSubtitle: "मोबाइल नंबर और OTP सत्यापन से लॉगिन करें",
        departmentTitle: "विभाग प्रवेश",
        departmentSubtitle: "अधिकृत अधिकारियों के लिए सुरक्षित प्रवेश",
        investorLogin: "निवेशक लॉगिन",
        departmentLogin: "विभाग लॉगिन",
        mobileLabel: "मोबाइल नंबर",
        mobilePlaceholder: "10 अंकों का मोबाइल नंबर दर्ज करें",
        otpLabel: "OTP दर्ज करें",
        otpPlaceholder: "6 अंकों का OTP",
        changeNumber: "नंबर बदलें",
        otpHelp: "OTP प्राप्त नहीं हुआ?",
        sending: "भेजा जा रहा है...",
        resendIn: "फिर भेजें",
        resendOtp: "OTP फिर भेजें",
        sendOtp: "OTP भेजें",
        verifyOtp: "OTP सत्यापित करें और लॉगिन करें",
        orLoginWith: "या इससे लॉगिन करें",
        googleLogin: "Google से लॉगिन करें",
        securityTitle: "OTP आधारित सुरक्षित लॉगिन",
        securityText: "मोबाइल सत्यापन के माध्यम से निवेशकों के लिए पासवर्ड रहित प्रवेश.",
        adminSecurityTitle: "विभाग सुरक्षित लॉगिन",
        adminSecurityText: "विभागीय क्रेडेंशियल से अधिकृत अधिकारियों के लिए सीमित प्रवेश.",
        departmentId: "विभाग ID",
        departmentIdPlaceholder: "विभाग ID दर्ज करें",
        password: "पासवर्ड",
        passwordPlaceholder: "पासवर्ड दर्ज करें",
        invalidMobile: "कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें.",
        otpSent: "OTP सफलतापूर्वक भेजा गया",
        otpSentAgain: "OTP फिर से सफलतापूर्वक भेजा गया",
        sendFailed: "OTP भेजने में विफल",
        invalidOtp: "कृपया 6 अंकों का OTP दर्ज करें.",
        verifyFailed: "OTP अमान्य है",
        loginSuccess: "लॉगिन सफल",
        invalidAdmin: "कृपया विभाग ID और पासवर्ड दर्ज करें.",
    },
};

function getText(lang) {
    return String(lang).startsWith("hi") ? LOGIN_TEXT.hi : LOGIN_TEXT.en;
}

export default function NewLoginPage() {
    const { lang, setLang, languages } = useIn();
    const text = getText(lang);
    const [activeTab, setActiveTab] = useState("investor");
    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [departmentId, setDepartmentId] = useState("");
    const [departmentPassword, setDepartmentPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [messageKey, setMessageKey] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const navigate = useNavigate();

    const enCode =
        (languages || []).find((language) => /^en/i.test(String(language.code)))?.code ?? "en";
    const hiCode =
        (languages || []).find((language) => /^hi/i.test(String(language.code)))?.code ?? "hi";
    const isHindi = String(lang).startsWith("hi");
    const cleanMobile = mobileNumber.replace(/\D/g, "").slice(0, 10);
    const isValidMobile = cleanMobile.length === 10;
    const isValidOtp = otp.replace(/\D/g, "").slice(0, 6).length === 6;
    const isValidDepartment =
        departmentId.trim().length > 0 && departmentPassword.trim().length > 0;

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [resendTimer]);

    function clearMessage() {
        setMessageKey("");
        setMessageType("");
    }

    function toggleLanguage() {
        setLang(isHindi ? enCode : hiCode);
    }

    function setTab(nextTab) {
        setActiveTab(nextTab);
        clearMessage();
    }

    async function handleSendOtp(e) {
        e.preventDefault();

        if (!isValidMobile) {
            setMessageKey("invalidMobile");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);
            await sendOtpApi(cleanMobile);
            setOtpSent(true);
            setResendTimer(30);
            setMessageKey(otpSent ? "otpSentAgain" : "otpSent");
            setMessageType("success");
        } catch (err) {
            console.log(err.message);
            setMessageKey("sendFailed");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyOtp(e) {
        e.preventDefault();

        if (!isValidOtp) {
            setMessageKey("invalidOtp");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);
            const res = await verifyOtpApi(cleanMobile, otp);
            localStorage.setItem("token", res.token);
            setMessageKey("loginSuccess");
            setMessageType("success");
            navigate("/dashboard");
        } catch (err) {
            console.log(err.message);
            setMessageKey("verifyFailed");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    }

    function handleDepartmentLogin(e) {
        e.preventDefault();

        if (!isValidDepartment) {
            setMessageKey("invalidAdmin");
            setMessageType("error");
            return;
        }

        localStorage.setItem("adminToken", "department-session");
        navigate("/newadmin");
    }

    function resetOtpFlow() {
        setOtpSent(false);
        setOtp("");
        clearMessage();
    }

    const activeTitle =
        activeTab === "investor" ? text.investorTitle : text.departmentTitle;
    const activeSubtitle =
        activeTab === "investor" ? text.investorSubtitle : text.departmentSubtitle;
    const securityTitle =
        activeTab === "investor" ? text.securityTitle : text.adminSecurityTitle;
    const securityText =
        activeTab === "investor" ? text.securityText : text.adminSecurityText;

    return (
        <div
            className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="absolute inset-0 bg-[#02133c]/30 backdrop-blur-[0.3px]" />

            <button
                type="button"
                onClick={toggleLanguage}
                title={text.languageTitle}
                aria-label={text.languageTitle}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-xl transition hover:bg-white/15 sm:text-sm"
            >
                <Globe size={16} />
                <span className={!isHindi ? "text-[#7dd3fc]" : ""}>EN</span>
                <span className="text-white/35">|</span>
                <span className={isHindi ? "text-[#7dd3fc]" : ""}>हि</span>
            </button>

            <div className="relative z-20 min-h-screen flex flex-col xl:flex-row py-8 xl:py-0">
                <div className="w-full xl:w-[58%] px-5 sm:px-8 md:px-12 lg:px-16 pt-4 sm:pt-6 xl:pt-10 pb-10 flex flex-col justify-center xl:justify-between min-h-full">
                    <div>
                        {/* Logo Lockup */}
                        <div className="inline-flex items-center gap-4 sm:gap-6 rounded-2xl bg-white/[0.04] border border-white/10 p-3 sm:p-4 shadow-lg backdrop-blur-md">
                            <div className="bg-white rounded-xl p-2 shadow-inner">
                                <img src={govtLogo} alt="Govt Logo" className="h-[40px] sm:h-[50px] xl:h-[65px] w-auto object-contain" />
                            </div>
                            <div className="ml-2 pr-3 hidden sm:block">
                                <h2 className="text-white text-[15px] sm:text-[18px] xl:text-[20px] font-[800] uppercase tracking-wide leading-tight">
                                    Govt. of Haryana
                                </h2>
                                <p className="text-[#4facfe] text-[10px] sm:text-[11px] xl:text-[12px] font-[700] tracking-widest uppercase mt-0.5">
                                    Investment Portal
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 sm:mt-10 xl:mt-12">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 mb-4 sm:mb-5 shadow-sm backdrop-blur-sm">
                                <span className="text-white text-[10px] sm:text-xs xl:text-sm font-semibold tracking-widest uppercase">
                                    {text.platform}
                                </span>
                            </div>
                            <h1 className="text-white text-[32px] sm:text-[46px] xl:text-[64px] 2xl:text-[76px] font-[900] leading-[1.15] tracking-tight">
                                {text.headlineTop}
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-[#00f2fe] drop-shadow-[0_0_20px_rgba(79,172,254,0.2)]">
                                    {text.headlineBottom}
                                </span>
                            </h1>
                        </div>

                        <p className="text-[#c2d0eb] text-[14px] sm:text-[16px] xl:text-[21px] leading-[1.6] xl:leading-[1.7] mt-4 xl:mt-6 max-w-[720px] font-medium">
                            {text.intro}
                        </p>

                        <div className="mt-8 xl:mt-12 flex flex-col gap-3 xl:gap-5 max-w-[650px]">
                            <Feature icon={<MapPinned size={22} />} title={text.features[0][0]} desc={text.features[0][1]} />
                            <Feature icon={<Layers3 size={22} />} title={text.features[1][0]} desc={text.features[1][1]} />
                            <Feature icon={<BarChart3 size={22} />} title={text.features[2][0]} desc={text.features[2][1]} />
                            <Feature icon={<FileText size={22} />} title={text.features[3][0]} desc={text.features[3][1]} />
                        </div>
                    </div>

                    <div className="mt-8 xl:mt-12 w-full max-w-[600px] relative group">
                        {/* Premium Card Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[32px] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500 group-hover:from-white/[0.08] group-hover:border-white/20 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)]">
                            {/* Continuous Animated Shimmer */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-[-25deg] -translate-x-[150%] animate-[shimmer_3s_infinite] transition-all"></div>
                            </div>
                        </div>

                        <div className="relative px-6 sm:px-8 xl:px-10 py-6 xl:py-10 flex items-center gap-5 xl:gap-8">
                            {/* Enhanced Icon Container */}
                            <div className="relative shrink-0">
                                <div className="absolute inset-0 bg-[#4facfe] blur-[15px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                <style>{`
                                    @keyframes shimmer {
                                        0% { transform: translateX(-150%) skewX(-25deg); }
                                        50% { transform: translateX(150%) skewX(-25deg); }
                                        100% { transform: translateX(150%) skewX(-25deg); }
                                    }
                                `}</style>
                                <div className="relative w-[56px] h-[56px] xl:w-[76px] xl:h-[76px] rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/20 flex items-center justify-center text-[#4facfe] shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <ShieldCheck className="w-[28px] xl:w-[38px] h-[28px] xl:h-[38px] drop-shadow-[0_0_10px_rgba(79,172,254,0.5)]" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[18px] xl:text-[26px] font-[900] tracking-tight text-white leading-tight">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#94a3b8]">
                                        {text.trustTitle}
                                    </span>
                                </h3>

                                <p className="text-[#94a3b8] text-[13px] xl:text-[16px] mt-2 xl:mt-3 leading-relaxed font-medium max-w-[400px]">
                                    {text.trustText}
                                </p>
                            </div>

                            {/* Decorative element */}
                            <div className="hidden sm:block absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Globe size={80} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full xl:w-[42%] flex items-center justify-center px-4 sm:px-6 py-8 xl:py-0">
                    {/* Premium Form Container - Dynamic tint based on tab */}
                    <div className={`relative w-full max-w-[570px] rounded-[32px] sm:rounded-[40px] backdrop-blur-[24px] px-6 sm:px-10 lg:px-12 py-10 sm:py-12 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.7)] border border-white/10 ring-1 ring-white/5 overflow-hidden transition-all duration-700 ${activeTab === "investor" ? "bg-[#030e26]/80" : "bg-[#021c15]/85"
                        }`}>
                        {/* Ambient inner glows - Dynamic based on active tab */}
                        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${activeTab === "investor" ? "via-[#4facfe]" : "via-[#10b981]"} to-transparent opacity-70`}></div>
                        <div className={`absolute -top-32 -right-32 w-[300px] h-[300px] rounded-full mix-blend-screen filter blur-[120px] transition-all duration-700 pointer-events-none ${activeTab === "investor" ? "bg-[#4facfe] opacity-20" : "bg-[#10b981] opacity-20"
                            }`}></div>
                        <div className={`absolute -bottom-32 -left-32 w-[300px] h-[300px] rounded-full mix-blend-screen filter blur-[120px] transition-all duration-700 pointer-events-none ${activeTab === "investor" ? "bg-[#00f2fe] opacity-15" : "bg-[#34d399] opacity-15"
                            }`}></div>

                        <div className="relative z-10 flex flex-col h-full">
                            {/* Logo Section */}
                            <div className="flex justify-center">
                                <div className="w-[85px] h-[85px] sm:w-[100px] sm:h-[100px] rounded-[24px] bg-gradient-to-tr from-white/10 to-white/5 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/10 backdrop-blur-md rotate-3 transition-transform duration-500 hover:rotate-0">
                                    <div className="w-[80px] h-[80px] sm:w-[94px] sm:h-[94px] rounded-[20px] bg-white flex items-center justify-center shadow-inner">
                                        <img src={hepcLogo} alt="HEPC Logo" className="w-[50px] sm:w-[60px]" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-[20px] sm:text-[24px] font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#e2e8f0] via-[#ffffff] to-[#e2e8f0]">
                                    MSME GIS Portal
                                </p>
                            </div>

                            <h2 className="text-white text-center text-[22px] sm:text-[28px] font-bold mt-2 tracking-tight">
                                {activeTitle}
                            </h2>

                            <p className="text-center text-[#94a3b8] mt-1.5 text-[14px] sm:text-[15px]">
                                {activeSubtitle}
                            </p>

                            {/* Tabs */}
                            <div className="relative p-1.5 bg-[#0f172a]/60 backdrop-blur-md rounded-[20px] flex border border-white/5 shadow-inner mt-8">
                                <div
                                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-[16px] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${activeTab === "investor"
                                        ? "translate-x-0 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] shadow-[0_4px_15px_rgba(59,130,246,0.4)]"
                                        : "translate-x-[calc(100%+6px)] bg-gradient-to-r from-[#065f46] via-[#10b981] to-[#34d399] shadow-[0_4px_15px_rgba(16,185,129,0.4)]"
                                        }`}
                                >
                                    <div className="absolute inset-0 rounded-[16px] border border-white/10"></div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setTab("investor")}
                                    className={`relative flex-1 h-[48px] sm:h-[52px] rounded-[14px] font-semibold text-sm sm:text-base transition-colors duration-300 z-10 ${activeTab === "investor" ? "text-white" : "text-[#94a3b8] hover:text-[#cbd5e1]"
                                        }`}
                                >
                                    {text.investorLogin}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTab("department")}
                                    className={`relative flex-1 h-[48px] sm:h-[52px] rounded-[14px] font-semibold text-sm sm:text-base transition-colors duration-300 z-10 ${activeTab === "department" ? "text-white" : "text-[#94a3b8] hover:text-[#cbd5e1]"
                                        }`}
                                >
                                    {text.departmentLogin}
                                </button>
                            </div>

                            <div className="min-h-[430px] sm:min-h-[470px] flex-1 flex flex-col">
                                {activeTab === "investor" ? (
                                    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="h-full flex flex-col">
                                        <div className="mt-8">
                                            <label className="text-[#94a3b8] text-[13px] font-medium tracking-wide ml-1 uppercase">{text.mobileLabel}</label>
                                            <div className="mt-2 h-[56px] sm:h-[60px] rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex items-center px-4 text-white text-sm sm:text-base transition-all duration-300 focus-within:bg-white/[0.06] focus-within:border-[#4facfe] focus-within:ring-2 focus-within:ring-[#4facfe]/20 focus-within:shadow-[0_0_20px_rgba(79,172,254,0.15)] group relative overflow-hidden">
                                                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#4facfe] to-[#00f2fe] opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"></div>
                                                <Phone size={20} className="mr-3 shrink-0 text-[#64748b] transition-colors duration-300 group-focus-within:text-[#4facfe]" />
                                                <span className="mr-3 font-semibold text-[#cbd5e1]">+91</span>
                                                <input
                                                    type="tel"
                                                    inputMode="numeric"
                                                    value={mobileNumber}
                                                    onChange={(e) => {
                                                        setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
                                                        clearMessage();
                                                    }}
                                                    disabled={otpSent}
                                                    placeholder={text.mobilePlaceholder}
                                                    className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#475569] disabled:text-[#64748b] font-medium"
                                                />
                                            </div>
                                        </div>

                                        {otpSent && (
                                            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                                <div className="mt-6 flex items-center justify-between gap-3">
                                                    <label className="text-[#94a3b8] text-[13px] font-medium tracking-wide ml-1 uppercase">{text.otpLabel}</label>
                                                    <button
                                                        type="button"
                                                        onClick={resetOtpFlow}
                                                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#4facfe] transition hover:text-[#00f2fe]"
                                                    >
                                                        <ArrowLeft size={14} />
                                                        {text.changeNumber}
                                                    </button>
                                                </div>

                                                <div className="mt-2 h-[56px] sm:h-[60px] rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex items-center px-4 text-white text-sm sm:text-base transition-all duration-300 focus-within:bg-white/[0.06] focus-within:border-[#4facfe] focus-within:ring-2 focus-within:ring-[#4facfe]/20 focus-within:shadow-[0_0_20px_rgba(79,172,254,0.15)] group relative overflow-hidden">
                                                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#4facfe] to-[#00f2fe] opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"></div>
                                                    <KeyRound size={20} className="mr-3 shrink-0 text-[#64748b] transition-colors duration-300 group-focus-within:text-[#4facfe]" />
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={otp}
                                                        onChange={(e) => {
                                                            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                                                            clearMessage();
                                                        }}
                                                        placeholder={text.otpPlaceholder}
                                                        className="min-w-0 flex-1 bg-transparent tracking-[0.4em] font-bold text-lg outline-none placeholder:tracking-normal placeholder:font-normal placeholder:text-base placeholder:text-[#475569]"
                                                    />
                                                </div>

                                                <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-3.5 text-sm backdrop-blur-sm">
                                                    <span className="text-[#94a3b8]">{text.otpHelp}</span>
                                                    <button
                                                        type="button"
                                                        onClick={handleSendOtp}
                                                        disabled={loading || resendTimer > 0}
                                                        className={`font-semibold transition ${loading || resendTimer > 0
                                                            ? "cursor-not-allowed text-[#475569]"
                                                            : "text-[#4facfe] hover:text-[#00f2fe]"
                                                            }`}
                                                    >
                                                        {loading
                                                            ? text.sending
                                                            : resendTimer > 0
                                                                ? `${text.resendIn} ${resendTimer}s`
                                                                : text.resendOtp}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <StatusMessage text={text} messageKey={messageKey} messageType={messageType} />

                                        <div className="mt-auto pt-8">
                                            <button
                                                type="submit"
                                                disabled={loading || (otpSent ? !isValidOtp : !isValidMobile)}
                                                className="relative w-full h-[56px] sm:h-[60px] rounded-2xl text-white font-bold text-[15px] sm:text-[17px] bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#3b82f6] hover:from-[#1e40af] hover:via-[#2563eb] hover:to-[#60a5fa] shadow-[0_8px_30px_rgba(37,99,235,0.4)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgba(37,99,235,0.5)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)] overflow-hidden group z-10 flex items-center justify-center"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {loading ? text.sending : otpSent ? text.verifyOtp : text.sendOtp}
                                                    {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                                </span>
                                            </button>

                                            {!otpSent && (
                                                <>
                                                    <div className="flex items-center gap-4 text-[#475569] text-[13px] font-medium my-6">
                                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                                                        <span className="uppercase tracking-wider">{text.orLoginWith}</span>
                                                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="relative w-full h-[54px] sm:h-[58px] rounded-2xl bg-white text-[#0f172a] font-bold text-sm sm:text-base shadow-[0_4px_15px_rgba(255,255,255,0.1)] transition-all duration-300 hover:bg-[#f8fafc] hover:-translate-y-[2px] hover:shadow-[0_8px_25px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3"
                                                    >
                                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                        </svg>
                                                        {text.googleLogin}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleDepartmentLogin} className="h-full flex flex-col">
                                        <div className="mt-8 animate-in fade-in duration-300">
                                            <label className="text-[#94a3b8] text-[13px] font-medium tracking-wide ml-1 uppercase">{text.departmentId}</label>
                                            <div className="mt-2 h-[56px] sm:h-[60px] rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex items-center px-4 text-white text-sm sm:text-base transition-all duration-300 focus-within:bg-white/[0.06] focus-within:border-[#10b981] focus-within:ring-2 focus-within:ring-[#10b981]/20 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.15)] group relative overflow-hidden">
                                                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#10b981] to-[#34d399] opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"></div>
                                                <UserRoundCog size={20} className="mr-3 shrink-0 text-[#64748b] transition-colors duration-300 group-focus-within:text-[#10b981]" />
                                                <input
                                                    type="text"
                                                    value={departmentId}
                                                    onChange={(e) => {
                                                        setDepartmentId(e.target.value);
                                                        clearMessage();
                                                    }}
                                                    placeholder={text.departmentIdPlaceholder}
                                                    className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#475569] font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6 animate-in fade-in duration-500">
                                            <label className="text-[#94a3b8] text-[13px] font-medium tracking-wide ml-1 uppercase">{text.password}</label>
                                            <div className="mt-2 h-[56px] sm:h-[60px] rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex items-center px-4 text-white text-sm sm:text-base transition-all duration-300 focus-within:bg-white/[0.06] focus-within:border-[#10b981] focus-within:ring-2 focus-within:ring-[#10b981]/20 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.15)] group relative overflow-hidden">
                                                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#10b981] to-[#34d399] opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"></div>
                                                <Lock size={20} className="mr-3 shrink-0 text-[#64748b] transition-colors duration-300 group-focus-within:text-[#10b981]" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={departmentPassword}
                                                    onChange={(e) => {
                                                        setDepartmentPassword(e.target.value);
                                                        clearMessage();
                                                    }}
                                                    placeholder={text.passwordPlaceholder}
                                                    className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#475569] font-medium"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((value) => !value)}
                                                    className="ml-3 text-[#64748b] transition hover:text-[#e2e8f0]"
                                                    aria-label={text.password}
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>

                                        <StatusMessage text={text} messageKey={messageKey} messageType={messageType} />

                                        <div className="mt-auto pt-8">
                                            <button
                                                type="submit"
                                                disabled={!isValidDepartment}
                                                className="relative w-full h-[56px] sm:h-[60px] rounded-2xl text-white font-bold text-[15px] sm:text-[17px] bg-gradient-to-r from-[#065f46] via-[#10b981] to-[#34d399] hover:from-[#064e3b] hover:via-[#059669] hover:to-[#10b981] shadow-[0_8px_30px_rgba(16,185,129,0.4)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgba(16,185,129,0.5)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] overflow-hidden group z-10 flex items-center justify-center"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {text.departmentLogin}
                                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Security Badge Footer */}
                            <div className={`mt-8 relative rounded-2xl border border-white/5 bg-gradient-to-r from-white/[0.02] to-white/[0.05] px-5 py-4 flex items-start gap-4 overflow-hidden group transition-all duration-500`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <div className={`min-w-[42px] h-[42px] sm:min-w-[48px] sm:h-[48px] rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white border border-white/10 shadow-inner backdrop-blur-sm transition-all duration-500`}>
                                    <ShieldCheck size={22} className={activeTab === "investor" ? "text-[#4facfe]" : "text-[#10b981]"} />
                                </div>

                                <div className="flex-1">
                                    <h4 className="text-white font-semibold text-[13px] sm:text-sm tracking-wide">
                                        {securityTitle}
                                    </h4>
                                    <p className="text-[#94a3b8] text-[12px] sm:text-[13px] mt-1 leading-relaxed">
                                        {securityText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusMessage({ text, messageKey, messageType }) {
    if (!messageKey) return null;

    return (
        <div
            className={`mt-6 flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-[13px] font-semibold tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-300 ${messageType === "success"
                ? "border-[#10b981]/30 bg-[#10b981]/10 text-[#34d399] shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : "border-[#ef4444]/30 bg-[#ef4444]/10 text-[#f87171] shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                }`}
        >
            <div className={`w-1.5 h-1.5 rounded-full ${messageType === "success" ? "bg-[#34d399] shadow-[0_0_8px_#34d399]" : "bg-[#f87171] shadow-[0_0_8px_#f87171]"}`}></div>
            {text[messageKey]}
        </div>
    );
}

function Feature({ icon, title, desc }) {
    return (
        <div className="group relative flex items-center gap-3 xl:gap-5 p-2.5 xl:p-4 rounded-2xl bg-white/[0.03] border border-white/5 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/15 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1 bg-[#4facfe] rounded-l-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

            <div className="min-w-[38px] h-[38px] xl:min-w-[54px] xl:h-[54px] rounded-[12px] xl:rounded-[14px] bg-white/[0.05] border border-white/10 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105 group-hover:text-[#4facfe]">
                {icon}
            </div>

            <div>
                <h3 className="text-white font-bold text-[14px] xl:text-[18px] tracking-wide transition-colors duration-300 group-hover:text-[#4facfe]">
                    {title}
                </h3>

                <p className="text-[#94a3b8] text-[11px] xl:text-[14px] mt-0.5 xl:mt-1 font-medium">{desc}</p>
            </div>
        </div>
    );
}
