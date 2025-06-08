// In src/pages/Onboarding/Privacypolicy.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacypolicy = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      {/* Fixed Header with Back Button */}
      <div className="fixed top-0 left-0 right-0 bg-[#0D0D0D]/95 backdrop-blur-sm z-50 border-b border-[#1A1A1A]">
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="h-16 sm:h-20 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-[#1A1A1A] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">Privacy Policy</h1>
          </div>
        </div>
      </div>

      {/* Main Content with proper spacing for fixed header */}
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 md:px-8 pb-20">
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
          {/* Background (subtle gradient) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_70%)] -z-10" />
          
          <div className="container-section relative z-10 w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto text-center">
              {/* Last Updated */}
              <div
                className={`mt-16 sm:mt-20 md:mt-24 transition-all duration-1000 delay-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Privacy Policy
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  <strong>Last Updated: May 18, 2025</strong>
                </p>
              </div>

              {/* Introduction */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  1. Introduction
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  At <strong>Outflow</strong>, we prioritize your privacy while delivering a seamless expense tracking experience. This Privacy Policy explains how we collect, use, and protect your personal data when you use our platform, website, and related services (collectively, the "Service"). By using Outflow, you agree to the practices described in this policy and our <em>Terms of Service</em>. Our commitment is to keep your data secure, give you control, and enhance your financial clarity without compromising your trust.
                </p>
                <ul className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left list-disc ml-4 sm:ml-6 space-y-2 mt-4">
                  <li>What personal information we collect and how we use it.</li>
                  <li>Who we share your data with (if anyone).</li>
                  <li>Your choices and control over your data.</li>
                  <li>How we safeguard your information.</li>
                </ul>
              </div>

              {/* Information Collection, Use, and Sharing */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  2. Information Collection, Use, and Sharing
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  We are the sole owners of the information you provide through Outflow. We collect only the data you voluntarily submit to use our Service, such as financial details (expenses, income, budgets, notes) and account information (email, login credentials). We do not sell, rent, or share your personal data with third parties, except as outlined below:
                </p>
                <ul className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left list-disc ml-4 sm:ml-6 space-y-2 mt-4">
                  <li>
                    <strong>Service Delivery</strong>: We use your data to provide core features, like tracking expenses and generating reports.
                  </li>
                  <li>
                    <strong>Public Sharing</strong>: If you export or share financial reports publicly, the data you choose to make visible may be accessible to others. You control what is shared.
                  </li>
                  <li>
                    <strong>Communications</strong>: We may email you about updates, new features, or policy changes, unless you opt out.
                  </li>
                  <li>
                    <strong>Analytics</strong>: We collect anonymized usage statistics (e.g., app interactions) via third-party analytics tools using cookies or similar technologies. No personally identifiable information is shared.
                  </li>
                </ul>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left mt-4">
                  Your privacy is our priority—we never disclose your individual data in a way that compromises your identity.
                </p>
              </div>

              {/* Your Access to and Control Over Information */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-900 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  3. Your Access to and Control Over Information
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  You have full control over your data. Contact us at{" "}
                  <a
                    href="mailto:outflowapp@gmail.com"
                    className="underline hover:text-white"
                  >
                    outflowapp@gmail.com
                  </a>{" "}
                  to:
                </p>
                <ul className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left list-disc ml-4 sm:ml-6 space-y-2 mt-4">
                  <li>View any data we have about you.</li>
                  <li>Update or correct your data.</li>
                  <li>Request deletion of your data.</li>
                  <li>Raise concerns about our data practices.</li>
                </ul>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left mt-4">
                  You may also opt out of future communications (e.g., update emails) at any time via the app's settings or by contacting us.
                </p>
              </div>

              {/* Security */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-1100 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  4. Security
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  We take robust measures to protect your data. All sensitive information (e.g., financial details, account credentials) is encrypted using industry-standard protocols during transmission and storage. Access to your data is strictly limited to authorized personnel who need it to operate the Service. Your trust is paramount, and we are committed to safeguarding your privacy at every step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacypolicy;