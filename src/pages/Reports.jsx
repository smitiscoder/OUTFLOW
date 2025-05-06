import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import Header from '../components/Header';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = [
  "#D4AF37", "#20B2AA", "#FF6B6B", "#00FA9A", 
  "#66BB6A", "#9C27B0", "#03A9F4", "#F4A261"
];

export default function ReportsScreen() {
  const [timeframe, setTimeframe] = useState('month');
  const [processedData, setProcessedData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [userExpenses, setUserExpenses] = useState([]);
  const auth = getAuth();
  const db = getFirestore();
  const now = new Date(); // ✅ Make 'now' available everywhere

  const timeframes = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' },
  ];

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserExpenses(expenses);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filteredExpenses = [];

    const getClonedDate = () => new Date(now.getTime());

    switch (timeframe) {
      case 'week':
        const oneWeekAgo = getClonedDate();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredExpenses = userExpenses.filter(exp =>
          new Date(exp.timestamp?.toDate?.() || exp.timestamp) >= oneWeekAgo
        );
        break;
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filteredExpenses = userExpenses.filter(exp =>
          new Date(exp.timestamp?.toDate?.() || exp.timestamp) >= startOfMonth
        );
        break;
      case 'quarter':
        const threeMonthsAgo = getClonedDate();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        filteredExpenses = userExpenses.filter(exp =>
          new Date(exp.timestamp?.toDate?.() || exp.timestamp) >= threeMonthsAgo
        );
        break;
      case 'year':
        const startOfYear = new Date(now.getFullYear(), 0, 1); // ✅ Start of current year
        filteredExpenses = userExpenses.filter(exp =>
          new Date(exp.timestamp?.toDate?.() || exp.timestamp) >= startOfYear
        );
        break;
      default:
        filteredExpenses = userExpenses;
    }

    const categoryMap = filteredExpenses.reduce((acc, expense) => {
      const category = expense.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {});

    let sortedCategories = Object.entries(categoryMap)
      .map(([name, spent]) => ({ name, spent: Math.round(spent) }))
      .sort((a, b) => b.spent - a.spent);

    let finalData = [];
    let othersTotal = 0;

    sortedCategories.forEach((item, index) => {
      if (index < 4) {
        finalData.push({
          ...item,
          color: COLORS[index % COLORS.length]
        });
      } else {
        othersTotal += item.spent;
      }
    });

    if (othersTotal > 0) {
      finalData.push({
        id: 5,
        name: 'Others',
        spent: Math.round(othersTotal),
        color: COLORS[4 % COLORS.length],
      });
    }

    const calculatedTotal = finalData.reduce((sum, item) => sum + item.spent, 0);

    finalData = finalData.map(item => ({
      ...item,
      percentage: calculatedTotal > 0 ? (item.spent / calculatedTotal) * 100 : 0
    }));

    setProcessedData(finalData);
    setTotalSpent(calculatedTotal);
  }, [userExpenses, timeframe]);

  const getDaysInTimeframe = () => {
    switch (timeframe) {
      case 'week':
        return 7;
      case 'month':
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(); // days in current month
      case 'quarter':
        return 90;
      case 'year':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const today = new Date();
        const diffTime = Math.abs(today - startOfYear);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // exact days since Jan 1st
      default:
        return 30;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      <Header title="Reports" />

      <div className="container mx-auto px-4 pb-20 max-w-md">
        <div className="flex flex-wrap justify-between gap-2 mt-6 mb-6">
          {timeframes.map(item => (
            <button
              key={item.id}
              onClick={() => setTimeframe(item.id)}
              className={`flex-1 min-w-[23%] px-2 py-2 rounded-full text-sm font-medium transition-colors ${
                timeframe === item.id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-[#DFDFDF]' : 'bg-[#1A1A1A] text-[#DFDFDF] text-opacity-60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-6">Spending by Category</h2>

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

          <div className="space-y-4">
            {processedData.map(item => (
              <div key={item.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-1 text-sm capitalize">{item.name.toLowerCase()}</div>
                <div className="text-sm font-medium text-[#DFDFDF] mr-3">₹{item.spent}</div>
                <div className="text-xs text-[#DFDFDF] text-opacity-60 w-12 text-right">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

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
      </div>
    </div>
  );
}

