import {
  BarChart3,
  FileText,
  Globe,
  Layers,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import mapBg from "../../assets/images/map-bg.png";
import securityImg from "../../assets/images/security.png";

export default function AuthLayout({
  children,
  securityTitle = "OTP Based Secure Login",
  securityText = "Passwordless access for investors through mobile verification.",
}) {
  return (
    <div className="min-h-screen w-full bg-[#eef2f7] overflow-x-hidden">
      <div className="w-full min-h-screen flex flex-col lg:flex-row">

        {/* ================= LEFT PANEL ================= */}
        <section className="w-full lg:w-1/2 relative overflow-hidden min-h-[400px] lg:min-h-screen">

          <img
            src={mapBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-[#07296b]/92 via-[#0a3b88]/70 to-[#0a3b88]/25"></div>

          <div className="relative z-10 w-full h-full flex flex-col justify-between px-[clamp(22px,3vw,58px)] py-[clamp(20px,3vh,42px)] text-white">

            {/* TOP CONTENT */}
            <div>
              <div className="flex items-center gap-3 mb-[clamp(18px,2vh,34px)]">

                <div>
                  <h2 className="text-yellow-400 font-bold text-[clamp(22px,2vw,38px)] leading-none">
                    MSME
                  </h2>

                  <p className="text-[clamp(10px,0.9vw,14px)] opacity-90">
                    GIS Based Land & Investment Platform
                  </p>
                </div>
              </div>

              <h1 className="font-bold leading-[1.28] mb-5 text-[clamp(34px,3vw,68px)]">
                सही भूमि, सही निवेश,
                <br />
                <span className="text-green-400">
                  सुरक्षित भविष्य - सुरक्षित प्रदेश
                </span>
              </h1>

              <p className="max-w-xl opacity-90 leading-relaxed mb-7 text-[clamp(13px,1vw,18px)]">
                Explore verified land parcels with GIS insights, analyze
                infrastructure, and make smarter investment decisions.
              </p>

              {/* FEATURES */}
              <div className="space-y-5">

                <Feature
                  icon={<MapPin />}
                  title="Smart Land Search"
                />

                <Feature
                  icon={<Layers />}
                  title="GIS Layer Analysis"
                />

                <Feature
                  icon={<BarChart3 />}
                  title="Data Driven Decisions"
                />

                <Feature
                  icon={<FileText />}
                  title="Reports & Insights"
                />
              </div>
            </div>

            {/* TRUST CARD */}
            <div className="max-w-[420px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex gap-3 shadow-2xl max-sm:mt-4">

              <ShieldCheck
                size={28}
                className="shrink-0 mt-1"
              />

              <div>
                <p className="font-semibold text-sm xl:text-base">
                  Trusted. Transparent. Technology Driven.
                </p>

                <p className="text-xs xl:text-sm opacity-90">
                  Empowering investors with accurate GIS data for a better
                  tomorrow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RIGHT PANEL ================= */}
        <section className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 relative">

          {/* LANGUAGE */}
          <div className="absolute top-4 right-4 flex items-center gap-2 text-sm text-gray-600">
            <Globe size={16} />
            English
          </div>

          {/* FORM AREA */}
          <div className="flex w-full max-w-[560px] flex-col justify-center">

            {children}

            {/* SECURITY CARD */}
            <div className="relative mt-4 flex min-h-[96px] items-center overflow-hidden rounded-2xl border border-[#dfe8ff] bg-gradient-to-r from-[#edf4ff] via-[#f4f8ff] to-[#eef5ff] px-5 py-4 shadow-[0_10px_30px_rgba(80,120,255,0.06)]">

              <div className="relative z-10 flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <p className="text-[15px] font-semibold text-[#172554]">
                    {securityTitle}
                  </p>

                  <p className="max-w-[280px] text-xs leading-5 text-gray-500">
                    {securityText}
                  </p>
                </div>
              </div>

              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 opacity-[0.14]">
                <img
                  src={securityImg}
                  alt=""
                  className="h-full w-full object-contain object-bottom"
                />
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}

/* ================= FEATURE ================= */

function Feature({ icon, title }) {
  return (
    <div className="flex gap-4">

      <div className="bg-blue-600 p-3 rounded-xl">
        {icon}
      </div>

      <div>
        <h4 className="font-semibold">
          {title}
        </h4>

        <p className="text-sm opacity-90">
          Find the best land based on location.
        </p>
      </div>
    </div>
  );
}