import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    // 🔥 Yaha API call lagega
    console.log("Reset link sent to:", email);

    alert("Reset link sent to your email");

    navigate("/login"); // 👈 redirect to login
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: "url('/images/haryanamap.png')",
      }}
    >
      {/* CENTER CARD */}
      <div className="w-full max-w-md bg-[#0b2230]/70 backdrop-blur-2xl p-6 md:p-8 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,255,150,0.25)]">

        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-xl">
            🔑
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-2 text-white">
          Forgot Password
        </h2>

        <p className="text-sm text-center text-gray-300 mb-6">
          Enter your email to receive a password reset link
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#06141d] text-white border border-white/10 focus:border-green-400 outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 transition"
          >
            Send Reset Link →
          </button>
        </form>

        {/* BACK LINK */}
        <p
          onClick={() => navigate("/login")}
          className="text-sm text-center mt-5 text-gray-400 cursor-pointer hover:text-green-400 transition"
        >
          Back to <span className="text-green-400">Login</span>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;