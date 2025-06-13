import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const expenses = payload[0].value;
    const savings = payload[1].value;
    const total = expenses + savings;
    const savingsPercentage = ((savings / total) * 100).toFixed(1);

    return (
      <div className="bg-[#1A1A1A] p-3 rounded-lg shadow-lg border border-[#333333]">
        <p className="text-sm font-medium text-[#DFDFDF] mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#DFDFDF]/70">Expenses</span>
            <span className="text-sm font-medium text-[#DFDFDF]">₹{expenses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#DFDFDF]/70">Savings</span>
            <span className="text-sm font-medium text-[#DFDFDF]">₹{savings.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-[#333333]">
            <span className="text-xs text-[#DFDFDF]/70">Total</span>
            <span className="text-sm font-medium text-[#DFDFDF]">₹{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#DFDFDF]/70">Savings Rate</span>
            <span className="text-sm font-medium text-[#DFDFDF]">{savingsPercentage}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function SavingsAnalysis() {
  const [timeframe, setTimeframe] = useState('3months');
  const [chartData, setChartData] = useState([]);
  const [userExpenses, setUserExpenses] = useState([]);
  const [userBudgets, setUserBudgets] = useState([]);
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalSavings: 0,
    averageSavingsRate: 0,
    trend: 'neutral'
  });
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

  // Process data for the chart and calculate summary
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
    let totalExpenses = 0;
    let totalSavings = 0;
    let savingsRates = [];

    for (let i = monthsBack - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      const expenses = expenseByMonth[monthKey] || 0;
      const budget = budgetByMonth[monthKey] || 0;
      const savings = budget - expenses;
      const savingsRate = budget > 0 ? (savings / budget) * 100 : 0;

      totalExpenses += expenses;
      totalSavings += savings > 0 ? savings : 0;
      savingsRates.push(savingsRate);

      data.push({
        name: monthName,
        expenses: Math.round(expenses),
        savings: Math.round(savings > 0 ? savings : 0),
        savingsRate: Math.round(savingsRate),
      });
    }

    // Calculate trend
    let trend = 'neutral';
    if (savingsRates.length >= 2) {
      const recentRate = savingsRates[savingsRates.length - 1];
      const previousRate = savingsRates[savingsRates.length - 2];
      if (recentRate > previousRate) trend = 'up';
      else if (recentRate < previousRate) trend = 'down';
    }

    setChartData(data);
    setSummary({
      totalExpenses: Math.round(totalExpenses),
      totalSavings: Math.round(totalSavings),
      averageSavingsRate: Math.round(savingsRates.reduce((a, b) => a + b, 0) / savingsRates.length),
      trend
    });
  }, [userExpenses, userBudgets, timeframe]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      {/* Fixed Header */}
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
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">Savings Analysis</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 sm:pt-28 px-4 sm:px-6 md:px-8 pb-20">
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A1A1A] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#DFDFDF]/70">Total Expenses</span>
                <TrendingDown size={16} className="text-red-400" />
              </div>
              <p className="text-xl font-semibold">₹{summary.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#DFDFDF]/70">Total Savings</span>
                <TrendingUp size={16} className="text-green-400" />
              </div>
              <p className="text-xl font-semibold">₹{summary.totalSavings.toLocaleString()}</p>
            </div>
          </div>

          {/* Savings Rate Card */}
          <div className="bg-[#1A1A1A] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#DFDFDF]/70">Average Savings Rate</span>
              {summary.trend === 'up' && <TrendingUp size={16} className="text-green-400" />}
              {summary.trend === 'down' && <TrendingDown size={16} className="text-red-400" />}
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold">{summary.averageSavingsRate}%</p>
              <p className="text-sm text-[#DFDFDF]/60">
                {summary.trend === 'up' ? '↑ Improving' : summary.trend === 'down' ? '↓ Declining' : '→ Stable'}
              </p>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex justify-center gap-2 p-2 bg-[#1A1A1A] rounded-xl">
            {timeframes.map((item) => (
              <button
                key={item.id}
                onClick={() => setTimeframe(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeframe === item.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                    : 'text-[#DFDFDF]/60 hover:text-[#DFDFDF] hover:bg-[#252525]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Chart Container */}
          <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#333333]/30">
            <h2 className="text-base font-semibold mb-4 text-center">Monthly Breakdown</h2>
            {chartData.length > 0 ? (
              <div className="w-full h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                    barGap={0}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#DFDFDF"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      axisLine={{ stroke: '#333' }}
                    />
                    <YAxis 
                      stroke="#DFDFDF"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                      width={60}
                      axisLine={{ stroke: '#333' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ 
                        paddingTop: '20px',
                        fontSize: '12px'
                      }}
                      iconType="circle"
                    />
                    <Bar 
                      dataKey="expenses" 
                      stackId="a" 
                      fill="#8884d8" 
                      name="Expenses" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="savings" 
                      stackId="a" 
                      fill="#82ca9d" 
                      name="Savings" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#DFDFDF]/60">No data available for the selected timeframe</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}