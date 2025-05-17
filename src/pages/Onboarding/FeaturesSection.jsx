import React from 'react';
import { features } from '../../components/lib/features';
import { Shield, Cloud, FileText, CalendarDays } from 'lucide-react';

const FeatureIcon = ({ icon }) => {
  const iconMap = {
    "📊": <CalendarDays className="h-10 w-10 text-outflow-accent" />,
    "🔒": <Shield className="h-10 w-10 text-outflow-accent" />,
    "🏷️": <FileText className="h-10 w-10 text-outflow-accent" />,
    "📈": <Cloud className="h-10 w-10 text-outflow-accent" />
  };

  return (
    <div className="p-3 bg-outflow-accent/10 rounded-xl border border-outflow-accent/20 mb-6">
      {iconMap[icon]}
    </div>
  );
};

const FeaturesSection = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="glass-card p-8 transition-all duration-300 hover:translate-y-[-6px] hover:shadow-outflow-accent/20 hover:shadow-xl group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <FeatureIcon icon={feature.icon} />
              <h3 className="text-xl font-bold mb-4 group-hover:text-outflow-accent transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
