
import React from 'react';
import ParticleBackground from './ParticleBackground';
import { ButtonHero } from '../../components/ui/ButtonHero';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
 // const handleGetStarted = () => {
 //   window.location.href = "#get-started";
 // };
  
  const handleDownload = () => {
    window.location.href = "#download";
  };
  
  const scrollToFeatures = () => {
    window.location.href = "#features";
  };
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-700 to-purple-500 text-transparent bg-clip-text">
          Your finances,<br />
          simplified.
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Track expenses, identify patterns, and take control of your financial future with OUTFLOW's intelligent expense management.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link to= "/login">
          <ButtonHero 
           // onClick={handleGetStarted}
            className="bg-outflow-accent hover:bg-outflow-accent-light text-white text-base py-6 px-8 rounded-lg shadow-lg shadow-outflow-accent/20"
          >
            Get Started
          </ButtonHero>
          </Link>



          <ButtonHero 
            onClick={handleDownload}
            variant="outline" 
            className="bg-transparent text-white border border-white/20 hover:bg-white/10 text-base py-6 px-8 rounded-lg"
          >
            Download App
          </ButtonHero>
        </div>
        
        <button 
          onClick={scrollToFeatures} 
          className="mt-20 flex flex-col items-center text-white/50 hover:text-white transition-colors group"
        >
          <span className="text-sm mb-2">Explore Features</span>
          <div className="p-2 rounded-full border border-white/20 group-hover:border-outflow-accent group-hover:bg-outflow-accent/10 transition-all">
            <ArrowDown size={16} className="animate-pulse" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;