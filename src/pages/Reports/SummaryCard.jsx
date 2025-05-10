import React from 'react';

export default function SummaryCard({ totalSpent, processedData, getDaysInTimeframe }) {
  return (
    <div className="bg-[#1A1A1A] rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#DFDFDF] text-opacity-60">Total Spent</span>
          <span className="text-sm font-medium">₹{totalSpent}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#DFDFDF] text-opacity-60">Highest Category</span>
          <span className="text-sm font-medium capitalize">
            {processedData[0]?.name.toLowerCase() || 'None'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#DFDFDF] text-opacity-60">Average per Day</span>
          <span className="text-sm font-medium">
            ₹{Math.round(totalSpent / getDaysInTimeframe())}
          </span>
        </div>
      </div>
    </div>
  );
}
