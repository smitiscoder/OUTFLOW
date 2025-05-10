import React from 'react';

export default function SpendingList({ processedData }) {
  return (
    <div className="space-y-4">
      {processedData.map(item => (
        <div key={item.name} className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
          <div className="flex-1 text-sm capitalize">{item.name.toLowerCase()}</div>
          <div className="text-sm font-medium text-[#DFDFDF] mr-3">₹{item.spent}</div>
          <div className="text-xs text-[#DFDFDF] text-opacity-60 w-12 text-right">
            {item.percentage.toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  );
}
