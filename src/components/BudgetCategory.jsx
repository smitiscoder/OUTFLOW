import React from 'react';
import { Car, Music, Fingerprint } from 'lucide-react';

const icons = {
  auto: Car,
  entertainment: Music,
  security: Fingerprint,
};

const colors = {
  auto: 'bg-blue-500',
  entertainment: 'bg-pink-500',
  security: 'bg-purple-500',
};

const BudgetCategory = ({ type, spent, total, remaining }) => {
  const Icon = icons[type];
  const progressColor = colors[type];
  const progress = (spent / total) * 100;

  return (
    <div className="p-4 rounded-xl backdrop-blur-lg bg-white/10 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-gray-300" />
          <div>
            <h3 className="text-white capitalize">{type}</h3>
            <p className="text-sm text-gray-400">${remaining} left to spend</p>
          </div>
        </div>
        <span className="text-white">
          ${spent.toFixed(2)}
          <span className="text-gray-400 text-sm"> of ${total}</span>
        </span>
      </div>
      <div className="h-1 bg-gray-700 rounded-full mt-2">
        <div
          className={`h-full rounded-full ${progressColor} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default BudgetCategory;

