import React, { useState } from "react";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [expenses, setExpenses] = useState([]); // initially empty

  const filteredExpenses = expenses.filter((expense) =>
    expense.name.toLowerCase().includes(query.toLowerCase()) ||
    expense.category.toLowerCase().includes(query.toLowerCase()) ||
    expense.date.includes(query) ||
    expense.amount.toString().includes(query)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 pt-6 pb-28 max-w-md mx-auto">
      <div className="relative mb-4">
        <input
          type="text"
          className="w-full rounded-full bg-white/10 border border-white/10 px-4 py-3 pl-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Search by name, category, amount, or date"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SearchIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pr-2" /> {/* Added padding-right to icon */}
      </div>

      <div className="space-y-3">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-center p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div>
                <p className="font-medium">{expense.name}</p>
                <p className="text-xs text-gray-400">
                  {expense.category} • {expense.date}
                </p>
              </div>
              <p className="font-semibold text-orange-400">
                ${expense.amount.toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center mt-10">
            No expenses yet. Start tracking your spending!
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;

