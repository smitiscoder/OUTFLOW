import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = [
  "#D4AF37", "#20B2AA", "#FF6B6B", "#00FA9A", 
  "#66BB6A", "#9C27B0", "#03A9F4", "#F4A261"
];

export default function SpendingPieChart({ processedData, totalSpent }) {
  return (
    <div className="relative h-64 flex items-center justify-center mb-8">
      <PieChart width={280} height={280}>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={1}
          dataKey="spent"
          stroke="none"
        >
          {processedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-lg font-semibold">₹{totalSpent}</span>
        <span className="block text-xs text-[#DFDFDF] text-opacity-60">Total Spent</span>
      </div>
    </div>
  );
}

