import React, { useState, useEffect } from 'react';
import { useExpenses } from '../Context/ExpenseContext';
import Header from '../components/Header';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33A1', 
  '#A133FF', '#FFC300', '#DAF7A6', '#C70039'
];

export default function ReportsScreen() {
  const { expenses } = useExpenses();
  const [timeframe, setTimeframe] = useState('month');
  const [processedData, setProcessedData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);

  const timeframes = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' },
  ];

  useEffect(() => {
    // Filter expenses based on selected timeframe
    const now = new Date();
    let filteredExpenses = [];

    switch(timeframe) {
      case 'week':
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
        filteredExpenses = expenses.filter(exp => 
          new Date(exp.timestamp?.toDate?.() || exp.timestamp) >= oneWeekAgo
        );
        break;
      case 'month':
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        filteredExpenses = expenses.filter(exp => 
          new Date(exp.timestamp?.toDate?.() || exp.timestamp) >= oneMonthAgo
        );
        break;
      case 'quarter':
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
        filteredExpenses = expenses.filter(exp => 
          new Date(exp.timestamp?.toDate?.() || exp.timestamp) >= threeMonthsAgo
        );
        break;
      case 'year':
        const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        filteredExpenses = expenses.filter(exp => 
          new Date(exp.timestamp?.toDate?.() || exp.timestamp) >= oneYearAgo
        );
        break;
      default:
        filteredExpenses = expenses;
    }

    // Group by category and calculate totals
    const categoryMap = filteredExpenses.reduce((acc, expense) => {
      const category = expense.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += expense.amount;
      return acc;
    }, {});

    // Convert to array and sort by amount
    let categoryData = Object.entries(categoryMap).map(([name, spent], index) => ({
      id: index + 1,
      name,
      spent: Math.round(spent),
      color: COLORS[index % COLORS.length]
    })).sort((a, b) => b.spent - a.spent);

    // Get top 4 and group the rest as "Others"
    if (categoryData.length > 4) {
      const topCategories = categoryData.slice(0, 4);
      const othersTotal = categoryData.slice(4).reduce((sum, cat) => sum + cat.spent, 0);
      
      categoryData = [
        ...topCategories,
        { id: 5, name: 'Others', spent: Math.round(othersTotal), color: COLORS[4] }
      ];
    }

    const calculatedTotal = categoryData.reduce((sum, cat) => sum + cat.spent, 0);

    // Calculate percentages
    const finalData = categoryData.map(item => ({
      ...item,
      percentage: calculatedTotal > 0 ? (item.spent / calculatedTotal) * 100 : 0
    }));

    setProcessedData(finalData);
    setTotalSpent(calculatedTotal);
  }, [expenses, timeframe]);

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
            <div className="w-full h-full flex items-center justify-center">
              <PieChart width={300} height={300}>
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
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-lg font-semibold">₹{totalSpent}</span>
                <span className="block text-xs text-gray-400">Total Spent</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {processedData.map(item => (
              <div key={item.id} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                <div className="flex-1 text-sm capitalize">{item.name.toLowerCase()}</div>
                <div className="text-sm font-medium text-white mr-3">₹{item.spent}</div>
                <div className="text-xs text-gray-400 w-12 text-right">{item.percentage.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>

          <div className="flex justify-between border-b border-gray-700 pb-3 mb-3">
            <span className="text-sm text-gray-400">Total Spent</span>
            <span className="text-sm font-medium">₹{totalSpent}</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-3 mb-3">
            <span className="text-sm text-gray-400">Highest Category</span>
            <span className="text-sm font-medium capitalize">
              {processedData[0]?.name.toLowerCase() || 'None'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Average per Day</span>
            <span className="text-sm font-medium">
              ₹{Math.round(totalSpent / (timeframe === 'week' ? 7 : 
                timeframe === 'month' ? 30 : 
                timeframe === 'quarter' ? 90 : 365))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}