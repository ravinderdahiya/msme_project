import React from "react";

export default function Register() {
  return (
    <div className="min-h-screen flex">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-blue-800 text-white flex-col justify-between p-12">
        <h1 className="text-4xl font-semibold leading-snug max-w-md">
          Your one-stop digital marketplace for all your industrial needs
        </h1>

        <div className="text-lg font-semibold opacity-80">
          JSW ONE MSME
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center">
        <div className="bg-gray-100 w-full max-w-md p-8 relative">

          {/* Close Button */}
          <button className="absolute top-4 right-4 text-2xl text-gray-600">
            ×
          </button>

          {/* Heading */}
          <h2 className="text-3xl font-semibold text-gray-800">
            Register Now
          </h2>
          <p className="text-gray-500 mb-6">
            Create your JSW One MSME account
          </p>

          {/* Form */}
          <form className="space-y-4">
            
            <input
              type="text"
              placeholder="Full name *"
              className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Mobile number *"
              className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="GSTIN *"
              className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Company email address *"
              className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Checkbox */}
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input type="checkbox" className="mt-1" />
              <p>
                I agree to JSW One MSME’s{" "}
                <span className="text-blue-600 cursor-pointer">
                  Terms and conditions
                </span>
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gray-400 text-white font-medium cursor-not-allowed"
              disabled
            >
              Next
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <span className="text-blue-600 cursor-pointer font-medium">
              Login
            </span>
          </p>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-10">
            Call us at <span className="font-semibold text-gray-600">7208055523</span> for assistance
          </p>

        </div>
      </div>
    </div>
  );
}