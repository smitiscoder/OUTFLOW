// In src/pages/Onboarding/CtaSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Download, Rocket } from 'lucide-react';

const CtaSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleDownload = () => {
    navigate('/download');
  };

  return (
    <section id="get-started" className="section-padding bg-outflow-black relative py-12 sm:py-16 md:py-24 lg:py-32">
      <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-6 sm:p-8 md:p-12 overflow-hidden relative">
          {/* Gradient background effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-outflow-accent via-purple-500 to-outflow-accent animate-gradient-shift bg-[length:200%_200%] blur-sm rounded-xl"></div>
          <div className="bg-outflow-black rounded-lg p-6 sm:p-8 md:p-12 lg:p-16 relative z-10">
            <span className="inline-block rounded-full bg-outflow-accent/20 px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium text-outflow-accent-light mb-4 sm:mb-6">
              Start Today
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-white/70 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 max-w-full sm:max-w-2xl mx-auto">
              Join thousands of users who have transformed their financial habits with OUTFLOW. 
              Start your journey to financial clarity today.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center">
              <Button
                onClick={handleGetStarted}
                className="button-primary text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-6 rounded-lg shadow-md shadow-outflow-accent/30 hover:shadow-outflow-accent/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center"
              >
                <Rocket className="mr-2 w-3.5 sm:w-4 md:w-5" />
                Get Started Now
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                id="download"
                className="button-secondary text-xs sm:text-sm md:text-base py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-6 rounded-lg shadow-md shadow-white/10 hover:shadow-white/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center"
              >
                <Download className="mr-2 w-3.5 sm:w-4 md:w-5" />
                Download App
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;