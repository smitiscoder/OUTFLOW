// In src/pages/Onboarding/ContactUs.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ContactUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleEmailClick = (e) => {
    e.preventDefault();
    const email = "outflowapp@gmail.com";
    const mailtoLink = `mailto:${email}?subject=Contact%20Outflow%20Support`;

    // Attempt to open mailto link
    window.location.href = mailtoLink;

    // Fallback: Copy email to clipboard after a short delay
    const timeout = setTimeout(() => {
      navigator.clipboard.writeText(email).then(() => {
        setFeedback("No email client detected. Email copied to clipboard: outflowapp@gmail.com");
        setTimeout(() => setFeedback(""), 3000);
      }).catch(() => {
        setFeedback("Failed to copy email. Please contact outflowapp@gmail.com manually.");
      });
    }, 1000);

    // Clear timeout if mailto likely worked (window blur)
    const handleBlur = () => {
      clearTimeout(timeout);
      window.removeEventListener("blur", handleBlur);
    };
    window.addEventListener("blur", handleBlur);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("blur", handleBlur);
    };
  };

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
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">Contact Us</h1>
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
              {/* Contact Information */}
              <div
                className={`mt-16 sm:mt-20 md:mt-24 transition-all duration-1000 delay-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Get in Touch
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  We'd love to hear from you! Whether you have questions, feedback, or need support, please reach out to us at:
                  <br />
                  <a
                    href="#"
                    onClick={handleEmailClick}
                    className="text-xs sm:text-sm md:text-base underline hover:text-white transition-colors"
                    aria-label="Contact Outflow via Email"
                    title="Email us at outflowapp@gmail.com"
                  >
                    outflowapp@gmail.com
                  </a>
                  {feedback && (
                    <p className="text-xs text-white/70 mt-2">{feedback}</p>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;