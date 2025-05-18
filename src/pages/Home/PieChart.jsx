import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, defs } from 'recharts';
import { useExpenses } from '../../Context/ExpenseContext'; // Updated path
import { COLORS } from './constants';

const createGradientId = (index) => `gradient-${index}`;

const PieChart = ({ navigate }) => {
  const { expenses } = useExpenses();

  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find((item) => item.category === expense.category);
    if (existing) existing.amount += expense.amount;
    else acc.push({ category: expense.category, amount: expense.amount });
    return acc;
  }, []);

  const sortedCategories = categoryData.sort((a, b) => b.amount - a.amount);
  const topCategories = sortedCategories.slice(0, 4);
  const othersTotal = sortedCategories.slice(4).reduce((sum, item) => sum + item.amount, 0);
  const finalCategoryData = [...topCategories];
  if (othersTotal > 0) finalCategoryData.push({ category: 'Others', amount: othersTotal });

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const formatNumber = (num) => {
    return num % 1 === 0 ? num : num.toFixed(2);
  };

  return (
    <div className="flex justify-center items-center my-4 cursor-pointer" onClick={() => navigate('/reports')}>
      <div className="relative w-64 h-64">
        {expenses.length > 0 ? (
          <>
            <RechartsPieChart width={256} height={256}>
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient key={createGradientId(index)} id={createGradientId(index)} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={color[0]} />
                    <stop offset="100%" stopColor={color[1]} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={finalCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="amount"
                stroke="none"
              >
                {finalCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#${createGradientId(index % COLORS.length)})`} />
                ))}
              </Pie>
            </RechartsPieChart>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-2xl font-bold">{formatNumber(totalSpent)}</p>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <p className="text-[#DFDFDF] text-opacity-40 text-sm">No expenses</p>
            <p className="text-[#DFDFDF] text-opacity-30 text-xs mt-1">Add some to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChart;