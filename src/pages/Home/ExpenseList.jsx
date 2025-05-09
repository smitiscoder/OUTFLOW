import React from 'react';
import { useExpenses } from '../../Context/ExpenseContext';
import { format } from 'date-fns';
import { getIconForCategory } from './constants';
import { handleDelete, handleExpenseSelect } from './HandleDeleteAndEdit';
import { Trash2, SquarePen } from 'lucide-react';

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
          <div key={dateStr} className="mb-6">
            <div className="flex justify-between items-center text-[#DFDFDF] text-opacity-60 text-sm mb-2">
              <span>{dateStr}</span>
              <span>Expenses: ₹{formatNumber(total)}</span>
            </div>
            {items.map((expense) => (
              <div
                key={expense.id}
                className={`flex items-center justify-between bg-[#1A1A1A] px-4 py-3 rounded-lg shadow mb-2 relative transition-all duration-200 ${
                  selectedExpense === expense.id ? 'z-20 transform scale-105' : ''
                }`}
                onClick={() => handleExpenseSelect(expense.id, selectedExpense, setSelectedExpense)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                    {getIconForCategory(expense.category)}
                  </div>
                  <div>
                    <p className="text-[#DFDFDF] font-medium capitalize">{expense.note || expense.category}</p>
                    {expense.note && (
                      <p className="text-[#DFDFDF] text-sm text-opacity-50 capitalize">{expense.category}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <p className="text-[#DFDFDF] font-semibold whitespace-nowrap mr-3">
                    ₹{formatNumber(expense.amount)}
                  </p>
                  {selectedExpense === expense.id && (
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-blue-500 hover:bg-blue-500 hover:bg-opacity-20 rounded-full transition-colors"
                        onClick={(e) => handleEdit(expense, e)}
                      >
                        <SquarePen className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-red-500 hover:bg-red-500 hover:bg-opacity-20 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(expense.id, setSelectedExpense);
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
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