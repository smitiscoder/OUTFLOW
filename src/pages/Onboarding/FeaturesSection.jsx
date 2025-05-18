import React, { useState } from "react";
import { features } from "../../components/lib/features";
import {
  Shield,
  Cloud,
  FileText,
  CalendarDays,
  Zap,
  Lock,
  Eye,
  Smartphone,
  Ban
} from "lucide-react";

const FeatureIcon = ({ icon, isHovered }) => {
  const iconMap = {
    "⚡": <Zap className={`h-10 w-10 transition-all ${isHovered ? "text-white scale-110" : "text-outflow-accent"}`} />, 
    "🔒": <Lock className={`h-10 w-10 transition-all ${isHovered ? "text-white scale-110" : "text-outflow-accent"}`} />,
    "📊": <CalendarDays className={`h-10 w-10 transition-all ${isHovered ? "text-white scale-110" : "text-outflow-accent"}`} />,
    "📈": <Cloud className={`h-10 w-10 transition-all ${isHovered ? "text-white scale-110" : "text-outflow-accent"}`} />,
    "👁️": <Eye className={`h-10 w-10 transition-all ${isHovered ? "text-white scale-110" : "text-outflow-accent"}`} />,
    "📱": <Smartphone className={`h-10 w-10 transition-all ${isHovered ? "text-white scale-110" : "text-outflow-accent"}`} />,
    "🚫": <Ban className={`h-10 w-10 transition-all ${isHovered ? "text-white scale-110" : "text-outflow-accent"}`} />,
  };

  return (
    <div
      className={`p-3 rounded-xl mb-6 transition-all duration-300 ${
        isHovered ? "border border-white bg-white/5" : "border border-transparent bg-outflow-accent/10"
      }`}
    >
      {iconMap[icon]}
    </div>
  );
};

const FeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section id="features" className="section-padding bg-outflow-darkgray relative py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Powerful Features</h2>
          <div className="h-1 w-20 bg-outflow-accent mx-auto mb-6"></div>
          <p className="text-white/70 text-lg">
            Everything you need to take control of your financial life in one elegant app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`p-8 bg-black/10 rounded-2xl transition-all duration-300 group hover:border-white hover:bg-white/5 ${
                  hoveredIndex === index ? "border border-white shadow-xl" : "border border-transparent"
                }`}
              >
                <FeatureIcon icon={feature.icon} isHovered={hoveredIndex === index} />
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>

              {/* Hover Dialog */}
              {hoveredIndex === index && (
                <div className="absolute left-0 top-full mt-4 w-full bg-black rounded-xl p-6 border border-white shadow-xl z-50">
                  <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-white/70 text-sm">{feature.moreInfo}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;