import {
  Eye,
  Lock,
  UserRoundCog,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import hepcLogo from "../assets/images/hepc-logo.png";
import govtLogo from "../assets/images/govtlogo.png";

export default function NewAdminPage() {
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showHepc, setShowHepc] = useState(true);

  const navigate = useNavigate();

  // 🔥 Logo toggle (same as login)
  useEffect(() => {
    const timer = setInterval(() => {
      setShowHepc((prev) => !prev);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const isValidAdmin =
    adminId.trim().length > 0 &&
    adminPassword.trim().length > 0;

  function handleAdminLogin(e) {
    e.preventDefault();

    if (!isValidAdmin) {
      setMessage("Please enter admin ID and password.");
      return;
    }

    navigate("/dashboard");
  }

  return (
    <AuthLayout
      securityTitle="Admin Secure Login"
      securityText="Restricted access for authorized officials using department credentials."
    >
      <div className="rounded-[28px] border border-white/60 bg-white/78 px-[clamp(18px,3vw,38px)] py-[clamp(18px,3vh,36px)] shadow-[0_25px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl">

        {/* 🔥 PREMIUM DUAL LOGO */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative group">

            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#0b2e73] via-blue-600 to-[#1f8f65] opacity-20 blur-2xl animate-pulse"></div>

            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-400 to-green-400 opacity-30 blur-xl"></div>

            <div className="relative w-20 h-20 sm:w-28 sm:h-28 bg-white/80 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/50 flex items-center justify-center overflow-hidden">

              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-blue-50/30 to-green-50/30"></div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>

              <div className="relative">
                {showHepc ? (
                  <img
                    src={hepcLogo}
                    alt="HEPC Logo"
                    className="h-8 sm:h-11 w-auto object-contain p-1"
                  />
                ) : (
                  <img
                    src={govtLogo}
                    alt="Government Logo"
                    className="sm:h-24 max-sm:h-14 w-auto object-contain"
                  />
                )}
              </div>
            </div>

            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-60 animate-ping"></div>

            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-green-500 rounded-full opacity-40 animate-pulse"></div>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-[clamp(30px,2.4vw,32px)] max-sm:text-xl font-bold text-gray-900">
          Department Login
        </h2>

        <p className="mt-1 mb-5 text-[clamp(13px,1vw,16px)] text-gray-500">
          Secure access for authorized officials
        </p>

        {/* Tabs */}
        <div className="mb-5 grid grid-cols-2 rounded-xl bg-gray-100 p-1">

          <button
            type="button"
            onClick={() => navigate("/newlogin")}
            className="rounded-lg py-2 text-sm font-semibold text-gray-500"
          >
            Investor Login
          </button>

          <button
            type="button"
            className="rounded-lg bg-white py-2 text-sm font-semibold text-blue-600 shadow-sm"
          >
            Department Login
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleAdminLogin}>

          <label className="mb-2 block text-sm font-medium text-gray-600">
            Department ID
          </label>

          <div className="mb-4 mt-2 flex items-center rounded-xl border border-gray-200 bg-white/85 px-3 py-3 shadow-sm focus-within:border-blue-500">

            <UserRoundCog size={18} className="mr-2 text-gray-400" />

            <input
              type="text"
              value={adminId}
              onChange={(e) => {
                setAdminId(e.target.value);
                setMessage("");
              }}
              placeholder="Enter Department ID"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          <label className="mb-2 block text-sm font-medium text-gray-600">
            Password
          </label>

          <div className="mb-4 mt-2 flex items-center rounded-xl border border-gray-200 bg-white/85 px-3 py-3 shadow-sm focus-within:border-blue-500">

            <Lock size={18} className="mr-2 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              value={adminPassword}
              onChange={(e) => {
                setAdminPassword(e.target.value);
                setMessage("");
              }}
              placeholder="Enter password"
              className="flex-1 bg-transparent text-sm outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-400"
            >
              <Eye size={18} />
            </button>
          </div>

          {message && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {message}
            </p>
          )}

          {/* 🔥 BUTTON */}
          <button
            type="submit"
            disabled={!isValidAdmin}
            className="w-full rounded-xl bg-gradient-to-r from-[#0b2e73] via-blue-600 to-[#1f8f65] py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.01] disabled:opacity-60"
          >
            Department Login
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}