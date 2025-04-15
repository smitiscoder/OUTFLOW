import React, { useState } from 'react';

const months = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

const years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i);

const MonthYearModal = ({ currentYear, currentMonth, onSelect, onClose }) => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [view, setView] = useState('months'); // 'months' or 'years'

  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
    setView('years');
  };

  const handleSelectYear = (year) => {
    setSelectedYear(year);
    onSelect(year, selectedMonth);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4">
          {view === 'months' ? 'Select Month' : 'Select Year'}
        </h2>

        {view === 'months' ? (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {months.map(month => (
                <button
                  key={month}
                  onClick={() => handleSelectMonth(month)}
                  className={`py-3 rounded-full ${
                    selectedMonth === month 
                      ? 'bg-[#ECD8A0] font-bold' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-gray-500">
              Selected: {selectedMonth} {selectedYear}
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => handleSelectYear(year)}
                  className={`py-3 rounded-full ${
                    selectedYear === year 
                      ? 'bg-[#ECD8A0] font-bold' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setView('months')}
              className="w-full py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back to months
            </button>
          </>
        )}

        <div className="flex justify-end mt-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthYearModal;