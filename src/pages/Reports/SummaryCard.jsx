import React from 'react';

export default function SummaryCard({ totalSpent, processedData, getDaysInTimeframe }) {
  const highestCategory = processedData[0]?.name.toLowerCase() || 'None';
  const highestCategoryColor = processedData[0]?.color?.[0] || '#8B5CF6';

  return (
    <div className="bg-[#1A1A1A] rounded-xl p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">Summary</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#DFDFDF] text-opacity-70">Total Spent</span>
          <span className="text-sm font-semibold">₹{totalSpent}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-[#DFDFDF] text-opacity-70">Highest Category</span>
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: highestCategoryColor }}
            />
            <span className="text-sm font-medium capitalize">{highestCategory}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-[#DFDFDF] text-opacity-70">Average per Day</span>
          <span className="text-sm font-semibold">
            ₹{Math.round(totalSpent / getDaysInTimeframe())}
          </span>
        </div>
      </div>
    </div>
  );
}
