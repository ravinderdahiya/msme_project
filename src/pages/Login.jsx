import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const slides = [
    "/images/image1.png",
    "/images/image2.jpeg",
    "/images/image3.jpg",
  ];

  const [current, setCurrent] = useState(0);

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

    if (form.username && form.password) {
      navigate("/dashboard");
    } else {
      alert("Enter username & password");
    }
  };

  const handleDemoUser = () => {
    localStorage.setItem("token", "demo-token");
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "Demo User", role: "demo" })
    );
    navigate("/demo-map");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/haryanamap.png')",
      }}
    >
      <div className="w-[95%] max-w-5xl bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="bg-[#0b2230]/70 backdrop-blur-2xl p-6 rounded-2xl w-full border border-white/10">

            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                🔐
              </div>
            </div>

            <h2 className="text-xl text-white text-center mb-2">
              Login to Your Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                type="text"
                name="username"
                placeholder="Username / Email"
                value={form.username}
                onChange={handleChange}
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

              <button className="w-full py-3 bg-green-500 rounded-lg">
                Login →
              </button>

              {/* DEMO USER */}
              <button
                type="button"
                onClick={handleDemoUser}
                className="w-full border border-gray-300 bg-gray-100 text-gray-800 py-2 rounded-lg"
              >
                Demo User
              </button>

            </form>

            {/* LINKS */}
            <p
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-center mt-4 text-gray-400 cursor-pointer"
            >
              Forgot Password?
            </p>

            <p
              onClick={() => navigate("/signup")}
              className="text-xs text-center mt-2 text-gray-400 cursor-pointer"
            >
              Don’t have an account?{" "}
              <span className="text-green-400">Sign Up</span>
            </p>

          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center overflow-hidden">
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

export default Login;