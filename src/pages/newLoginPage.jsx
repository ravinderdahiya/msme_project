import {
  ArrowLeft,
  KeyRound,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import hepcLogo from "../assets/images/hepc-logo.png";
import govtLogo from "../assets/images/govtlogo.png";

export default function NewLoginPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [showHepc, setShowHepc] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setShowHepc((prev) => !prev);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const cleanMobile = mobileNumber.replace(/\D/g, "").slice(0, 10);
  const isValidMobile = cleanMobile.length === 10;
  const isValidOtp = otp.replace(/\D/g, "").slice(0, 6).length === 6;

  function handleSendOtp(e) {
    e.preventDefault();

    if (!isValidMobile) {
      setMessage("Please enter a valid 10 digit mobile number.");
      return;
    }

    setOtpSent(true);
    setMessage(`OTP sent to +91 ${cleanMobile}.`);
  }

  function handleVerifyOtp(e) {
    e.preventDefault();

    if (!isValidOtp) {
      setMessage("Please enter the 6 digit OTP.");
      return;
    }

    navigate("/dashboard");
  }

  function resetOtpFlow() {
    setOtpSent(false);
    setOtp("");
    setMessage("");
  }

  return (
    <AuthLayout
      securityTitle="OTP Based Secure Login"
      securityText="Passwordless access for investors through mobile verification."
    >
      <div className="rounded-[28px] border border-white/60 bg-white/78 px-[clamp(18px,3vw,38px)] py-[clamp(18px,3vh,36px)] shadow-[0_25px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl">

        {/* Premium Logo */}
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

        {/* Heading */}
        <h2 className="text-[clamp(30px,2.4vw,32px)] max-sm:text-xl font-bold leading-tight text-gray-900">
          MSME Investment GIS Portal
        </h2>
        <h1>hello</h1>

        <p className="mt-1 mb-5 text-[clamp(13px,1vw,16px)] text-gray-500">
          Login securely with mobile number and OTP
        </p>

        {/* Tabs */}
        <div className="mb-5 grid grid-cols-2 rounded-xl bg-gray-100 p-1">

          <button
            type="button"
            className="rounded-lg bg-white py-2 text-sm font-semibold text-blue-600 shadow-sm"
          >
            Investor Login
          </button>

          <button
            type="button"
            onClick={() => navigate("/newadmin")}
            className="rounded-lg py-2 text-sm font-semibold text-gray-500 transition"
          >
            Department Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>

          <label className="mb-2 block text-sm font-medium text-gray-600">
            Mobile Number
          </label>

          <div className="mb-4 mt-2 flex items-center rounded-xl border border-gray-200 bg-white/85 px-3 py-3 shadow-sm backdrop-blur-md focus-within:border-blue-500">

            <Phone size={18} className="mr-2 shrink-0 text-gray-400" />

            <span className="mr-2 text-sm font-semibold text-gray-500">
              +91
            </span>

            <input
              type="tel"
              inputMode="numeric"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                );
                setMessage("");
              }}
              disabled={otpSent}
              placeholder="Enter 10 digit mobile number"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none disabled:text-gray-500"
            />
          </div>

          {otpSent && (
            <>
              <div className="mb-3 flex items-center justify-between gap-3">

                <label className="block text-sm font-medium text-gray-600">
                  Enter OTP
                </label>

                <button
                  type="button"
                  onClick={resetOtpFlow}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                >
                  <ArrowLeft size={14} />
                  Change Number
                </button>
              </div>

              <div className="mb-4 flex items-center rounded-xl border border-gray-200 bg-white/85 px-3 py-3 shadow-sm backdrop-blur-md focus-within:border-blue-500">

                <KeyRound size={18} className="mr-2 shrink-0 text-gray-400" />

                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => {
                    setOtp(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    );
                    setMessage("");
                  }}
                  placeholder="6 digit OTP"
                  className="min-w-0 flex-1 bg-transparent text-sm tracking-[0.28em] outline-none"
                />
              </div>

              <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm">

                <span className="text-gray-600">
                  Did not receive OTP?
                </span>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Resend
                </button>
              </div>
            </>
          )}

          {message && (
            <p
              className={`mb-4 rounded-xl px-4 py-3 text-sm ${
                message.includes("sent")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={otpSent ? !isValidOtp : !isValidMobile}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {otpSent ? "Verify OTP & Login" : "Send OTP"}
          </button>
        </form>

        {/* Social */}
        <div className="my-5 flex items-center gap-3 text-sm text-gray-400">
          <div className="h-px flex-1 bg-gray-200"></div>
          or login with
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
  );
}