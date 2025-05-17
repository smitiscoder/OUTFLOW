import React from 'react';
import { useScrollPosition } from '../../components/hooks/useScrollPosition';
import { Button } from '../../components/ui/button';
import { Download, Rocket } from 'lucide-react';

const StickyButtons = () => {
  const { isScrolled } = useScrollPosition();
  
  const handleGetStarted = () => {
    window.location.href = "#get-started";
  };
  
  const handleDownload = () => {
    window.location.href = "#download";
  };
  
  return (
    <div 
      className={`fixed top-6 right-6 z-50 flex gap-3 transition-all duration-700 ${
        isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-[-100%] opacity-0'
      }`}
    >
      <Button 
        onClick={handleGetStarted}
        className="button-primary text-sm py-2 shadow-lg shadow-outflow-accent/20 rounded-lg flex items-center"
      >
        <Rocket className="mr-1" size={16} />
        Get Started
      </Button>
      <Button 
        onClick={handleDownload}
        variant="outline" 
        className="button-secondary text-sm py-2 rounded-lg flex items-center"
      >
        <Download className="mr-1" size={16} />
        Download
      </Button>
    </div>
  );
};

export default StickyButtons;
