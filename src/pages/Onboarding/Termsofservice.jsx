// In src/pages/Onboarding/Termsofservice.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Termsofservice = () => {
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
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">Terms of Service</h1>
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
                  Terms of Service
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
                  Welcome to Outflow
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  Thank you for choosing <strong>Outflow</strong>, your trusted platform for expense tracking. These Terms of Service (“Terms”) outline the rules and guidelines for using our platform, services, and applications (collectively, the “Service”). By accessing or using Outflow, you agree to these Terms and our <em>Privacy Policy</em>. If you do not agree, please do not use the Service. Our goal is to provide a simple, secure, and accessible tool to manage your finances, and these Terms ensure a fair and safe experience for all users.
                </p>
              </div>

              {/* Use of the Service */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  1. Use of the Service
                </h2>
                <ul className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left list-disc ml-4 sm:ml-6 space-y-2">
                  <li>You must be at least 13 years old to use Outflow.</li>
                  <li>Use the Service only for lawful purposes and in accordance with these Terms.</li>
                  <li>Maintain the confidentiality of your account credentials (e.g., email, password).</li>
                  <li>You are responsible for all activities under your account.</li>
                </ul>
              </div>

              {/* User Data and Privacy */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-900 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  2. User Data and Privacy
                </h2>
                <ul className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left list-disc ml-4 sm:ml-6 space-y-2">
                  <li>Outflow lets you track financial data, such as expenses, income, budgets, and personal notes.</li>
                  <li>You retain full ownership of all data you input into Outflow.</li>
                  <li>We do not sell or share your data with third parties without your explicit consent.</li>
                  <li>For details on how we handle your data, please review our <em>Privacy Policy</em>.</li>
                </ul>
              </div>

              {/* Account and Termination */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-1100 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  3. Account and Termination
                </h2>
                <ul className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left list-disc ml-4 sm:ml-6 space-y-2">
                  <li>Create an account using a valid email address or third-party login (e.g., Google).</li>
                  <li>You may delete your account at any time via the app's settings.</li>
                  <li>We may suspend or terminate accounts that violate these Terms or engage in abuse or misuse of the Service.</li>
                </ul>
              </div>

              {/* Acceptable Use */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-1300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  4. Acceptable Use
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  You agree not to:
                </p>
                <ul className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left list-disc ml-4 sm:ml-6 space-y-2">
                  <li>Use the Service for unlawful, fraudulent, or harmful activities.</li>
                  <li>Attempt unauthorized access to any part of the Service.</li>
                  <li>Interfere with or disrupt the Service's integrity or performance.</li>
                </ul>
              </div>

              {/* Service Availability */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-1500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  5. Service Availability
                </h2>
                <ul className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left list-disc ml-4 sm:ml-6 space-y-2">
                  <li>We strive to provide a reliable and secure Service, but we cannot guarantee uninterrupted or error-free access.</li>
                  <li>Maintenance, updates, or technical issues may temporarily disrupt the Service.</li>
                </ul>
              </div>

              {/* Intellectual Property */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-1700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  6. Intellectual Property
                </h2>
                <ul className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left list-disc ml-4 sm:ml-6 space-y-2">
                  <li>Outflow's logo, interface, and platform design are our intellectual property.</li>
                  <li>You may not copy, modify, distribute, or reverse-engineer any part of the Service without our explicit permission.</li>
                </ul>
              </div>

              {/* Limitation of Liability */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-1900 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  7. Limitation of Liability
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  To the fullest extent permitted by law, Outflow is not liable for indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to loss of data or financial inaccuracies.
                </p>
              </div>

              {/* Changes to These Terms */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-2100 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  8. Changes to These Terms
                </h2>
                <ul className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left list-disc ml-4 sm:ml-6 space-y-2">
                  <li>We may update these Terms from time to time.</li>
                  <li>For material changes, we'll notify you via email or within the Service.</li>
                  <li>Continued use of the Service after changes indicates acceptance of the updated Terms.</li>
                </ul>
              </div>

              {/* Governing Law */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-2300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  9. Governing Law
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  These Terms are governed by the laws of India, without regard to conflict of law principles.
                </p>
              </div>

              {/* Contact Us */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-2500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  10. Contact Us
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  If you have questions or concerns about these Terms, please reach out to us at:
                  <br />
                  <a
                    href="mailto:outflowapp@gmail.com"
                    className="underline hover:text-white"
                  >
                    outflowapp@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Termsofservice;