import React, { useState } from "react";
import { useExpenses } from '../Context/ExpenseContext';

const Search = () => {
  const { expenses } = useExpenses();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExpenses = expenses.filter((expense) => {
    const query = searchTerm.trim().toLowerCase();
    
    if (!query) return false;

    // Exact amount match - convert both to numbers and compare
    const amountAsNumber = parseFloat(query);
    if (!isNaN(amountAsNumber)) {
      if (expense.amount === amountAsNumber) {
        return true;
      }
    }

    // For non-number searches, check note and category
    const noteMatch = expense.note?.toLowerCase().includes(query);
    const categoryMatch = expense.category?.toLowerCase().includes(query);

    return noteMatch || categoryMatch;
  });

  return (
    <div className="search-container bg-gray-900 text-white min-h-screen px-4 py-6 max-w-md mx-auto">
      <div className="top-nav mb-6">
        <h2 className="text-xl font-semibold">Search Expenses</h2>
        <input
          type="text"
          className="search-input w-full rounded-full bg-white/10 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 mt-4"
          placeholder="Search by amount, note, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="search-results space-y-3">
        {searchTerm && filteredExpenses.length === 0 && (
          <p className="no-results text-gray-400 text-sm text-center mt-10">
            No matching expenses found.
          </p>
        )}

        {filteredExpenses.map((expense) => (
          <div
            key={expense.id}
            className="expense-card p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <div className="expense-header flex justify-between">
              <strong className="font-medium">{expense.category}</strong>
              <span className="font-semibold text-orange-400">₹{Math.round(expense.amount)}</span>
            </div>
            {expense.note && (
              <div className="expense-note text-xs text-gray-400 mt-2">
                {expense.note}
              </div>
            )}
            <div className="expense-date text-xs text-gray-500 mt-2">
              {new Date(
                expense.timestamp?.toDate ? expense.timestamp.toDate() : expense.timestamp
              ).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;



