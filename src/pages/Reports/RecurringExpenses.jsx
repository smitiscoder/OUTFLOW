import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import Header from '../../components/Header'; // Adjust path as needed

export default function RecurringExpensesScreen() {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const auth = getAuth();
  const db = getFirestore();
  const now = new Date();

  // Fetch recurring expenses
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    // Set timeframe to last 3 months
    const startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      where('isRecurring', '==', true) // Filter for recurring expenses
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenses = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((exp) => {
          const expDate = new Date(exp.timestamp?.toDate?.() || exp.timestamp);
          return expDate >= startDate && expDate <= endDate;
        });

      // Aggregate expenses by description to calculate frequency
      const expenseMap = expenses.reduce((acc, exp) => {
        const key = exp.description || exp.category || 'Unknown';
        if (!acc[key]) {
          acc[key] = {
            description: exp.description || exp.category || 'Unknown',
            category: exp.category || 'Uncategorized',
            amount: 0,
            count: 0,
            lastDate: exp.timestamp,
          };
        }
        acc[key].amount += exp.amount;
        acc[key].count += 1;
        // Update lastDate if this expense is more recent
        if (new Date(exp.timestamp?.toDate?.() || exp.timestamp) > new Date(acc[key].lastDate?.toDate?.() || acc[key].lastDate)) {
          acc[key].lastDate = exp.timestamp;
        }
        return acc;
      }, {});

      // Convert to array and sort by frequency (count), then by total amount
      const sortedExpenses = Object.values(expenseMap)
        .map((item) => ({
          ...item,
          amount: Math.round(item.amount),
          lastDate: new Date(item.lastDate?.toDate?.() || item.lastDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
        }))
        .sort((a, b) => b.count - a.count || b.amount - a.amount); // Sort by count, then amount

      setRecurringExpenses(sortedExpenses);
    }, (error) => {
      console.error('Error fetching recurring expenses:', error);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      <Header title="Recurring Expenses" />
      <div className="container mx-auto px-4 pb-20 max-w-md">
        <h2 className="text-lg font-semibold mt-6 mb-4">Recurring Expenses (Last 3 Months)</h2>
        {recurringExpenses.length > 0 ? (
          <div className="bg-[#1A1A1A] rounded-xl p-6">
            <ul className="space-y-4">
              {recurringExpenses.map((expense, index) => (
                <li key={index} className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium capitalize">{expense.description.toLowerCase()}</span>
                      <span className="block text-sm text-[#DFDFDF] text-opacity-60 capitalize">
                        {expense.category.toLowerCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">₹{expense.amount}</span>
                      <span className="block text-sm text-[#DFDFDF] text-opacity-60">
                        {expense.count} time{expense.count > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#DFDFDF] text-opacity-60 mt-1">
                    Last: {expense.lastDate}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-[#DFDFDF] text-opacity-60 mt-6">
            No recurring expenses found for the last 3 months.
          </p>
        )}
      </div>
    </div>
  );
}