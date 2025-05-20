// In src/pages/Onboarding/FeaturesSection.jsx
import React, { useState } from "react";
import {
  Sparkles,
  RefreshCw,
  BarChart2,
  Lock,
  Smartphone,
  Ban,
} from "lucide-react";

const features = [
  {
    title: "Easy to Use",
    description: "An intuitive interface that lets you manage your finances without a learning curve.",
    icon: Sparkles,
  },
  {
    title: "Real-Time Sync",
    description: "Your data updates instantly across all your devices — no refresh needed.",
    icon: RefreshCw,
  },
  {
    title: "Visual Insights",
    description: "Get charts and trends that help you understand your financial habits at a glance.",
    icon: BarChart2,
  },
  {
    title: "Secure & Private",
    description: "We use bank-grade encryption and never sell your data. Privacy is built in.",
    icon: Lock,
  },
  {
    title: "Available Across Devices",
    description: "Use the app on your phone, tablet, or desktop — your data stays in sync.",
    icon: Smartphone,
  },
  {
    title: "No Ads",
    description: "Enjoy a completely ad-free experience, focused solely on your finances.",
    icon: Ban,
  },
];

const FeatureIcon = ({ Icon, isHovered }) => {
  return (
    <div
      className={`p-2 sm:p-3 rounded-xl mb-4 sm:mb-6 transition-all duration-300 ease-in-out ${
        isHovered ? "bg-white/10 scale-105" : "bg-outflow-accent/10"
      }`}
    >
      <Icon
        className={`h-8 w-8 sm:h-10 sm:w-10 transition-all duration-300 ease-in-out ${
          isHovered
            ? "text-white scale-110 rotate-12 filter drop-shadow-md"
            : "text-outflow-accent"
        }`}
        style={{
          filter: isHovered ? "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))" : "none",
        }}
      />
    </div>
  );
};

const FeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section id="features" className="section-padding bg-outflow-darkgray relative py-8 sm:py-16 md:py-24">
      <div className="max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-full sm:max-w-2xl md:max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Powerful Features
          </h2>
          <div className="h-1 w-16 sm:w-20 bg-outflow-accent mx-auto mb-4 sm:mb-6"></div>
          <p className="text-white/70 text-sm sm:text-base md:text-lg">
            Everything you need to take control of your financial life in one elegant app.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`p-4 sm:p-6 md:p-8 bg-black/10 rounded-2xl transition-all duration-300 ease-in-out group ${
                  hoveredIndex === index
                    ? "border border-white shadow-2xl bg-white/5 -translate-y-2"
                    : "border border-transparent"
                }`}
              >
                <FeatureIcon Icon={feature.icon} isHovered={hoveredIndex === index} />
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/70 text-sm sm:text-base">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;