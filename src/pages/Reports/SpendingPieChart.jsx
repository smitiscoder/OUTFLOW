import React from 'react';
import { PieChart, Pie, Cell, defs } from 'recharts';

const COLORS = [
  ["#8B5CF6", "#6D28D9"], // Purple gradient
  ["#EC4899", "#BE185D"], // Pink gradient
  ["#3B82F6", "#1D4ED8"], // Blue gradient
  ["#10B981", "#047857"], // Green gradient
  ["#F59E0B", "#B45309"], // Amber gradient
  ["#6366F1", "#4338CA"], // Indigo gradient
  ["#14B8A6", "#0F766E"], // Teal gradient
  ["#F472B6", "#BE185D"]  // Pink gradient
];

const createGradientId = (index) => `gradient-${index}`;

export default function SpendingPieChart({ processedData, totalSpent }) {
  return (
    <div className="relative h-72 flex items-center justify-center mb-8">
      <PieChart width={300} height={300}>
        <defs>
          {COLORS.map((color, index) => (
            <linearGradient key={createGradientId(index)} id={createGradientId(index)} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={color[0]} />
              <stop offset="100%" stopColor={color[1]} />
            </linearGradient>
          ))}
        </defs>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          innerRadius={85}
          outerRadius={110}
          paddingAngle={3}
          dataKey="spent"
          stroke="none"
          animationBegin={0}
          animationDuration={1500}
          animateNewValues={true}
        >
          {processedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`url(#${createGradientId(index % COLORS.length)})`}
              className="hover:opacity-80 transition-opacity duration-300"
            />
          ))}
        </Pie>
      </PieChart>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-2xl font-bold text-[#DFDFDF]">₹{totalSpent.toLocaleString()}</span>
        <span className="block text-sm text-[#DFDFDF] text-opacity-70 mt-1 font-medium">Total Spent</span>
      </div>
    </div>
  );
}
