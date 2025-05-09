import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useExpenses } from '../../Context/ExpenseContext';
import BottomNav from '../../components/BottomNavbar';
import MonthYearCalendar from '../../components/MonthYearCalendar';
import PieChart from './PieChart';
import BudgetInfo from './Budgetinfo';
import ExpenseList from './ExpenseList';
import { fetchExpenses, fetchBudget } from './DataFiltering';

const HomeMain = () => {
  const [currentDate, setCurrentDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [budget, setBudget] = useState(null);

  const { expenses, setExpenses } = useExpenses();
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeExpenses = fetchExpenses(auth, currentDate, setExpenses, setLoading);
    const unsubscribeBudget = fetchBudget(auth, setBudget);

    return () => {
      unsubscribeExpenses && unsubscribeExpenses();
      unsubscribeBudget && unsubscribeBudget();
    };
  }, [currentDate, auth, setExpenses]);

  const handleDateChange = (year, month) => {
    setCurrentDate({ year, month });
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF] pb-20">
      <div className="container mx-auto px-4 max-w-md relative">
        {selectedExpense && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 backdrop-blur-sm"
            onClick={() => setSelectedExpense(null)}
          />
        )}

        <header className="py-4 flex items-center justify-between mt-6">
          <h1 className="text-2xl font-bold">OUTFLOW</h1>
          <div className="flex items-center gap-4">
            <MonthYearCalendar selectedDate={currentDate} onDateChange={handleDateChange} />
          </div>
        </header>

        <PieChart navigate={navigate} />
        {expenses && <BudgetInfo budget={budget} expenses={expenses} />} {/* Render only if expenses is defined */}
        <ExpenseList
          loading={loading}
          selectedExpense={selectedExpense}
          setSelectedExpense={setSelectedExpense}
        />
        <BottomNav />
      </div>
    </div>
  );
};

export default HomeMain;