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
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import bgImage from "../assets/images/full-bg.png";
import hepcLogo from "../assets/images/hepc-logo.png";
import govtLogo from "../assets/images/govtlogo.png";
import { setHttpAuthToken } from "../api/axios";
import { useIn } from "../in/useIn";
import { adminLoginApi, googleLoginApi, sendOtpApi, verifyOtpApi } from "../services/authService";
import { setAuthSession } from "../utils/authStorage";
import { getPostLoginRoute } from "../utils/authRedirect";

const LOGIN_TEXT = {
    en: {
        languageTitle: "Switch language",
        brandTitle: "MSME Investment",
        platform: "GIS BASED LAND & INVESTMENT PLATFORM",
        headlineTop: "Right Land, Right Investment",
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
        mobileLabel: "MOBILE NUMBER",
        mobilePlaceholder: "Enter 10 digit mobile number",
        otpLabel: "ENTER OTP",
        otpPlaceholder: "6 digit OTP",
        changeNumber: "Change Number",
        otpHelp: "Did not receive OTP?",
        sending: "Sending...",
        resendIn: "Resend in",
        resendOtp: "Resend OTP",
        sendOtp: "Send OTP",
        verifyOtp: "Verify OTP & Login",
        orLoginWith: "OR LOGIN WITH",
        googleLogin: "Login with Google",
        googleNotConfigured: "Google login is not configured. Add VITE_GOOGLE_CLIENT_ID.",
        googleNotReady: "Google login is not ready. Reload the page.",
        googleFailed: "Google login failed. Try again.",
        securityTitle: "OTP Based Secure Login",
        securityText:
            "Passwordless access for investors through mobile verification.",
        adminSecurityTitle: "Department Secure Login",
        adminSecurityText:
            "Restricted access for authorized officials using department credentials.",
        departmentId: "DEPARTMENT ID",
        departmentIdPlaceholder: "Enter Department ID",
        password: "PASSWORD",
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
        headlineTop: "सही भूमि, सही निवेश",
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
        googleNotConfigured: "Google लॉगिन कॉन्फ़िगर नहीं है। VITE_GOOGLE_CLIENT_ID जोड़ें.",
        googleNotReady: "Google लॉगिन तैयार नहीं है। पेज रीलोड करें.",
        googleFailed: "Google लॉगिन विफल। पुन: प्रयास करें.",
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

const GOOGLE_INIT_CLIENT_KEY = "__msmeGoogleInitializedClientId";

export default function Login() {
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
    const [searchParams] = useSearchParams();
    const redirectAfterLogin = searchParams.get("redirect") || "";

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
            console.error("OTP send failed:", err?.response?.data || err?.message || err);
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

        navigator.geolocation.getCurrentPosition(
            async (position) => {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log(latitude,longitude)

                const res = await verifyOtpApi(
                    cleanMobile,
                    otp,
                    latitude,
                    longitude
                );

                setAuthSession({ token: res.token, user: res.user });
                setHttpAuthToken(res.token);

                setMessageKey("loginSuccess");
                setMessageType("success");

                navigate(
                    getPostLoginRoute(res.user, redirectAfterLogin),
                    { replace: true }
                );
            },
            (error) => {
                console.log("Location Error:", error);

                setMessageKey("verifyFailed");
                setMessageType("error");
            }
        );

    } catch (err) {
        console.error("OTP verify failed:", err?.response?.data || err?.message || err);

        setMessageKey("verifyFailed");
        setMessageType("error");
    } finally {
        setLoading(false);
    }
}

    async function handleDepartmentLogin(e) {
        e.preventDefault();

        if (!isValidDepartment) {
            setMessageKey("invalidAdmin");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);
            const res = await adminLoginApi(departmentId.trim(), departmentPassword);
            setAuthSession({ token: res.token, user: res.user });
            setHttpAuthToken(res.token);
            setMessageKey("loginSuccess");
            setMessageType("success");
            navigate(getPostLoginRoute(res.user, redirectAfterLogin), { replace: true });
        } catch (err) {
            console.log(err.message);
            setMessageKey("invalidAdmin");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    }

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const handleGoogleResponse = useCallback(async (response) => {
        if (!response?.credential) {
            setMessageKey("googleFailed");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);
            const res = await googleLoginApi(response.credential);
            setAuthSession({ token: res.token, user: res.user });
            setHttpAuthToken(res.token);
            setMessageKey("loginSuccess");
            setMessageType("success");
            navigate(getPostLoginRoute(res.user, redirectAfterLogin), { replace: true });
        } catch (err) {
            console.log(err.message);
            setMessageKey("googleFailed");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    }, [navigate, redirectAfterLogin]);

    useEffect(() => {
        if (!googleClientId) {
            return;
        }

        let isCancelled = false;

        const initGoogle = () => {
            if (isCancelled || !window.google?.accounts?.id) {
                return;
            }

            if (window[GOOGLE_INIT_CLIENT_KEY] === googleClientId) {
                return;
            }

            window.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleGoogleResponse,
                ux_mode: "popup",
                cancel_on_tap_outside: false,
            });

            window[GOOGLE_INIT_CLIENT_KEY] = googleClientId;
        };

        if (window.google?.accounts?.id) {
            initGoogle();
            return () => {
                isCancelled = true;
            };
        }

        const interval = setInterval(() => {
            if (window.google?.accounts?.id) {
                initGoogle();
                clearInterval(interval);
            }
        }, 100);

        return () => {
            isCancelled = true;
            clearInterval(interval);
        };
    }, [googleClientId, handleGoogleResponse]);

    function handleGoogleLogin() {
        if (!googleClientId) {
            setMessageKey("googleNotConfigured");
            setMessageType("error");
            return;
        }

        if (window.google?.accounts?.id) {
            window.google.accounts.id.prompt();
            return;
        }

        setMessageKey("googleNotReady");
        setMessageType("error");
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
            className="relative min-h-screen lg:h-screen w-full bg-cover bg-center overflow-y-auto lg:overflow-hidden flex flex-col items-center justify-center"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="absolute inset-0 bg-[#02133c]/40 backdrop-blur-[0.5px]" />

            {/* Language Toggle */}
            <button
                type="button"
                onClick={toggleLanguage}
                className="fixed top-2.5  right-6 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-xl transition hover:bg-white/20 "
            >
                <Globe size={14} />
                <span className={!isHindi ? "text-[#7dd3fc]" : ""}>EN</span>
                <span className="text-white/35">|</span>
                <span className={isHindi ? "text-[#7dd3fc]" : ""}>हि</span>
            </button>

            {/* Main Content Container */}
            <div className="relative z-20 w-full max-w-[1680px]  min-[1800px]:max-w-none mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)] min-[1800px]:grid-cols-[minmax(980px,1120px)_minmax(430px,500px)] items-center min-[1800px]:justify-between px-5 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 min-[1800px]:px-20 gap-8 lg:gap-10 xl:gap-12  min-[1800px]:gap-16 py-8 lg:py-8 min-[1800px]:py-6">

                {/* Left Section */}
                <div className="w-full max-w-[760px] min-[1800px]:max-w-[1120px] flex flex-col justify-center gap-12 lg:gap-10 min-[1800px]:gap-20 py-6 lg:py-10">

                    {/* Top: Govt Logo */}
                    <div className="inline-flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/10 p-2 backdrop-blur-md w-fit">
                        <div className="bg-white rounded-xl p-1 shadow-inner">
                            <img src={govtLogo} alt="Govt Logo" className="h-[30px] sm:h-[40px] xl:h-[45px] min-[1800px]:h-[54px] w-auto object-contain" />
                        </div>
                        <div className="pr-3">
                            <h2 className="text-white text-[13px] xl:text-[16px] min-[1800px]:text-[20px] font-extrabold uppercase tracking-wide leading-[1.3]">Govt. of Haryana</h2>
                            <p className="text-[#4facfe] text-[9px] xl:text-[10px] min-[1800px]:text-[12px] font-bold tracking-widest uppercase mt-1">Investment Portal</p>
                        </div>
                    </div>

                    {/* Middle: Headline & Features */}
                    <div className="space-y-6 lg:space-y-8 min-[1800px]:space-y-6">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 min-[1800px]:px-4 py-0.5 min-[1800px]:py-1 mb-2">
                                <span className="text-white text-[9px] xl:text-[11px] min-[1800px]:text-[12px] font-bold tracking-widest uppercase opacity-80">{text.platform}</span>
                            </div>
                            <h1 className="text-white text-[24px] sm:text-[34px] xl:text-[42px] 2xl:text-[46px] min-[1800px]:text-[76px] min-[1800px]:whitespace-nowrap font-black leading-[1.2] tracking-tight">
                                {text.headlineTop}
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-[#00f2fe] leading-[1.3]">
                                    {text.headlineBottom}
                                </span>
                            </h1>
                        </div>

                        <p className="text-[#c2d0eb] text-[13px] xl:text-[15px] 2xl:text-[17px] min-[1800px]:text-[19px] leading-[1.6] max-w-[600px] min-[1800px]:max-w-[760px] font-medium opacity-90">
                            {text.intro}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 min-[1800px]:grid-cols-1 gap-3 xl:gap-4 min-[1800px]:gap-4 min-[1800px]:max-w-[540px]">
                            <Feature icon={<MapPinned size={18} />} title={text.features[0][0]} desc={text.features[0][1]} color="from-blue-500 to-cyan-400" />
                            <Feature icon={<Layers3 size={18} />} title={text.features[1][0]} desc={text.features[1][1]} color="from-indigo-500 to-blue-400" />
                            <Feature icon={<BarChart3 size={18} />} title={text.features[2][0]} desc={text.features[2][1]} color="from-cyan-500 to-teal-400" />
                            <Feature icon={<FileText size={18} />} title={text.features[3][0]} desc={text.features[3][1]} color="from-blue-600 to-indigo-500" />
                        </div>
                    </div>

                    {/* Bottom: Trusted Card */}
                    <div className="relative group max-w-[480px] min-[1800px]:max-w-[520px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 rounded-2xl backdrop-blur-2xl"></div>
                        <div className="relative px-4 min-[1800px]:px-5 py-3 min-[1800px]:py-4 flex items-center gap-4 min-[1800px]:gap-5">
                            <div className="w-[40px] h-[40px] min-[1800px]:w-[48px] min-[1800px]:h-[48px] rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#4facfe]">
                                <ShieldCheck className="w-[24px] h-[24px] min-[1800px]:w-[28px] min-[1800px]:h-[28px]" />
                            </div>
                            <div>
                                <h3 className="text-[15px] sm:text-[17px] min-[1800px]:text-[20px] font-bold text-white tracking-tight leading-[1.4]">{text.trustTitle}</h3>
                                <p className="text-[#94a3b8] text-[11px] sm:text-[13px] min-[1800px]:text-[14px] font-medium leading-[1.5] opacity-90 mt-0.5">{text.trustText}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex items-center justify-center lg:justify-end min-[1800px]:justify-self-end">
                    <div className={`relative w-full max-w-[380px] lg:max-w-[330px] xl:max-w-[360px] 2xl:max-w-[380px] min-[1800px]:max-w-[440px] rounded-[26px] sm:rounded-[30px] min-[1800px]:rounded-[34px] backdrop-blur-3xl px-5 sm:px-6 xl:px-7 min-[1800px]:px-8 py-6 sm:py-8 xl:py-7 min-[1800px]:py-10 shadow-[0_32px_80px_-15px_rgba(0,0,0,0.8)] border border-white/10 transition-all duration-700 flex flex-col justify-center ${activeTab === "investor" ? "bg-[#030e26]/85" : "bg-[#021c15]/90"}`}>

                        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${activeTab === "investor" ? "via-[#4facfe]" : "via-[#10b981]"} to-transparent opacity-60`}></div>

                        <div className="relative z-10 space-y-4">
                            <div className="flex justify-center">
                                <div className="w-[50px] h-[50px] sm:w-[65px] sm:h-[65px] rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shadow-2xl rotate-3 transition-transform duration-500 hover:rotate-0 p-1">
                                    <img src={hepcLogo} alt="HEPC Logo" className="w-[70%] object-contain" />
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-[12px] sm:text-[15px] min-[1800px]:text-[16px] font-black tracking-[0.2em] uppercase text-white/40">MSME GIS Portal</p>
                                <h2 className="text-white text-[18px] sm:text-[22px] min-[1800px]:text-[24px] font-bold tracking-tight mt-0.5">{activeTitle}</h2>
                                <p className="text-[#94a3b8] text-[11px] sm:text-[12px] min-[1800px]:text-[13px] font-medium">{activeSubtitle}</p>
                            </div>

                            <div className="relative p-1 bg-black/40 rounded-[16px] sm:rounded-[20px] flex border border-white/5">
                                <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[12px] sm:rounded-[16px] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${activeTab === "investor" ? "translate-x-0 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6]" : "translate-x-[calc(100%+4px)] bg-gradient-to-r from-[#065f46] via-[#10b981] to-[#34d399]"}`}></div>
                                <button type="button" onClick={() => setTab("investor")} className={`relative flex-1 h-[34px] sm:h-[38px] rounded-[14px] font-bold text-[11px] sm:text-[12px] transition-colors z-10 ${activeTab === "investor" ? "text-white" : "text-[#94a3b8]"}`}>{text.investorLogin}</button>
                                <button type="button" onClick={() => setTab("department")} className={`relative flex-1 h-[34px] sm:h-[38px] rounded-[14px] font-bold text-[11px] sm:text-[12px] transition-colors z-10 ${activeTab === "department" ? "text-white" : "text-[#94a3b8]"}`}>{text.departmentLogin}</button>
                            </div>

                            <div className="min-h-[220px] sm:min-h-[250px] xl:min-h-[100px] min-[1800px]:min-h-[300px] flex flex-col justify-center">
                                {activeTab === "investor" ? (
                                    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-3 sm:space-y-4">
                                        <div>
                                            <label className="text-[#94a3b8] text-[10px] font-bold uppercase tracking-wider ml-1">{text.mobileLabel}</label>
                                            <div className="mt-1 h-[44px] sm:h-[50px] rounded-xl border border-white/10 bg-white/[0.04] flex items-center px-4 text-white focus-within:border-[#4facfe] transition-all relative group">
                                                <Phone size={14} className="mr-2 text-[#64748b]" />
                                                <span className="mr-2 font-bold text-[#cbd5e1] text-xs">+91</span>
                                                <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder={text.mobilePlaceholder} className="bg-transparent outline-none flex-1 font-medium text-xs sm:text-sm" />
                                            </div>
                                        </div>
                                        {otpSent && (
                                            <div className="animate-in fade-in slide-in-from-top-4 space-y-2">
                                                <div>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <label className="text-[#94a3b8] text-[10px] uppercase font-bold">{text.otpLabel}</label>
                                                        <button type="button" onClick={resetOtpFlow} className="text-[#4facfe] text-[9px] font-bold flex items-center gap-1 hover:underline"><ArrowLeft size={10} />{text.changeNumber}</button>
                                                    </div>
                                                    <div className="h-[44px] sm:h-[50px] rounded-xl border border-white/10 bg-white/[0.04] flex items-center px-4 text-white focus-within:border-[#4facfe]">
                                                        <KeyRound size={14} className="mr-2 text-[#64748b]" />
                                                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder={text.otpPlaceholder} className="bg-transparent outline-none flex-1 tracking-[0.4em] font-black text-xs sm:text-sm" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-[9px] backdrop-blur-sm">
                                                    <span className="text-[#94a3b8]">{text.otpHelp}</span>
                                                    <button type="button" onClick={handleSendOtp} disabled={loading || resendTimer > 0} className={`font-bold transition ${loading || resendTimer > 0 ? "cursor-not-allowed text-[#475569]" : "text-[#4facfe]"}`}>
                                                        {loading ? text.sending : resendTimer > 0 ? `${text.resendIn} ${resendTimer}s` : text.resendOtp}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <StatusMessage text={text} messageKey={messageKey} messageType={messageType} />
                                        <button type="submit" disabled={loading} className="group relative w-full h-[46px] sm:h-[52px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#3b82f6] text-white font-black text-[14px] shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {loading ? text.sending : otpSent ? text.verifyOtp : text.sendOtp}
                                                <ArrowRight size={16} />
                                            </span>
                                        </button>
                                        {!otpSent && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 text-[#475569] text-[9px] font-bold">
                                                    <div className="h-px flex-1 bg-white/5"></div>
                                                    <span className="uppercase tracking-widest">{text.orLoginWith}</span>
                                                    <div className="h-px flex-1 bg-white/5"></div>
                                                </div>
                                                <button type="button" onClick={handleGoogleLogin} className="w-full h-[44px] sm:h-[48px] rounded-xl bg-white text-[#0f172a] font-bold text-[12px] flex items-center justify-center gap-3 hover:bg-[#f8fafc] transition-all shadow-md">
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                                    {text.googleLogin}
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                ) : (
                                    <form onSubmit={handleDepartmentLogin} className="space-y-3 sm:space-y-4">
                                        <div>
                                            <label className="text-[#94a3b8] text-[10px] font-bold uppercase tracking-wider ml-1">{text.departmentId}</label>
                                            <div className="mt-1 h-[44px] sm:h-[50px] rounded-xl border border-white/10 bg-white/[0.04] flex items-center px-4 text-white focus-within:border-[#10b981] transition-all">
                                                <UserRoundCog size={14} className="mr-2 text-[#64748b]" />
                                                <input type="text" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} placeholder={text.departmentIdPlaceholder} className="bg-transparent outline-none flex-1 font-medium text-xs sm:text-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[#94a3b8] text-[10px] font-bold uppercase tracking-wider ml-1">{text.password}</label>
                                            <div className="mt-1 h-[44px] sm:h-[50px] rounded-xl border border-white/10 bg-white/[0.04] flex items-center px-4 text-white focus-within:border-[#10b981] transition-all">
                                                <Lock size={14} className="mr-2 text-[#64748b]" />
                                                <input type={showPassword ? "text" : "password"} value={departmentPassword} onChange={(e) => setDepartmentPassword(e.target.value)} placeholder={text.passwordPlaceholder} className="bg-transparent outline-none flex-1 font-medium text-xs sm:text-sm" />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 text-[#64748b] hover:text-white transition">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                                            </div>
                                        </div>
                                        <StatusMessage text={text} messageKey={messageKey} messageType={messageType} />
                                        <button type="submit" className="group relative w-full h-[46px] sm:h-[52px] rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#065f46] via-[#10b981] to-[#34d399] text-white font-black text-[14px] shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {text.departmentLogin}
                                                <ArrowRight size={16} />
                                            </span>
                                        </button>
                                    </form>
                                )}
                            </div>

                            <div className="group relative flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden">
                                <div className="min-w-[28px] h-[28px] rounded-lg bg-white/10 flex items-center justify-center">
                                    <ShieldCheck size={16} className={activeTab === "investor" ? "text-[#4facfe]" : "text-[#10b981]"} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white text-[11px] font-bold tracking-tight">{securityTitle}</h4>
                                    <p className="text-[#94a3b8] text-[9px] font-medium leading-tight mt-0.5">{securityText}</p>
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
        <div className={`px-3 py-1 rounded-lg border text-[9px] font-bold flex items-center gap-2 ${messageType === "success" ? "border-[#10b981]/30 bg-[#10b981]/10 text-[#34d399]" : "border-[#ef4444]/30 bg-[#ef4444]/10 text-[#f87171]"}`}>
            <div className={`w-1 h-1 rounded-full ${messageType === "success" ? "bg-[#34d399]" : "bg-[#f87171]"}`}></div>
            {text[messageKey]}
        </div>
    );
}

function Feature({ icon, title, desc, color }) {
    return (
        <div className="group relative flex items-center gap-4 min-[1800px]:gap-5 p-3 xl:p-4 min-[1800px]:p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all cursor-default">
            <div className={`w-[42px] h-[42px] min-[1800px]:w-[52px] min-[1800px]:h-[52px] shrink-0 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
                {icon}
            </div>
            <div className="min-w-0">
                <h3 className="text-white font-bold text-[12px] xl:text-[14px] min-[1800px]:text-[16px] leading-tight truncate">{title}</h3>
                <p className="text-[#94a3b8] text-[9px] xl:text-[11px] min-[1800px]:text-[13px] mt-1 truncate leading-tight opacity-90">{desc}</p>
            </div>
        </div>
    );
}

