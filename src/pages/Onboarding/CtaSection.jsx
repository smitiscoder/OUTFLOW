import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Added this import
import { Button } from '../../components/ui/button';
import { Download, Rocket } from 'lucide-react';

const CtaSection = () => {
  const navigate = useNavigate(); // ✅ Initialized the navigate function

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleDownload = () => {
    navigate('/download');
  };

  return (
    <section id="get-started" className="section-padding bg-outflow-black relative py-32">
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="glass-card p-8 md:p-12 overflow-hidden relative">
          {/* Gradient background effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-outflow-accent via-purple-500 to-outflow-accent animate-gradient-shift bg-[length:200%_200%] blur-sm rounded-xl"></div>
          <div className="bg-outflow-black rounded-lg p-8 md:p-16 relative z-10">
            <span className="inline-block rounded-full bg-outflow-accent/20 px-4 py-1 text-sm font-medium text-outflow-accent-light mb-6">
              Start Today
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of users who have transformed their financial habits with OUTFLOW. 
              Start your journey to financial clarity today.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button
                onClick={handleGetStarted}
                className="button-primary text-base py-6 px-8 rounded-lg shadow-lg shadow-outflow-accent/20 flex items-center"
              >
                <Rocket className="mr-2" size={20} />
                Get Started Now
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                id="download"
                className="button-secondary text-base py-6 px-8 rounded-lg flex items-center"
              >
                <Download className="mr-2" size={20} />
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
