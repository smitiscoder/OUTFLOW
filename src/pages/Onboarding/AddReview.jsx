// In src/pages/Onboarding/Addreview.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../components/firebase"; // Adjust path to your firebase.js

const Addreview = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
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
      setMessage("Please sign in to submit a review.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (rating === 0) {
      setMessage("Please select a star rating.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      await addDoc(collection(db, "reviews"), {
        username: user.displayName || user.email,
        stars: rating,
        review: review.trim() || "No review provided",
        timestamp: serverTimestamp(),
      });
      setMessage("Review submitted successfully!");
      setRating(0);
      setReview("");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Failed to submit review. Please try again.");
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
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">Add Review</h1>
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
                  Share Your Outflow Experience
                </h2>
              </div>

              {/* Introduction */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Help Us Improve
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed text-left">
                  Your feedback means the world to <strong>Outflow</strong>! Whether you love our simple expense tracking or have ideas to make it better, please share your thoughts. Rate us out of 5 stars and leave a review to help us grow and serve you better.
                </p>
              </div>

              {/* Star Rating */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Rate Outflow
                </h2>
                <div className="flex justify-center space-x-1 sm:space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`cursor-pointer transition-colors sm:w-8 sm:h-8 ${
                        (hoverRating || rating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
              </div>

              {/* Review Form */}
              <div
                className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-1000 delay-900 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Write Your Review
                </h2>
                <form onSubmit={handleSubmit} className="text-left">
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value.slice(0, 500))}
                    placeholder="Share your thoughts about Outflow..."
                    className="w-full h-24 sm:h-32 bg-gray-800 text-white/80 text-sm sm:text-base md:text-lg p-2 sm:p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs sm:text-sm text-white/60 mt-2">
                    {review.length}/500 characters
                  </p>
                  <button
                    type="submit"
                    className="mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Submit Review
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

export default Addreview;