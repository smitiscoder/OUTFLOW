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
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">Recurring Expenses</h1>
          </div>
        </div>
      </div>

      {/* Main Content with proper spacing for fixed header */}
      <div className="pt-20 sm:pt-24 px-3 sm:px-4 md:px-6 pb-16">
        <div className="max-w-full sm:max-w-[540px] md:max-w-[640px] mx-auto">
          {recurringExpenses.length > 0 ? (
            <div className="space-y-4">
              {/* Header Section */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                  Smart Expense Detection
                </h2>
                <p className="text-xs text-[#DFDFDF]/60 mt-1">
                  Based on {timeframeUsed === '6months' ? 'last 6 months' : 'last 2 months'} of spending patterns
                </p>
              </div>

              {/* Recurring Expenses List */}
              <div className="space-y-3">
                {recurringExpenses.map((expense, index) => (
                  <div
                    key={index}
                    className="bg-[#0D0D0D] rounded-xl p-4 border border-[#333333]/30 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-[#DFDFDF]">
                          {expense.description}
                        </h3>
                        <p className="text-xs text-[#DFDFDF]/60 mt-0.5 capitalize">
                          {expense.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-semibold text-[#DFDFDF]">
                          ₹{expense.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-[#DFDFDF]/60 mt-0.5">
                          {expense.count} times
                        </p>
                      </div>
                    </div>

                    {/* Last Transaction */}
                    <div className="flex items-center justify-between text-xs text-[#DFDFDF]/60 border-t border-[#333333]/30 pt-2 mt-2">
                      <span>Last Transaction</span>
                      <span>{expense.lastDate}</span>
                    </div>

                    {/* Transaction History Button */}
                    <button
                      onClick={() => setSelectedExpense(expense)}
                      className="w-full mt-3 py-2 px-3 bg-purple-600/10 hover:bg-purple-600/20 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 text-purple-400"
                    >
                      View Transaction History
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center mt-8">
              <div className="bg-[#0D0D0D] rounded-xl p-6 border border-[#333333]/30">
                <h3 className="text-lg font-semibold text-[#DFDFDF] mb-2">
                  No Recurring Expenses Found
                </h3>
                <p className="text-sm text-[#DFDFDF]/60 mb-3">
                  We haven't detected any recurring expenses for the {timeframeUsed === '6months' ? 'last 6 months' : 'last 2 months'}.
                </p>
                <p className="text-xs text-[#DFDFDF]/40">
                  Add more expenses to help us identify your spending patterns
                </p>
              </div>
            </div>
          )}

          {/* Transaction History Modal */}
          {selectedExpense && (
            <>
              <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                onClick={() => setSelectedExpense(null)}
              />
              <div className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-6 sm:max-w-md w-[calc(100%-2rem)] sm:w-full bg-[#0D0D0D] rounded-2xl p-4 z-50 border border-[#333333]/30 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-[#DFDFDF]">
                      Transaction History
                    </h3>
                    <p className="text-xs text-[#DFDFDF]/60 mt-0.5">
                      {selectedExpense.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedExpense(null)}
                    className="p-1.5 hover:bg-[#1A1A1A] rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 pb-2">
                  {selectedExpense.fullRecords.map((record, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-[#1A1A1A]/30 rounded-xl border border-[#333333]/30"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-medium text-[#DFDFDF] truncate">
                          {record.description}
                        </p>
                        <p className="text-xs text-[#DFDFDF]/60 mt-0.5">
                          {record.timestamp}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-[#DFDFDF] whitespace-nowrap">
                          ₹{record.amount.toLocaleString()}
                        </p>
                        {record.note && (
                          <p className="text-xs text-[#DFDFDF]/60 mt-0.5 truncate max-w-[120px]">
                            {record.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}