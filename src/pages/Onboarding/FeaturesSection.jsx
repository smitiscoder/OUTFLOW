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
      className={`p-3 rounded-xl mb-6 transition-all duration-300 ${
        isHovered ? "border border-white bg-white/5" : "border border-transparent bg-outflow-accent/10"
      }`}
    >
      <Icon className={`h-10 w-10 transition-all ${isHovered ? "text-white scale-110" : "text-outflow-accent"}`} />
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
                <FeatureIcon Icon={feature.icon} isHovered={hoveredIndex === index} />
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;