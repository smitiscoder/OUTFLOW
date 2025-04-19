import React, { useState } from 'react';
import { useExpenses } from '../ExpenseContext'; // ✅ pull expenses from context
import BottomNavbar from '../components/BottomNavbar'; // ✅ if you want bottom nav here too
import './Search.css'; // ✅ optional: create a Search.css if you want clean styling

const Search = () => {
  const { expenses } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering logic
  const filteredExpenses = expenses.filter((expense) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return false;

    const amountMatch = expense.amount.toString() === query;
    const noteMatch = expense.note?.toLowerCase().includes(query);
    const categoryMatch = expense.category?.toLowerCase().includes(query);

    return amountMatch || noteMatch || categoryMatch;
  });

  return (
    <div className="search-container">
      {/* Top Section */}
      <div className="top-nav">
        <h2>Search Expenses</h2>
        <input
          type="text"
          placeholder="Search by amount, note, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Results */}
      <div className="search-results">
        {searchTerm && filteredExpenses.length === 0 && (
          <p className="no-results">No matching expenses found.</p>
        )}

        {filteredExpenses.map((expense) => (
          <div className="expense-card" key={expense.id}>
            <div className="expense-header">
              <strong>{expense.category}</strong>
              <span>₹{expense.amount}</span>
            </div>
            {expense.note && <div className="expense-note">{expense.note}</div>}
            <div className="expense-date">
              {new Date(
                expense.timestamp?.toDate ? expense.timestamp.toDate() : expense.timestamp
              ).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
};

export default Search;
