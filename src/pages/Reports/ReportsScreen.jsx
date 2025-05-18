import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { BarChart2, Repeat } from "lucide-react";
import Header from "../../components/Header";
import TimeframeSelector from './TimeframeSelector';
import SpendingPieChart from './SpendingPieChart';
import SpendingList from './SpendingList';
import SummaryCard from './SummaryCard';

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

export default function ReportsScreen() {
  const [timeframe, setTimeframe] = useState('month');
  const [processedData, setProcessedData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [userExpenses, setUserExpenses] = useState([]);
  const auth = getAuth();
  const db = getFirestore();
  const now = new Date();
  const navigate = useNavigate(); // Added for navigation

  const timeframes = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' },
  ];

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(db, 'expenses'), where('userId', '==', userId));

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
        const startOfYear = new Date(now.getFullYear(), 0, 1);
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
          color: COLORS[index % COLORS.length][0]
        });
      } else {
        othersTotal += item.spent;
      }
    });

    if (othersTotal > 0) {
      finalData.push({
        name: 'Others',
        spent: Math.round(othersTotal),
        color: COLORS[4 % COLORS.length][0],
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
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      case 'quarter':
        return 90;
      case 'year':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const today = new Date();
        const diffTime = Math.abs(today - startOfYear);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      default:
        return 30;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      <Header title="Reports" />
      <div className="container mx-auto px-4 pb-20 max-w-md">
        <TimeframeSelector timeframes={timeframes} setTimeframe={setTimeframe} timeframe={timeframe} />
        <SpendingPieChart processedData={processedData} totalSpent={totalSpent} />
        <SpendingList processedData={processedData} />
        <SummaryCard totalSpent={totalSpent} processedData={processedData} getDaysInTimeframe={getDaysInTimeframe} />
        
        <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate('/bar-graphs')}
          className="flex-1 py-2 rounded-full text-sm font-semibold bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <BarChart2 size={16} />
          BarGraph
        </button>
        <button
          onClick={() => navigate('/recurring-expenses')}
          className="flex-1 py-2 rounded-full text-sm font-semibold bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <Repeat size={16} />
          Recurring
        </button>
      </div>
      </div>
    </div>
  );
}
