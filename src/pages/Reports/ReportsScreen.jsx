import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import Header from "../../components/Header";
import TimeframeSelector from './TimeframeSelector';
import SpendingPieChart from './SpendingPieChart';
import SpendingList from './SpendingList';
import SummaryCard from './SummaryCard';

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
  const now = new Date();

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
          color: COLORS[index % COLORS.length]
        });
      } else {
        othersTotal += item.spent;
      }
    });

    if (othersTotal > 0) {
      finalData.push({
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
      </div>
    </div>
  );
}
