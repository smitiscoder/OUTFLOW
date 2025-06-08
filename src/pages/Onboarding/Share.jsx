import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy } from "lucide-react";

const Sharepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const shareLink = "https://outfloww.vercel.app/onboarding"; // Replace with your actual link

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Hide message after 2 seconds
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
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
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">Share Outflow</h1>
          </div>
        </div>
      </div>

      {/* Main Content with proper spacing for fixed header */}
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 md:px-8 pb-20">
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
          {/* Background (subtle gradient) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_70%)] -z-10" />
          
          <div className="container-section relative z-10 w-full px-4 sm:px-6 md:px-8 max-w-7xl">
            <div className="max-w-[90%] sm:max-w-3xl mx-auto text-center">
              {/* Title */}
              <div
                className={`mt-16 sm:mt-20 md:mt-24 transition-all duration-1000 delay-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Spread the Word About Outflow
                </h2>
              </div>

              {/* Introduction */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Invite Others to Outflow
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed text-left">
                  Love tracking your expenses with <strong>Outflow</strong>? Share the joy of financial clarity with friends, family, or colleagues! Our simple, ad-free platform helps everyone manage their money effortlessly. Use the link below to invite others to join the Outflow community and start their journey to smarter spending.
                </p>
              </div>

              {/* Share Link */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Share Your Link
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-left">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 w-full bg-gray-800 text-white/80 text-sm sm:text-base md:text-lg p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors w-full sm:w-auto min-w-[100px]"
                    aria-label="Copy share link"
                  >
                    <Copy size={16} className="sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Copy</span>
                  </button>
                </div>
                {copied && (
                  <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-green-400 text-left">
                    Link copied to clipboard!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sharepage;