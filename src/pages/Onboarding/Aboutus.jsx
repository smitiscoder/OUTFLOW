// In src/pages/Onboarding/Aboutus.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Aboutus = () => {
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
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">About Us</h1>
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
              {/* About Outflow Section */}
              <div
                className={`mt-16 sm:mt-20 md:mt-24 transition-all duration-1000 delay-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  About Outflow
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  <strong>Outflow</strong> was born in 2025 from the vision of two students, Smit Nerurkar and Pratima Vishwakarma, as part of an academic project at their university. But from day one, their goal was bigger than a grade or a GitHub repository. They wanted to create a real-world tool that empowers everyone—students, freelancers, retirees—to track their finances with <em>simplicity, clarity, and freedom</em>. Built as a Progressive Web App (PWA), Outflow works seamlessly on any device, from the latest smartphone to an old tablet, ensuring financial clarity is always within reach.
                </p>
              </div>

              {/* Mission Section */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Our Mission
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  We've all struggled with clunky finance apps—ads popping up, paywalls blocking features, or interfaces too complex for daily use. Our mission is to change that. At Outflow, we're dedicated to making professional-grade expense tracking accessible to <em>everyone</em>. Whether you're budgeting for college, managing freelance gigs, or planning retirement, Outflow offers a clean, ad-free experience with intuitive tools and real-time insights to keep your finances under control—without the stress.
                </p>
              </div>

              {/* Vision Section */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Our Vision
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  We envision Outflow as the global go-to platform for personal financial clarity. By blending intuitive design with powerful tools, we aim to empower users to track smarter, spend intentionally, and plan confidently in a fast-paced world. With detailed analytics and budgeting features, we're building a future where financial empowerment is universal, no matter your income or tech savvy.
                </p>
              </div>

              {/* Why PWA Section */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-900 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Why a Progressive Web App?
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  Accessibility is at the heart of Outflow. We chose to build a Progressive Web App (PWA) to ensure our platform works on <em>every device</em>—mobile phones, desktops, tablets, Apple devices, even older models with limited resources. Install Outflow on your home screen for app-like access, and enjoy a lightweight, eco-friendly design that doesn't drain your device's battery. No matter how old your device or where you are, Outflow is there for you.
                </p>
              </div>

              {/* Our Journey Section */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-1100 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Our Journey
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed space-y-4 text-left">
                  <span>
                    In 2025, Smit and Pratima, two computer science students, set out to solve a universal problem: tracking personal expenses without the clutter of existing apps. What began as an academic project quickly became a passion to build something meaningful. Frustrated by ad-heavy, paywalled tools designed for businesses, they envisioned a <em>minimal, user-first</em> solution for everyday people.
                  </span>
                  <br />
                  <span>
                    Their focus on a PWA ensured Outflow could reach anyone, anywhere, on any device. From a student's aging Android to a professional's MacBook, Outflow's lightweight design delivers a seamless experience. Launched in 2025, Outflow gained traction with thousands of users worldwide, from Mumbai to New York, all sharing feedback that shapes our roadmap.
                  </span>
                  <br />
                  <span>
                    Today, Outflow is more than a student project—it's a growing community of users who value simplicity, privacy, and control. We're not just tracking expenses; we're helping people make better financial decisions, one entry at a time.
                  </span>
                </p>
              </div>

              {/* Our Team Section */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-1300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Our Team
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  Outflow was crafted by <strong>Smit Nerurkar</strong> and <strong>Pratima Vishwakarma</strong>, two innovators driven by a shared passion for technology and financial empowerment. Smit, with his knack for clean code and user-centric design, laid the foundation for Outflow's intuitive interface. Pratima, a problem-solver with a vision for accessibility, ensured the PWA could serve users across all devices. Together, they turned a classroom idea into a tool impacting lives globally. We're also a community-driven project—your feedback and contributions help us grow!
                </p>
              </div>

              {/* Our Commitment Section */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-1500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Our Commitment
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  At Outflow, we're committed to three core principles: <em>privacy</em>, <em>accessibility</em>, and <em>continuous improvement</em>. We never sell your data or bombard you with ads. Our PWA ensures free, open access for all, regardless of device or location. And with every user's feedback, we're evolving—adding features like advanced analytics and budgeting tools to make Outflow your trusted financial companion. Join us in building a future where everyone can master their money with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;