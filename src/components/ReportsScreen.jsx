import React, { useState } from 'react';
import Header from './Header';
import { categories } from './Data/mockData'; 

export default function ReportsScreen() {
  const [timeframe, setTimeframe] = useState('month');

  const timeframes = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' },
  ];

  const totalSpent = categories.reduce((sum, category) => sum + category.spent, 0);

  const chartData = categories.map(category => ({
    ...category,
    percentage: (category.spent / totalSpent) * 100,
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header title="Reports" />

      <div className="px-4 pb-20">
        <div className="flex justify-between mt-6 mb-6">
          {timeframes.map(item => (
            <button
              key={item.id}
              onClick={() => setTimeframe(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                timeframe === item.id ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-semibold mb-6">Spending by Category</h2>

          <div className="relative h-52 flex items-center justify-center mb-6">
            <div className="w-40 h-40 rounded-full bg-gray-700 relative flex items-center justify-center">
              <div className="absolute w-24 h-24 bg-gray-800 rounded-full flex flex-col items-center justify-center">
                <span className="text-lg font-semibold">${totalSpent.toFixed(2)}</span>
                <span className="text-xs text-gray-400">Total Spent</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {chartData.map(item => (
              <div key={item.id} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                <div className="flex-1 text-sm">{item.name}</div>
                <div className="text-sm font-medium text-white mr-3">${item.spent.toFixed(2)}</div>
                <div className="text-xs text-gray-400 w-12 text-right">{item.percentage.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>

          <div className="flex justify-between border-b border-gray-700 pb-3 mb-3">
            <span className="text-sm text-gray-400">Total Spent</span>
            <span className="text-sm font-medium">${totalSpent.toFixed(2)}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-3 mb-3">
            <span className="text-sm text-gray-400">Highest Category</span>
            <span className="text-sm font-medium">
              {chartData.sort((a, b) => b.spent - a.spent)[0].name}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Average per Day</span>
            <span className="text-sm font-medium">
              ${(totalSpent / 30).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 