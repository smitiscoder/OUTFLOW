import React from 'react';

export default function TimeframeSelector({ timeframes, setTimeframe, timeframe }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 mt-6 mb-6">
      {timeframes.map(item => (
        <button
          key={item.id}
          onClick={() => setTimeframe(item.id)}
          className={`flex-1 min-w-[23%] px-2 py-2 rounded-full text-sm font-medium transition-colors ${timeframe === item.id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-[#DFDFDF]' : 'bg-[#1A1A1A] text-[#DFDFDF] text-opacity-60'}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

