import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden bg-[#0D0D0D]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_70%)]" />
      
      {/* Loading content */}
      <div className="relative p-6 rounded-2xl">
        <div className="flex items-center space-x-3">
          {/* Loading text */}
          <p className="text-[#DFDFDF] font-medium text-xl">
            loading
          </p>

          {/* Animated words */}
          <div className="relative h-8 overflow-hidden">
            <div className="animate-[spinWords_5s_ease-in-out_infinite] flex flex-col space-y-2">
              <span className="h-8 flex items-center text-[#9333EA] font-medium">budget</span>
              <span className="h-8 flex items-center text-[#9333EA] font-medium">save</span>
              <span className="h-8 flex items-center text-[#9333EA] font-medium">record</span>
              <span className="h-8 flex items-center text-[#9333EA] font-medium">track</span>
              <span className="h-8 flex items-center text-[#9333EA] font-medium">analyze</span>
            </div>
          </div>

          {/* Loading dots */}
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#9333EA] animate-[bounce_1s_infinite_0ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#9333EA] animate-[bounce_1s_infinite_200ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#9333EA] animate-[bounce_1s_infinite_400ms]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;

// Add these keyframes to your global CSS file (src/index.css or App.css)
/*
@keyframes spinWords {
  0%, 20% { transform: translateY(0); }
  20%, 40% { transform: translateY(-40px); }
  40%, 60% { transform: translateY(-80px); }
  60%, 80% { transform: translateY(-120px); }
  80%, 100% { transform: translateY(-160px); }
}

@keyframes bounce {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
}
*/