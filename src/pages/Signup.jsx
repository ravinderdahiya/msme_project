import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 ADD THIS

const Signup = () => {
  const navigate = useNavigate(); // 👈 INIT

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  // 🔥 SLIDER IMAGES
  const slides = [
    "/images/image1.png",
    "/images/image2.jpeg",
    "/images/image3.jpg",
  ];

  const [current, setCurrent] = useState(0);

  // 🔁 AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 FAKE SUCCESS LOGIN (tu API laga sakta hai yaha)
    if (form.username && form.password) {
      navigate("/login"); // 👈 REDIRECT
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/haryanamap.png')",
      }}
    >
      {/* CARD */}
      <div className="w-[95%] max-w-5xl bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-stretch">

        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="bg-[#0b2230]/70 backdrop-blur-2xl p-6 rounded-2xl w-full border border-white/10 shadow-[0_0_40px_rgba(0,255,150,0.25)]">

            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                📍
              </div>
            </div>

            <h2 className="text-xl font-semibold text-center mb-1 text-white">
              Create Your Account
            </h2>

            <p className="text-xs text-center text-gray-300 mb-5">
              Start exploring the best investment opportunities
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="username"
                placeholder="Full Name"
                value={form.username}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#06141d] text-white border border-white/10"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 rounded-lg bg-[#06141d] text-white border border-white/10"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#06141d] text-white border border-white/10"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 rounded-lg bg-[#06141d] text-white border border-white/10"
              />

              <button className="w-full py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 transition">
                Sign Up →
              </button>
            </form>

            {/* 👇 LOGIN LINK */}
            <p
              onClick={() => navigate("/login")}
              className="text-xs text-center mt-4 text-gray-400 cursor-pointer"
            >
              Already have an account?{" "}
              <span className="text-green-400">Log in</span>
            </p>

          </div>
        </div>

        {/* RIGHT SIDE - SLIDER */}
        <div className="w-full  md:w-1/2 bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center relative overflow-hidden">

          <img
            src={slides[current]}
            alt="slide"
            className="w-full h-full object-cover transition-all duration-700"
          />
        </div>

      </div>
    </div>
  );
};

export default Signup;