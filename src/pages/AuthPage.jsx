import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // route se decide hoga login ya signup
  const isLogin = location.pathname === "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl grid md:grid-cols-2 overflow-hidden">

        {/* LEFT PANEL */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">MSME Portal</h1>
            <p className="text-sm opacity-90">
              Single platform for business registration, approvals and incentives.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <p>✔ Easy Registration</p>
            <p>✔ Track Applications</p>
            <p>✔ Apply for Schemes</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 md:p-10">
          {/* Toggle */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => navigate("/login")}
              className={`w-1/2 py-2 rounded-lg text-sm font-medium transition ${
                isLogin ? "bg-white shadow text-blue-600" : "text-gray-500"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className={`w-1/2 py-2 rounded-lg text-sm font-medium transition ${
                !isLogin ? "bg-white shadow text-blue-600" : "text-gray-500"
              }`}
            >
              Signup
            </button>
          </div>

          {/* FORM */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">
              {isLogin ? "Welcome Back" : "Create Your Account"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isLogin
                ? "Login to access your dashboard and track applications"
                : "Sign up to start your business journey with MSME Portal"}
            </p>
          </div>

          <form className="space-y-4">

            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {!isLogin && (
              <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}

            {!isLogin && (
              <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Business Type</option>
                <option>Manufacturing</option>
                <option>Service</option>
                <option>Startup</option>
              </select>
            )}

            {isLogin && (
              <div className="flex justify-between text-sm">
                <label className="flex gap-2 items-center">
                  <input type="checkbox" /> Remember me
                </label>
                <span className="text-blue-600 cursor-pointer">
                  Forgot?
                </span>
              </div>
            )}

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-6 text-center">
            Secure login with future support for OTP & Aadhaar verification
          </p>
        </div>
      </div>
    </div>
  );
}
