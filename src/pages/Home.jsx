import React, { useState, useEffect } from 'react';
import { useExpenses } from '../Context/ExpenseContext';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { PieChart, Pie, Cell } from 'recharts';
import BottomNav from '../components/BottomNavbar';
import { Calendar as CalendarIcon, ShoppingCart, Utensils, Bus, Shirt, Gift } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { format } from 'date-fns';

const COLORS = [
  "#D4AF37", "#20B2AA", "#FF6B6B", "#00FA9A",
  "#66BB6A", "#9C27B0", "#03A9F4", "#F4A261",
];

// Map categories to icons
const categoryIcons = {
  transport: <Bus className="w-5 h-5" />,
  groceries: <ShoppingCart className="w-5 h-5" />,
  food: <Utensils className="w-5 h-5" />,
  clothing: <Shirt className="w-5 h-5" />,
  // Add more mappings as needed
};

const getIconForCategory = (category) => {
  const key = category?.toLowerCase();
  return categoryIcons[key] || <Gift className="w-5 h-5" />;
};

const Home = () => {
  const { expenses, setExpenses } = useExpenses();
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();

  const fetchExpenses = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(db, 'expenses'), where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expensesData = [];

      querySnapshot.forEach((doc) => {
        const expense = doc.data();
        const amount = expense.amount && !isNaN(expense.amount)
          ? Number(expense.amount)
          : 0;

        let timestamp;
        if (expense.timestamp && typeof expense.timestamp.toDate === 'function') {
          timestamp = expense.timestamp.toDate();
        } else if (expense.timestamp instanceof Date) {
          timestamp = expense.timestamp;
        } else {
          timestamp = new Date();
        }

        expensesData.push({
          id: doc.id,
          ...expense,
          amount,
          timestamp
        });
      });

      const sortedExpenses = expensesData.sort((a, b) => b.timestamp - a.timestamp);
      setExpenses(sortedExpenses);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching expenses: ", error);
      setLoading(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchExpenses();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Category-wise pie data
  const categoryData = expenses.reduce((acc, expense) => {
    const existingCategory = acc.find(item => item.category === expense.category);
    if (existingCategory) {
      existingCategory.amount += expense.amount;
    } else {
      acc.push({ category: expense.category, amount: expense.amount });
    }
    return acc;
  }, []);

  const sortedCategories = categoryData.sort((a, b) => b.amount - a.amount);
  const topCategories = sortedCategories.slice(0, 4);
  const othersTotal = sortedCategories.slice(4).reduce((sum, category) => sum + category.amount, 0);
  const finalCategoryData = [...topCategories];
  if (othersTotal > 0) {
    finalCategoryData.push({ category: 'Others', amount: othersTotal });
  }

  // Group expenses by date
  const groupedByDate = expenses.reduce((acc, expense) => {
    const dateStr = format(expense.timestamp, 'dd MMM EEEE');
    if (!acc[dateStr]) {
      acc[dateStr] = { total: 0, items: [] };
    }
    acc[dateStr].items.push(expense);
    acc[dateStr].total += expense.amount;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      <div className="max-w-md mx-auto px-4">
        <header className="py-4 flex items-center justify-between">
          <div className="flex justify-center items-center mt-6">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full mr-2"></div>
            <h1 className="text-2xl font-bold">OUTFLOW</h1>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 bg-gray-800 rounded hover:bg-gray-700">
                <CalendarIcon className="w-6 h-6" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="z-50 bg-white rounded-lg p-3 text-black shadow-xl w-auto" align="end">
              <Calendar 
                mode="single" 
                selected={date} 
                onSelect={setDate} 
                initialFocus 
                className="p-1" 
              />
            </PopoverContent>
          </Popover>
        </header>

        {/* Pie Chart */}
        <div 
          className="flex justify-center items-center my-4 cursor-pointer"
          onClick={() => navigate('/reports')}
        >
          <div className="relative w-64 h-64">
            {expenses.length > 0 ? (
              <>
                <PieChart width={256} height={256}>
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
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xl font-bold">₹{Math.round(totalSpent)}</p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-full">
                <p className="text-gray-400">No expenses</p>
              </div>
            )}
          </div>
        </div>

        {/* Expense List */}
        <div className="mt-4">
          {loading ? (
            <p className="text-center text-gray-400">Loading expenses...</p>
          ) : Object.entries(groupedByDate).map(([dateStr, { total, items }]) => (
            <div key={dateStr} className="mb-6">
              <div className="flex justify-between items-center text-gray-400 text-sm mb-2">
                <span>{dateStr}</span>
                <span>Expenses: ₹{total}</span>
              </div>
              {items.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg shadow mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
                      {getIconForCategory(expense.category)}
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">{expense.category}</p>
                    </div>
                  </div>
                  <p className="text-white font-semibold whitespace-nowrap">₹{Math.round(expense.amount)}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Home;


















