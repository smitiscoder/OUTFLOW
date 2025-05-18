import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import Header from '../../components/Header'; // Adjust path as needed
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
  const [chartData, setChartData] = useState([]); // Combined data for expenses and savings
  const [userExpenses, setUserExpenses] = useState([]);
  const [userBudgets, setUserBudgets] = useState([]);
  const auth = getAuth();
  const db = getFirestore();
  const now = new Date();

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
      where('year', '>=', now.getFullYear() - 1) // Fetch last 12 months
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const budgets = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((budget) => budget.id.startsWith(userId)); // Ensure user-specific budgets
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

    // Filter expenses
    const filteredExpenses = userExpenses.filter((exp) => {
      const expDate = new Date(exp.timestamp?.toDate?.() || exp.timestamp);
      return expDate >= startDate && expDate <= endDate;
    });

    // Aggregate expenses by month
    const expenseByMonth = {};
    filteredExpenses.forEach((exp) => {
      const expDate = new Date(exp.timestamp?.toDate?.() || exp.timestamp);
      const monthKey = `${expDate.getFullYear()}-${expDate.getMonth() + 1}`;
      expenseByMonth[monthKey] = (expenseByMonth[monthKey] || 0) + exp.amount;
    });

    // Aggregate budgets by month
    const budgetByMonth = {};
    userBudgets.forEach((budget) => {
      const budgetDate = new Date(budget.year, budget.month - 1, 1);
      if (budgetDate >= startDate && budgetDate <= endDate) {
        const monthKey = `${budget.year}-${budget.month}`;
        budgetByMonth[monthKey] = budget.amount;
      }
    });

    // Generate chart data
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
        savings: Math.round(savings > 0 ? savings : 0), // Ensure savings is non-negative
      });
    }

    setChartData(data);
  }, [userExpenses, userBudgets, timeframe]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      <Header title="Bar Graphs" />

      <div className="container mx-auto px-4 pb-20 max-w-md">
        {/* Timeframe Selector */}
        <div className="flex flex-wrap justify-between gap-2 mt-6 mb-6">
          {timeframes.map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeframe(item.id)}
              className={`flex-1 min-w-[30%] px-2 py-2 rounded-full text-sm font-medium transition-colors ${
                timeframe === item.id
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-[#DFDFDF]'
                  : 'bg-[#1A1A1A] text-[#DFDFDF] text-opacity-60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Combined Expenses and Savings Chart */}
        <div className="bg-[#1A1A1A] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6">Expenses and Savings</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
                <Bar dataKey="expenses" stackId="a" fill="#8884d8" name="Expenses (₹)" />
                <Bar dataKey="savings" stackId="a" fill="#82ca9d" name="Savings (₹)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-[#DFDFDF] text-opacity-60">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}