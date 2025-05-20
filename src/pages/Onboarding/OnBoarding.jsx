// In src/pages/Onboarding/Onbording.jsx
import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import ScreenshotsSection from './ScreenshotsSection';
import ReviewsSection from './ReviewsSection';
import CtaSection from './CtaSection';
import Footer from './Footer';
import StickyButtons from './StickyButtons';

const Onbording = () => {
  React.useEffect(() => {
    document.title = "OUTFLOW | Expense Tracking Simplified";

    // Initialize AOS for scroll animations
    const initializeAOS = async () => {
      try {
        const AOS = await import('aos');
        AOS.init({
          duration: 800,
          once: false,
          easing: 'ease-out',
        });
      } catch (error) {
        console.error("Could not initialize AOS:", error);
      }
    };
    
    initializeAOS();
  }, []);
  
  return (
    <div className="min-h-screen bg-outflow-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-6 px-4 bg-outflow-black/90">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">OUTFLOW</h1>
          </div>
          <div className="flex space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-outflow-accent animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-outflow-accent/60 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-outflow-accent/30 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </header>
      
      {/* Sticky buttons that appear after scrolling */}
      <StickyButtons />
      
      {/* Main sections */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <ScreenshotsSection />
        <ReviewsSection />
        <CtaSection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Onbording;