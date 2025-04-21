import React from 'react';

const BudgetGauge = ({ spent, total }) => {
  const percentage = (spent / total) * 100;
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        <circle
          className="stroke-gray-700"
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          strokeWidth="12"
        />
        <circle
          className="stroke-accent-purple animate-progress-fill"
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          strokeWidth="12"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-3xl font-bold">${spent.toFixed(2)}</span>
        <span className="text-sm text-gray-400">of ${total.toFixed(2)} budget</span>
      </div>
    </div>
  );
};

export default BudgetGauge;

