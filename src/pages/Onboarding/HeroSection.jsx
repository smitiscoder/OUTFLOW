// In src/pages/Onboarding/HeroSection.jsx
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleDownload = () => {
    navigate("/download");
  };

  const handleExploreFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 relative overflow-hidden bg-[#0D0D0D] text-white">
      {/* Background and Particle */}
      <div className="absolute inset-0 bg-[#020106] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_70%)] -z-10" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="shimmer absolute top-[30%] left-[10%] w-24 sm:w-32 h-24 sm:h-32 opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="shimmer absolute top-[60%] right-[20%] w-48 sm:w-64 h-48 sm:h-64 opacity-5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="container-section relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto text-center">
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Track what matters. Forget the rest.
            </span>
          </h1>

          <p
            className={`text-white/70 text-sm sm:text-base md:text-lg lg:text-2xl mb-6 sm:mb-8 md:mb-10 max-w-full sm:max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Less noise, more numbers. Your finances — organized, always. One tap to track, a lifetime to grow.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              onClick={handleGetStarted}
              className="btn-primary text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-6 rounded-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center border border-white/50 hover:border-white group bg-white text-[#0D0D0D] hover:bg-white/90"
            >
              Get Started
              <ArrowRight className="ml-2 w-3.5 sm:w-4 md:w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>

            <Button
              onClick={handleDownload}
              variant="outline"
              className="btn-outline text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-6 rounded-lg shadow-md shadow-white/10 hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center border border-white/30 hover:border-white/50 hover:bg-white/5"
            >
              Download
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;