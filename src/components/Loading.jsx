import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden bg-[#0D0D0D]">
      <div className="p-4 rounded-2xl">
        <div className="text-gray-500 font-medium text-[25px] h-[40px] p-2 flex items-center space-x-2 rounded-lg">
          <p>loading</p>
          <div className="relative h-[40px] overflow-hidden">
            <div className="animate-spinWords flex flex-col space-y-1 text-[#9333EA]">
              <span className="h-[40px] flex items-center">Crunching your numbers...</span>
              <span className="h-[40px] flex items-center">Balancing your budget...</span>
              <span className="h-[40px] flex items-center">Setting up your wallet...</span>
              <span className="h-[40px] flex items-center">Analyzing your spending habits...</span>
              <span className="h-[40px] flex items-center">Summing things up..."</span> {/* clone */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;



