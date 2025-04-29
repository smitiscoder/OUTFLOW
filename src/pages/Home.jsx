import React, { useState, useEffect, useRef } from 'react';
import { useExpenses } from '../Context/ExpenseContext';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { PieChart, Pie, Cell } from 'recharts';
import BottomNav from '../components/BottomNavbar';
import { ShoppingCart, Utensils, FileText, Mic, Stethoscope, Users, Bus, Scissors, Car, BookOpen, TrendingUp, Gift, Plane, Shield, Dog, CreditCard, Pen, Wrench, Smartphone, Baby, Cookie, Apple, Salad, Banknote, Trash2 } from 'lucide-react';
import MonthYearCalendar from '../components/MonthYearCalendar';
import { format } from 'date-fns';

const COLORS = [
  "#D4AF37", "#20B2AA", "#FF6B6B", "#00FA9A",
  "#66BB6A", "#9C27B0", "#03A9F4", "#F4A261",
];

const categoryIcons = {
  shopping: <ShoppingCart className="w-5 h-5" />,
  food: <Utensils className="w-5 h-5" />,
  grocery: <Salad className="w-5 h-5" />,
  bills: <FileText className="w-5 h-5" />,
  entertainment: <Mic className="w-5 h-5" />,
  health: <Stethoscope className="w-5 h-5" />,
  social: <Users className="w-5 h-5" />,
  transportation: <Bus className="w-5 h-5" />,
  beauty: <Scissors className="w-5 h-5" />,
  vehicle: <Car className="w-5 h-5" />,
  education: <BookOpen className="w-5 h-5" />,
  investment: <TrendingUp className="w-5 h-5" />,
  housing_repair: <Wrench className="w-5 h-5" />,
  gifts_donations: <Gift className="w-5 h-5" />,
  travel: <Plane className="w-5 h-5" />,
  insurance: <Shield className="w-5 h-5" />,
  subscriptions: <CreditCard className="w-5 h-5" />,
  pets: <Dog className="w-5 h-5" />,
  emi_loans: <Banknote className="w-5 h-5" />,
  electronics: <Smartphone className="w-5 h-5" />,
  kids: <Baby className="w-5 h-5" />,
  snacks: <Cookie className="w-5 h-5" />,
  fruits: <Apple className="w-5 h-5" />,
  others: <Pen className="w-5 h-5" />,
};

const getIconForCategory = (category) => {
  const key = category?.toLowerCase();
  return categoryIcons[key] || <Gift className="w-5 h-5" />;
};

const Home = () => {
  const { expenses, setExpenses } = useExpenses();
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();

  const fetchExpenses = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    let q = query(collection(db, 'expenses'), where('userId', '==', userId));

    if (date) {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      q = query(
        collection(db, 'expenses'),
        where('userId', '==', userId),
        where('timestamp', '>=', startOfMonth),
        where('timestamp', '<=', endOfMonth)
      );
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expensesData = [];

      querySnapshot.forEach((doc) => {
        const expense = doc.data();
        const amount = !isNaN(expense.amount) ? Number(expense.amount) : 0;

        let timestamp;
        if (expense.timestamp?.toDate) timestamp = expense.timestamp.toDate();
        else if (expense.timestamp instanceof Date) timestamp = expense.timestamp;
        else if (typeof expense.timestamp === 'string') timestamp = new Date(expense.timestamp);
        else if (typeof expense.timestamp === 'number') timestamp = new Date(expense.timestamp);
        else timestamp = new Date(0); // fallback

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
    return () => unsubscribe?.();
  }, [date]);

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.category === expense.category);
    if (existing) existing.amount += expense.amount;
    else acc.push({ category: expense.category, amount: expense.amount });
    return acc;
  }, []);

  const sortedCategories = categoryData.sort((a, b) => b.amount - a.amount);
  const topCategories = sortedCategories.slice(0, 4);
  const othersTotal = sortedCategories.slice(4).reduce((sum, item) => sum + item.amount, 0);
  const finalCategoryData = [...topCategories];
  if (othersTotal > 0) finalCategoryData.push({ category: 'Others', amount: othersTotal });

  const groupedByDate = expenses.reduce((acc, expense) => {
    const dateStr = format(expense.timestamp, 'dd MMM EEEE');
    if (!acc[dateStr]) acc[dateStr] = { total: 0, items: [] };
    acc[dateStr].items.push(expense);
    acc[dateStr].total += expense.amount;
    return acc;
  }, {});

  const handleDelete = async (expenseId) => {
    try {
      await deleteDoc(doc(db, 'expenses', expenseId));
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
      setSelectedExpense(null); // Reset selection after deletion
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleExpenseSelect = (expenseId) => {
    setSelectedExpense(selectedExpense === expenseId ? null : expenseId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20 relative">
      {/* Overlay for blur effect when an expense is selected */}
      {selectedExpense && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 backdrop-blur-sm"
          onClick={() => setSelectedExpense(null)}
        />
      )}

      <div className="max-w-md mx-auto px-4">
        <header className="py-4 flex items-center justify-between">
          <div className="flex justify-center items-center mt-6">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full mr-2"></div>
            <h1 className="text-2xl font-bold">OUTFLOW</h1>
          </div>
          <MonthYearCalendar selectedDate={date} onDateChange={setDate} />
        </header>

        <div className="flex justify-center items-center my-4 cursor-pointer" onClick={() => navigate('/reports')}>
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-2xl font-bold">{Math.round(totalSpent)}</p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-full">
                <p className="text-gray-400 text-sm">No expenses</p>
                <p className="text-gray-500 text-xs mt-1">Add some to begin</p>
              </div>
            )}
          </div>
        </div>

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
                <div
                  key={expense.id}
                  className={`flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg shadow mb-2 relative transition-all duration-200 ${selectedExpense === expense.id ? 'z-20 transform scale-105' : ''}`}
                  onClick={() => handleExpenseSelect(expense.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
                      {getIconForCategory(expense.category)}
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">{expense.note || expense.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <p className="text-white font-semibold whitespace-nowrap mr-3">₹{Math.round(expense.amount)}</p>
                    {selectedExpense === expense.id && (
                      <button 
                        className="p-2 text-red-500 hover:bg-red-500 hover:bg-opacity-20 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(expense.id);
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
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























