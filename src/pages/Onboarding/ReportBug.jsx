// In src/pages/Onboarding/ReportBug.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bug } from "lucide-react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../components/firebase"; // Adjust path to your firebase.js

const ReportBug = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [bugDescription, setBugDescription] = useState("");
  const [bugCategory, setBugCategory] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      setMessage("Please sign in to report a bug.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (!bugDescription.trim()) {
      setMessage("Please provide a description of the bug.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      await addDoc(collection(db, "bugReports"), {
        username: user.displayName || user.email,
        description: bugDescription.trim(),
        category: bugCategory || "General",
        timestamp: serverTimestamp(),
      });
      setMessage("Bug reported successfully! Thank you!");
      setBugDescription("");
      setBugCategory("");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting bug report:", error);
      setMessage("Failed to report bug. Please try again.");
      setTimeout(() => setMessage(""), 3000);
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
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">Report a Bug</h1>
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
              {/* Title */}
              <div
                className={`mt-16 sm:mt-20 md:mt-24 transition-all duration-1000 delay-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Report an Issue with Outflow
                </h2>
              </div>

              {/* Introduction */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Help Us Fix Bugs
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  Found something off in <strong>Outflow</strong>? Your report helps us make our app better! Please describe the bug you encountered, and optionally select a category. Your input is crucial for improving the Outflow experience.
                </p>
              </div>

              {/* Bug Report Form */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Describe the Bug
                </h2>
                <form onSubmit={handleSubmit} className="text-left">
                  <div className="mb-4">
                    <label className="block text-sm sm:text-base md:text-lg text-white/80 mb-2">
                      Bug Category (Optional)
                    </label>
                    <select
                      value={bugCategory}
                      onChange={(e) => setBugCategory(e.target.value)}
                      className="w-full bg-gray-800 text-white/80 text-sm sm:text-base md:text-lg p-2 sm:p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500"
                    >
                      <option value="">Select a category</option>
                      <option value="UI/UX">UI/UX</option>
                      <option value="Functionality">Functionality</option>
                      <option value="Performance">Performance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <textarea
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value.slice(0, 1000))}
                    placeholder="Describe the bug you encountered..."
                    className="w-full h-24 sm:h-32 bg-gray-800 text-white/80 text-sm sm:text-base md:text-lg p-2 sm:p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
                    maxLength={1000}
                  />
                  <p className="text-xs sm:text-sm text-white/60 mt-2">
                    {bugDescription.length}/1000 characters
                  </p>
                  <button
                    type="submit"
                    className="mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base flex items-center"
                  >
                    <Bug size={20} className="mr-2" />
                    Submit Bug Report
                  </button>
                </form>
                {message && (
                  <p
                    className={`mt-4 text-sm sm:text-base md:text-lg text-left ${
                      message.includes("successfully")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {message}
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

export default ReportBug;