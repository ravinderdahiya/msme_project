import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Server error, please try again");
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
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT PANEL */}
      <div
        className="w-full md:w-1/2 flex items-center justify-center relative py-12 md:py-0"
        style={{
          backgroundImage: "url('/images/haryanamap.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-100/80"></div>

        {/* Content */}
        <div className="relative z-10 max-w-xl text-center px-6 md:px-10">

          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
            MSME GIS Platform
          </h1>

          <p className="text-base md:text-lg text-gray-800 mb-6 md:mb-8 leading-relaxed">
            Find the best land locations, analyze infrastructure, and make smarter
            investment decisions with powerful GIS insights.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm md:text-base font-medium text-gray-900 text-left">

            <div>📍 Location Search</div>
            <div>🗺️ GIS Map</div>
            <div>🏭 Industrial Zones</div>
            <div>⚡ Infrastructure</div>
            <div>📊 Data Analysis</div>
            <div>📄 Reports</div>

          </div>

          {/* Highlight */}
          <div className="mt-6 md:mt-8 bg-white/80 backdrop-blur-md p-4 md:p-5 rounded-xl shadow-lg">
            <p className="text-sm md:text-base text-gray-800">
              Make <span className="font-semibold text-blue-700">data-driven</span>{" "}
              investment decisions with full transparency.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6 md:p-12 bg-gray-50">

        <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6 md:p-10">

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">
            Login to Your Account
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm md:text-base">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 p-2.5 md:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="example@mail.com"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm md:text-base">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 p-2.5 md:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold text-sm md:text-base"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleDemoUser}
              className="w-full border border-gray-300 bg-gray-100 text-gray-800 py-2.5 md:py-3 rounded-lg hover:bg-gray-200 transition-all font-semibold text-sm md:text-base"
            >
              demoUser
            </button>

          </form>

          <p className="text-sm text-center mt-5 md:mt-6 text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>

          <p className="text-xs text-center mt-3 md:mt-4 text-gray-400">
            © 2026 MSME Finder
          </p>

        </div>
      </div>
    </div>
  );
}
