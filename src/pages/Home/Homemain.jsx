import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { useExpenses } from '../../Context/ExpenseContext';
import BottomNav from '../../components/BottomNavbar';
import MonthYearCalendar from '../../components/MonthYearCalendar';
import PieChart from './PieChart';
import BudgetInfo from './Budgetinfo';
import ExpenseList from './ExpenseList';
import { fetchBudget } from './DataFiltering';
import Keyboard from './Keyboardhome';

const HomeMain = () => {
  const { expenses, selectedDate, updateSelectedDate, setExpenses } = useExpenses();
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [budget, setBudget] = useState(null);
  const [sanitizedExpenses, setSanitizedExpenses] = useState([]);

  const auth = getAuth();
  const navigate = useNavigate();

  // Sanitize expenses to ensure amounts are numbers
  useEffect(() => {
    const cleanedExpenses = expenses.map((expense) => {
      const amount =
        typeof expense.amount === 'string'
          ? parseFloat(expense.amount) || 0
          : typeof expense.amount === 'number'
          ? expense.amount
          : 0;
      return { ...expense, amount };
    });
    setSanitizedExpenses(cleanedExpenses);
    setLoading(false);
    console.log('Sanitized expenses:', cleanedExpenses); // Debug: Log sanitized expenses
  }, [expenses]);

  // Fetch budget
  useEffect(() => {
    let unsubscribeBudget;
    try {
      unsubscribeBudget = fetchBudget(auth, selectedDate, setBudget);
    } catch (error) {
      console.error('Error fetching budget:', error);
      setBudget(null);
    }

    return () => {
      unsubscribeBudget?.();
    };
  }, [selectedDate, auth]);

  // Sync date changes with ExpenseProvider
  const handleDateChange = (year, month) => {
    updateSelectedDate(month, year);
  };

  const saveEditedExpense = async (updatedExpense) => {
    const db = getFirestore();
    const expenseRef = doc(db, 'expenses', updatedExpense.id);
    try {
      const amount = parseFloat(updatedExpense.amount);
      if (isNaN(amount)) throw new Error('Invalid expense amount');
      await updateDoc(expenseRef, {
        note: updatedExpense.note || '',
        amount,
        category: updatedExpense.category || '',
        timestamp: updatedExpense.timestamp || new Date(),
      });
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === updatedExpense.id ? { ...exp, ...updatedExpense, amount } : exp
        )
      );
      setEditingExpense(null);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense. Please try again.');
    }
  };

  const cancelEdit = () => {
    setEditingExpense(null);
    setSelectedExpense(null);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF] pb-20">
      <div className="container mx-auto px-4 max-w-md relative">
        {selectedExpense && (
          <div
            className="fixed inset-0 bg-[#0D0D0D] z-10"
            onClick={cancelEdit}
          />
        )}

        <header className="py-4 flex items-center justify-between mt-6">
          <h1 className="text-2xl font-bold">OUTFLOW</h1>
          <div className="flex items-center gap-4">
            <MonthYearCalendar
              selectedYear={selectedDate.year}
              selectedMonth={selectedDate.month}
              onDateChange={handleDateChange}
            />
          </div>
        </header>

        <PieChart navigate={navigate} expenses={sanitizedExpenses} />
        <BudgetInfo budget={budget} expenses={sanitizedExpenses} />

        {loading ? (
          <div>Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div>No expenses found for this month.</div>
        ) : (
          <ExpenseList
            loading={loading}
            selectedExpense={selectedExpense}
            setSelectedExpense={setSelectedExpense}
            setEditingExpense={setEditingExpense}
          />
        )}

        {editingExpense && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 z-20">
            <h2 className="text-lg font-semibold mb-2">{editingExpense.category || 'Uncategorized'}</h2>
            <Keyboard
              initialAmount={editingExpense.amount?.toString() || ''}
              initialNote={editingExpense.note || editingExpense.description || ''}
              category={editingExpense.category || ''}
              onSubmit={({ amount, note }) =>
                saveEditedExpense({
                  ...editingExpense,
                  amount,
                  note,
                })
              }
              onCancel={cancelEdit}
              loading={loading}
            />
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
};

export default HomeMain;