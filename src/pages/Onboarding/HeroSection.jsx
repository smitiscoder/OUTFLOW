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
    // Navigate to login page
    navigate("/login");
  };

  const handleDownload = () => {
    // Navigate to download page
    navigate("/download");
  };

  const handleExploreFeatures = () => {
    // Scroll to #features section
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center pt-24 pb-16 relative overflow-hidden bg-ododod text-white">
      {/* Background and Particle */}
      <div className="absolute inset-0 bg-[#020106] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_70%)] -z-10" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="shimmer absolute top-[30%] left-[10%] w-32 h-32 opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="shimmer absolute top-[60%] right-[20%] w-64 h-64 opacity-5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="container-section relative z-10 w-full px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Track what matters. Forget the rest.
            </span>
          </h1>

          <p
            className={`text-text-secondary text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Less noise, more numbers. Your finances — organized, always. One tap to track, a lifetime to grow.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              onClick={handleGetStarted}
              className="btn-primary border border-white group transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <Button
              onClick={handleDownload}
              variant="outline"
              className="btn-outline border-white/30 hover:border-white/50 text-white transform transition-all duration-300 hover:bg-white/5 hover:scale-105"
            >
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Explore Features */}
      <div
        onClick={handleExploreFeatures}
        className="absolute bottom-6 left-6 sm:left-10 text-white/60 hover:text-white transition-colors cursor-pointer"
      ></div>
    </section>
  );
};

export default HeroSection;