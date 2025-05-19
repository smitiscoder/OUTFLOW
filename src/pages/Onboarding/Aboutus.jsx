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
    <section className="min-h-screen flex flex-col items-center py-24 relative overflow-hidden bg-[#0D0D0D] text-white">
      
            <div className="absolute top-6 left-6 flex items-center space-x-2">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-[#1A1A1A]"
              >
                <ArrowLeft size={24} />
              </button>
               <h1 className="text-2xl font-bold">About Us</h1>
            </div>

      {/* Background (keeping just the subtle gradient) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_70%)] -z-10" />

      <div className="container-section relative z-10 w-full px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* About Outflow Section */}
          <div
            className={`mt-24 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              About Outflow
            </h2>
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed text-left">
              At <strong>Outflow</strong>, we're reimagining how individuals track, manage, and understand their money — with simplicity, precision, and purpose.
            </p>
          </div>

          {/* Mission Section */}
          <div
            className={`mt-16 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Our Mission
            </h2>
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed text-left">
              To make professional-grade expense tracking accessible to everyone. Whether you're a student, freelancer, or business owner, we believe financial clarity should be effortless. 
              By combining clean design, smart automation, and real-time insights, we help users stay in control of their finances — without the overwhelm.
            </p>
          </div>

          {/* Vision Section */}
          <div
            className={`mt-16 transition-all duration-1000 delay-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Our Vision
            </h2>
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed text-left">
              To become the go-to platform for personal financial clarity — empowering users to track smarter, spend intentionally, and plan with confidence in a fast-moving world.
            </p>
          </div>

          {/* Our Journey Section */}
          <div
            className={`mt-16 transition-all duration-1000 delay-900 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Our Journey
            </h2>
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed space-y-4 text-left">
              <span>
                Our journey began in 2025 with a simple need — to track personal expenses without being buried in ads,
                subscriptions, or unnecessary complexity. Most money tracking tools on the market were either overly
                complicated, behind paywalls, or designed with businesses in mind, not everyday individuals. We saw an
                opportunity to build something better.
              </span>
              <br />
              <span>
                What started as a personal need — a lightweight, no-nonsense tool for tracking expenses — quickly evolved into a broader mission. Frustrated by cluttered apps and paywalled features, we set out to build a 
                <em> minimal yet powerful </em> expense tracking solution.
              </span>
              <br />
              <span>
                Today, our platform supports a growing community of users who value simplicity, security, and financial self-awareness.
              </span>
              <br />
              <span>
                In 2025, we launched <strong>Outflow</strong> — a minimal, privacy-respecting, and open-access money tracking platform for anyone who values financial awareness. Since then, we've grown with the help of
                our users, who continue to shape our vision with real-world feedback and real financial goals.
              </span>
              <br />
              <span>
                We believe that when people understand their money, they make better decisions — and that's the kind of
                future we're building, together.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutus;
