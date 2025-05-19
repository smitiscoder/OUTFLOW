import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';

export default function RecurringExpenses() {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [timeframeUsed, setTimeframeUsed] = useState('6months');
  const [selectedExpense, setSelectedExpense] = useState(null);

  const auth = getAuth();
  const db = getFirestore();
  const now = new Date();
  const navigate = useNavigate();

  const standardDeviation = (values, mean) => {
    if (values.length === 0) return 0;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  const calculateRecurringScore = (expense, totalMonths) => {
    const monthsScore = (expense.months.size / totalMonths) * 0.4;

    const amounts = expense.allAmounts;
    const avgAmount = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
    const stdDevAmount = standardDeviation(amounts, avgAmount);
    const amountConsistency = avgAmount > 0 ? Math.min(1, avgAmount / (stdDevAmount + 1)) : 0;
    const amountScore = amountConsistency * 0.3;

    const dates = expense.allDates
      .map((date) => new Date(date?.toDate?.() || date).getTime())
      .sort((a, b) => a - b);
    const intervals = [];
    for (let i = 1; i < dates.length; i++) {
      intervals.push((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24));
    }
    const avgInterval = intervals.length > 0 ? intervals.reduce((sum, val) => sum + val, 0) / intervals.length : 0;
    const stdDevInterval = standardDeviation(intervals, avgInterval);
    const timingConsistency = avgInterval > 0 ? Math.min(1, 5 / (stdDevInterval + 1)) : 0;
    const timingScore = timingConsistency * 0.1;

    return monthsScore + amountScore + timingScore;
  };

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const startDate6Months = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const q = query(collection(db, 'expenses'), where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const processExpenses = (filteredExpenses, monthsCount) => {
        const expenseMap = filteredExpenses.reduce((acc, exp) => {
          const expDate = new Date(exp.timestamp?.toDate?.() || exp.timestamp);
          const key = `${exp.description || exp.category || 'Unknown'}-${exp.category || 'Uncategorized'}`;
          const monthKey = `${expDate.getFullYear()}-${expDate.getMonth() + 1}`;

          if (!acc[key]) {
            acc[key] = {
              description: exp.description || exp.category || 'Unknown',
              category: exp.category || 'Uncategorized',
              amount: 0,
              count: 0,
              lastDate: exp.timestamp,
              months: new Set(),
              allAmounts: [],
              allDates: [],
              fullRecords: [],
            };
          }

          acc[key].amount += exp.amount;
          acc[key].count += 1;
          acc[key].months.add(monthKey);
          acc[key].allAmounts.push(exp.amount);
          acc[key].allDates.push(exp.timestamp);
          acc[key].fullRecords.push({
            description: exp.description || exp.category || 'Unknown',
            amount: exp.amount,
            note: exp.note || '',
            timestamp: new Date(exp.timestamp?.toDate?.() || exp.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          });

          if (new Date(exp.timestamp?.toDate?.() || exp.timestamp) > new Date(acc[key].lastDate?.toDate?.() || acc[key].lastDate)) {
            acc[key].lastDate = exp.timestamp;
          }

          return acc;
        }, {});

        return Object.values(expenseMap)
          .filter((item) => {
            const score = calculateRecurringScore(item, monthsCount);
            const monthCount = item.months.size;
            return item.count >= 4 && score >= 0.7 && monthCount >= 2 && monthCount <= 6;
          })
          .map((item) => ({
            ...item,
            amount: Math.round(item.amount),
            lastDate: new Date(item.lastDate?.toDate?.() || item.lastDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          }))
          .sort((a, b) => b.count - a.count || b.amount - a.amount);
      };

      const expenses6Months = expenses.filter((exp) => {
        const expDate = new Date(exp.timestamp?.toDate?.() || exp.timestamp);
        return expDate >= startDate6Months && expDate <= endDate;
      });

      const results6Months = processExpenses(expenses6Months, 6);
      if (results6Months.length > 0) {
        setRecurringExpenses(results6Months);
        setTimeframeUsed('6months');
        return;
      }

      const startDate2Months = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const expenses2Months = expenses.filter((exp) => {
        const expDate = new Date(exp.timestamp?.toDate?.() || exp.timestamp);
        return expDate >= startDate2Months && expDate <= endDate;
      });

      const results2Months = processExpenses(expenses2Months, 2);
      setRecurringExpenses(results2Months);
      setTimeframeUsed(results2Months.length > 0 ? '2months' : 'none');
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleExpenseClick = (expense) => {
    setSelectedExpense(selectedExpense === expense ? null : expense);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      <div className="container mx-auto px-4 pt-20 pb-20 max-w-lg">
        {/* Header with Back Button */}
        <div className="absolute top-6 left-6 flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-[#1A1A1A]"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Recurring Expenses</h1>
        </div>

        {recurringExpenses.length > 0 ? (
          <div className="bg-[#1A1A1A] rounded-xl p-6 shadow-lg mt-8">
            <ul className="space-y-4">
              {recurringExpenses.map((expense, index) => (
                <li
                  key={index}
                  className="flex flex-col bg-[#2A2A2A] rounded-lg p-4 hover:bg-[#3A3A3A] transition-colors"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => handleExpenseClick(expense)}
                  >
                    <div>
                      <span className="font-medium capitalize">
                        {expense.description.toLowerCase()}
                      </span>
                      <span className="block text-xs text-[#DFDFDF] text-opacity-60">
                        Category: {expense.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">₹{expense.amount.toLocaleString()}</span>
                      <span className="block text-sm text-[#DFDFDF] text-opacity-60">
                        {expense.count} time{expense.count > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-[#DFDFDF] text-opacity-60 mt-2">
                    Last: {expense.lastDate}
                  </span>

                  {selectedExpense === expense && (
                    <div className="mt-4 pl-4 border-l-2 border-[#DFDFDF] border-opacity-20">
                      <h3 className="text-sm font-medium mb-3">Expense Records</h3>
                      {expense.fullRecords.length > 0 ? (
                        <ul className="space-y-3">
                          {expense.fullRecords.map((record, idx) => (
                            <li key={idx} className="bg-[#333333] rounded-lg p-3">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium capitalize">
                                  {record.note || record.description}
                                </span>
                                <span className="text-sm font-medium">
                                  ₹{record.amount.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-[#DFDFDF] text-opacity-60">
                                  {record.timestamp}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-[#DFDFDF] text-opacity-60">No records found.</p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-[#DFDFDF] text-opacity-60 mt-12">
            No recurring expenses found for the {timeframeUsed === '6months' ? 'last 6 months' : 'last 2 months'}.
          </p>
        )}
      </div>
    </div>
  );
}