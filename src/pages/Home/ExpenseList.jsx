import React from 'react';
import { useExpenses } from '../../Context/ExpenseContext';
import { format } from 'date-fns';
import { getIconForCategory } from './constants';
import { handleExpenseSelect, DeleteExpenseButton } from './HandleDeleteAndEdit';
import { SquarePen } from 'lucide-react';

const ExpenseList = ({ loading, selectedExpense, setSelectedExpense, setEditingExpense }) => {
  const { expenses } = useExpenses();

  const formatNumber = (num) => {
    return num % 1 === 0 ? num : num.toFixed(2);
  };

  const handleEdit = (expense, e) => {
    e.stopPropagation();
    console.log('Editing expense:', expense); // Debug: Confirm expense is passed
    setEditingExpense(expense);
    setSelectedExpense(null); // Clear selection to focus on editing
  };

  const groupedByDate = expenses.reduce((acc, expense) => {
    let date;
    const rawTimestamp = expense.timestamp;

    if (rawTimestamp instanceof Date) {
      date = rawTimestamp;
    } else if (rawTimestamp?.toDate) {
      date = rawTimestamp.toDate();
    } else if (typeof rawTimestamp === 'string') {
      date = new Date(rawTimestamp);
    } else {
      return acc;
    }

    const dateStr = format(date, 'dd MMM EEEE');
    if (!acc[dateStr]) acc[dateStr] = { total: 0, items: [] };
    acc[dateStr].items.push(expense);
    acc[dateStr].total += expense.amount;
    return acc;
  }, {});

  return (
    <div className="mt-4">
      {loading ? (
        <p className="text-center text-[#DFDFDF] text-opacity-40">Loading expenses...</p>
      ) : (
        Object.entries(groupedByDate).map(([dateStr, { total, items }]) => (
          <div key={dateStr} className="mb-4 sm:mb-6">
            <div className="flex justify-between items-center text-[#DFDFDF] text-opacity-60 text-xs sm:text-sm mb-2.5 px-2">
              <span className="font-medium">{dateStr}</span>
              <span className="font-medium">₹{formatNumber(total)}</span>
            </div>
            {items.map((expense) => (
              <div
                key={expense.id}
                className={`flex items-center justify-between bg-[#1A1A1A] px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-lg shadow-sm mb-2.5 relative transition-all duration-200 ${
                  selectedExpense === expense.id ? 'z-20 transform scale-[1.02] bg-[#222222]' : 'hover:bg-[#222222]'
                }`}
                onClick={() => handleExpenseSelect(expense.id, selectedExpense, setSelectedExpense)}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#252525] flex-shrink-0 flex items-center justify-center shadow-sm">
                    {getIconForCategory(expense.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base text-[#DFDFDF] font-medium capitalize truncate leading-tight">
                      {expense.note || expense.category}
                    </p>
                    {expense.note && (
                      <p className="text-xs text-[#DFDFDF] text-opacity-60 capitalize truncate mt-0.5 leading-tight">
                        {expense.category}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <p className="text-sm sm:text-base text-[#DFDFDF] font-semibold whitespace-nowrap tabular-nums">
                    {formatNumber(expense.amount)}
                  </p>
                  {selectedExpense === expense.id && (
                    <div className="flex gap-1.5">
                      <button
                        className="p-1.5 sm:p-2 text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors"
                        onClick={(e) => handleEdit(expense, e)}
                      >
                        <SquarePen className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <DeleteExpenseButton 
                        expenseId={expense.id} 
                        setSelectedExpense={setSelectedExpense} 
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseList;