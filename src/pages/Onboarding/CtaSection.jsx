// In src/pages/Onboarding/CtaSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Download, Rocket, ArrowRight } from 'lucide-react';

const CtaSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleDownload = () => {
    navigate('/download');
  };

  return (
    <section id="get-started" className="relative py-20 sm:py-24 md:py-32 overflow-hidden">
      {/* Background with gradient and subtle pattern */}
      <div className="absolute inset-0 bg-[#0D0D0D]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D] opacity-90"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="block text-white">Ready to Take Control of</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-outflow-accent to-purple-400">Your Finances?</span>
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial habits with OUTFLOW. 
            Start your journey to financial clarity today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-outflow-accent hover:bg-outflow-accent/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-outflow-accent/20 hover:shadow-outflow-accent/30 transition-all duration-300 group"
            >
              <Rocket className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full sm:w-auto border-2 border-white/20 hover:border-white/40 hover:bg-white/5 px-8 py-6 text-lg rounded-xl transition-all duration-300 group"
            >
              <Download className="mr-2 h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
              Download App
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;