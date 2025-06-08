import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const timeframes = [
  { id: '3months', label: 'Last 3 Months' },
  { id: '6months', label: 'Last 6 Months' },
  { id: '12months', label: 'Last 12 Months' },
];

export default function BarGraphScreen() {
  const [timeframe, setTimeframe] = useState('3months');
  const [chartData, setChartData] = useState([]);
  const [userExpenses, setUserExpenses] = useState([]);
  const [userBudgets, setUserBudgets] = useState([]);
  const auth = getAuth();
  const db = getFirestore();
  const now = new Date();
  const navigate = useNavigate();

  // Fetch expenses
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
    }, (error) => {
      console.error('Error fetching expenses:', error);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  // Fetch budgets
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(
      collection(db, 'budgets'),
      where('year', '>=', now.getFullYear() - 1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const budgets = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((budget) => budget.id.startsWith(userId));
      setUserBudgets(budgets);
    }, (error) => {
      console.error('Error fetching budgets:', error);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  // Process data for the chart
  useEffect(() => {
    let monthsBack = 3;
    if (timeframe === '6months') monthsBack = 6;
    if (timeframe === '12months') monthsBack = 12;

    const startDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const filteredExpenses = userExpenses.filter((exp) => {
      const expDate = new Date(exp.timestamp?.toDate?.() || exp.timestamp);
      return expDate >= startDate && expDate <= endDate;
    });

    const expenseByMonth = {};
    filteredExpenses.forEach((exp) => {
      const expDate = new Date(exp.timestamp?.toDate?.() || exp.timestamp);
      const monthKey = `${expDate.getFullYear()}-${expDate.getMonth() + 1}`;
      expenseByMonth[monthKey] = (expenseByMonth[monthKey] || 0) + exp.amount;
    });

    const budgetByMonth = {};
    userBudgets.forEach((budget) => {
      const budgetDate = new Date(budget.year, budget.month - 1, 1);
      if (budgetDate >= startDate && budgetDate <= endDate) {
        const monthKey = `${budget.year}-${budget.month}`;
        budgetByMonth[monthKey] = budget.amount;
      }
    });

    const data = [];
    for (let i = monthsBack - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      const expenses = expenseByMonth[monthKey] || 0;
      const budget = budgetByMonth[monthKey] || 0;
      const savings = budget - expenses;

      data.push({
        name: monthName,
        expenses: Math.round(expenses),
        savings: Math.round(savings > 0 ? savings : 0),
      });
    }

    setChartData(data);
  }, [userExpenses, userBudgets, timeframe]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      {/* Fixed Header with Back Button */}
      <div className="fixed top-0 left-0 right-0 bg-[#0D0D0D]/95 backdrop-blur-sm z-50 border-b border-[#1A1A1A]">
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="h-16 sm:h-20 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-[#1A1A1A] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">Stacked Bar Graph</h1>
          </div>
        </div>
      </div>

      {/* Main Content with proper spacing for fixed header */}
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 md:px-8 pb-20">
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto space-y-6 sm:space-y-8">
          {/* Timeframe Selector */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {timeframes.map((item) => (
              <button
                key={item.id}
                onClick={() => setTimeframe(item.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-colors ${
                  timeframe === item.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#1A1A1A] text-[#DFDFDF] hover:bg-[#252525]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Chart Container */}
          <div className="bg-[#1A1A1A] rounded-xl p-4 sm:p-6 shadow-lg">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6 text-center">
              Expenses vs. Savings
            </h2>
            {chartData.length > 0 ? (
              <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#DFDFDF"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      stroke="#DFDFDF"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value) => `₹${value.toLocaleString()}`}
                      contentStyle={{ 
                        backgroundColor: '#1A1A1A', 
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      labelStyle={{ color: '#DFDFDF' }}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        paddingTop: '20px',
                        fontSize: '12px'
                      }} 
                    />
                    <Bar 
                      dataKey="expenses" 
                      stackId="a" 
                      fill="#8884d8" 
                      name="Expenses (₹)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="savings" 
                      stackId="a" 
                      fill="#82ca9d" 
                      name="Savings (₹)" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-[#DFDFDF] text-opacity-60 text-sm sm:text-base">
                  No data available for the selected timeframe
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}