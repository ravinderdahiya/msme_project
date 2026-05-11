import { ArrowLeft, Globe, KeyRound, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import govtLogo from "../assets/images/govtlogo.png";
import hepcLogo from "../assets/images/hepc-logo.png";
import { useI18n } from "../i18n/useI18n";
import { sendOtpApi, verifyOtpApi } from "../services/authService";

const LOGIN_TEXT = {
  en: {
    languageTitle: "Switch language",
    platformText: "GIS Based Land & Investment Platform",
    heroTitle: "Right Land, Right Investment,",
    heroHighlight: "Secure Future - Secure State",
    intro:
      "Explore verified land parcels with GIS insights, analyze infrastructure, and make smarter investment decisions.",
    features: [
      ["Smart Land Search", "Find the best land based on location."],
      ["GIS Layer Analysis", "Analyze infrastructure and nearby resources."],
      ["Data Driven Decisions", "Use insights for investment planning."],
      ["Reports & Insights", "Access investment reports and insights."],
    ],
    trustTitle: "Trusted. Transparent. Technology Driven.",
    trustText:
      "Empowering investors with accurate GIS data for a better tomorrow.",
    securityTitle: "OTP Based Secure Login",
    securityText: "Passwordless access for investors through mobile verification.",
    title: "MSME Investment GIS Portal",
    subtitle: "Login securely with mobile number and OTP",
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
    submitOtp: "Verify OTP & Login",
    submitMobile: "Send OTP",
    orLoginWith: "or login with",
    invalidMobile: "Please enter a valid 10 digit mobile number.",
    otpSentAgain: "OTP sent again successfully",
    otpSent: "OTP sent successfully",
    sendFailed: "Failed to send OTP",
    invalidOtp: "Please enter the 6 digit OTP.",
    loginSuccess: "Login successful",
    verifyFailed: "Invalid OTP",
  },
  hi: {
    languageTitle: "भाषा बदलें",
    platformText: "जीआईएस आधारित भूमि और निवेश प्लेटफॉर्म",
    heroTitle: "सही भूमि, सही निवेश,",
    heroHighlight: "सुरक्षित भविष्य - सुरक्षित प्रदेश",
    intro:
      "जीआईएस जानकारी के साथ सत्यापित भूमि पार्सल खोजें, आधारभूत संरचना का विश्लेषण करें और बेहतर निवेश निर्णय लें.",
    features: [
      ["स्मार्ट भूमि खोज", "स्थान के आधार पर सबसे उपयुक्त भूमि खोजें."],
      ["जीआईएस परत विश्लेषण", "आधारभूत संरचना और नजदीकी संसाधनों का विश्लेषण करें."],
      ["डेटा आधारित निर्णय", "निवेश योजना के लिए उपयोगी जानकारी का उपयोग करें."],
      ["रिपोर्ट और जानकारी", "निवेश रिपोर्ट और जानकारी प्राप्त करें."],
    ],
    trustTitle: "विश्वसनीय. पारदर्शी. तकनीक आधारित.",
    trustText: "बेहतर भविष्य के लिए निवेशकों को सटीक जीआईएस डेटा से सशक्त बनाना.",
    securityTitle: "OTP आधारित सुरक्षित लॉगिन",
    securityText: "मोबाइल सत्यापन के माध्यम से निवेशकों के लिए पासवर्ड रहित प्रवेश.",
    title: "एमएसएमई निवेश जीआईएस पोर्टल",
    subtitle: "मोबाइल नंबर और OTP से सुरक्षित लॉगिन करें",
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
    submitOtp: "OTP सत्यापित करें और लॉगिन करें",
    submitMobile: "OTP भेजें",
    orLoginWith: "या इससे लॉगिन करें",
    invalidMobile: "कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें.",
    otpSentAgain: "OTP फिर से सफलतापूर्वक भेजा गया",
    otpSent: "OTP सफलतापूर्वक भेजा गया",
    sendFailed: "OTP भेजने में विफल",
    invalidOtp: "कृपया 6 अंकों का OTP दर्ज करें.",
    loginSuccess: "लॉगिन सफल",
    verifyFailed: "OTP अमान्य है",
  },
};

function getLoginText(lang) {
  return String(lang).startsWith("hi") ? LOGIN_TEXT.hi : LOGIN_TEXT.en;
}

export default function Login() {
  const { lang, setLang, languages } = useI18n();
  const text = getLoginText(lang);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [messageKey, setMessageKey] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showHepc, setShowHepc] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();
  const enCode =
    (languages || []).find((language) => /^en/i.test(String(language.code)))?.code ?? "en";
  const hiCode =
    (languages || []).find((language) => /^hi/i.test(String(language.code)))?.code ?? "hi";
  const isHindi = String(lang).startsWith("hi");

  useEffect(() => {
    const timer = setInterval(() => {
      setShowHepc((prev) => !prev);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const cleanMobile = mobileNumber.replace(/\D/g, "").slice(0, 10);
  const isValidMobile = cleanMobile.length === 10;
  const isValidOtp = otp.replace(/\D/g, "").slice(0, 6).length === 6;

  function clearMessage() {
    setMessageKey("");
    setMessageType("");
  }

  function toggleLanguage() {
    setLang(isHindi ? enCode : hiCode);
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

  function resetOtpFlow() {
    setOtpSent(false);
    setOtp("");
    clearMessage();
  }

  return (
    <div className="font-montserrat">
      <h1>hello</h1>
      <AuthLayout
        securityTitle={text.securityTitle}
        securityText={text.securityText}
        languageControl={
          <button
            type="button"
            onClick={toggleLanguage}
            title={text.languageTitle}
            aria-label={text.languageTitle}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-2 font-semibold text-gray-700 shadow-sm transition hover:bg-white"
          >
            <Globe size={16} className="text-blue-600" />
            <span className={!isHindi ? "text-blue-700" : "text-gray-400"}>EN</span>
            <span className="h-3 w-px bg-gray-300"></span>
            <span className={isHindi ? "text-blue-700" : "text-gray-400"}>हि</span>
          </button>
        }
        platformText={text.platformText}
        heroTitle={text.heroTitle}
        heroHighlight={text.heroHighlight}
        intro={text.intro}
        features={text.features}
        trustTitle={text.trustTitle}
        trustText={text.trustText}
      >
        <div className="rounded-[28px] border border-white/60 bg-white/78 px-[clamp(18px,3vw,38px)] py-[clamp(18px,3vh,36px)] shadow-[0_25px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
          <div className="mb-6 flex items-center justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-20 blur-2xl animate-pulse"></div>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-30 blur-xl"></div>

              <div className="relative w-20 h-20 sm:w-28 sm:h-28 bg-white/80 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/50 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-blue-50/30 to-purple-50/30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>

                <div className="relative">
                  {showHepc ? (
                    <img
                      src={hepcLogo}
                      alt="HEPC Logo"
                      className="h-8 sm:h-11 w-auto object-contain drop-shadow-sm p-1"
                    />
                  ) : (
                    <img
                      src={govtLogo}
                      alt="Government Logo"
                      className="sm:h-24 max-sm:h-14 w-auto object-contain drop-shadow-sm"
                    />
                  )}
                </div>
              </div>

              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-60 animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-500 rounded-full opacity-40 animate-pulse"></div>
            </div>
          </div>

          <h2 className="text-[clamp(30px,2.4vw,32px)] max-sm:text-xl font-bold leading-tight text-gray-900">
            {text.title}
          </h2>

          <p className="mt-1 mb-5 text-[clamp(13px,1vw,16px)] text-gray-500">
            {text.subtitle}
          </p>

          <div className="mb-5 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              className="rounded-lg bg-white py-2 text-sm font-semibold text-blue-600 shadow-sm"
            >
              {text.investorLogin}
            </button>

            <button
              type="button"
              onClick={() => navigate("/newadmin")}
              className="rounded-lg py-2 text-sm font-semibold text-gray-500 transition"
            >
              {text.departmentLogin}
            </button>
          </div>

          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              {text.mobileLabel}
            </label>

            <div className="mb-4 mt-2 flex items-center rounded-xl border border-gray-200 bg-white/85 px-3 py-3 shadow-sm backdrop-blur-md focus-within:border-blue-500">
              <Phone size={18} className="mr-2 shrink-0 text-gray-400" />
              <span className="mr-2 text-sm font-semibold text-gray-500">+91</span>

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
                className="min-w-0 flex-1 bg-transparent text-sm outline-none disabled:text-gray-500"
              />
            </div>

            {otpSent && (
              <>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-gray-600">
                    {text.otpLabel}
                  </label>

                  <button
                    type="button"
                    onClick={resetOtpFlow}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <ArrowLeft size={14} />
                    {text.changeNumber}
                  </button>
                </div>

                <div className="mb-4 flex items-center rounded-xl border border-gray-200 bg-white/85 px-3 py-3 shadow-sm backdrop-blur-md focus-within:border-blue-500">
                  <KeyRound size={18} className="mr-2 shrink-0 text-gray-400" />

                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                      clearMessage();
                    }}
                    placeholder={text.otpPlaceholder}
                    className="min-w-0 flex-1 bg-transparent text-sm tracking-[0.28em] outline-none"
                  />
                </div>

                <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm">
                  <span className="text-gray-600">{text.otpHelp}</span>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || resendTimer > 0}
                    className={`font-semibold transition ${loading || resendTimer > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:underline"
                      }`}
                  >
                    {loading
                      ? text.sending
                      : resendTimer > 0
                        ? `${text.resendIn} ${resendTimer}s`
                        : text.resendOtp}
                  </button>
                </div>
              </>
            )}

            {messageKey && (
              <p
                className={`mb-4 rounded-xl px-4 py-3 text-sm ${messageType === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                  }`}
              >
                {text[messageKey]}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || (otpSent ? !isValidOtp : !isValidMobile)}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? text.sending : otpSent ? text.submitOtp : text.submitMobile}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-sm text-gray-400">
            <div className="h-px flex-1 bg-gray-200"></div>
            {text.orLoginWith}
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt=""
              className="h-5 w-5"
            />
            Google
          </button>
        </div>
      </AuthLayout>
    </div>
  );
}
