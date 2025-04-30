import React, { useState } from 'react';
import { ReactComponent as CalendarIcon } from '../icons/Calendar.svg';

const MonthYearCalendar = ({ selectedYear, selectedMonth, onDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempMonth, setTempMonth] = useState(selectedMonth ?? new Date().getMonth());
  const [tempYear, setTempYear] = useState(selectedYear ?? new Date().getFullYear());

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const years = Array.from({ length: 6 }, (_, i) => 2023 + i);

  const handleConfirm = () => {
    onDateChange(tempYear, tempMonth);
    setShowCalendar(false);
  };

  return (
    <div className="relative">
      {/* Calendar Button */}
      <button
        className="flex items-center gap-2 p-2 rounded-full  transition-colors"
        onClick={() => setShowCalendar(!showCalendar)}
        aria-label="Open calendar"
      >
        <CalendarIcon className="w-8 h-8" />
        <span className="text-sm font-medium">{months[selectedMonth]} {selectedYear}</span>
      </button>

      {/* Calendar Popup */}
      {showCalendar && (
        <>
          <div 
            className="fixed inset-0  bg-opacity-40 z-10" 
            onClick={() => setShowCalendar(false)} 
          />

          <div className="fixed top-16 right-5 bg-black w-64 rounded-xl p-4 shadow-lg z-20">
            <div className="text-center text-lg font-semibold text-white-800 mb-4">
              {months[tempMonth]} {tempYear}
            </div>

            <select
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg text-sm bg-black"
              value={tempYear}
              onChange={(e) => setTempYear(parseInt(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {months.map((month, index) => (
                <button
                  key={month}
                  className={`p-2 rounded-md text-sm transition-all ${
                    index === tempMonth 
                      ? 'bg-blue-500 text-white font-medium' 
                      : ''
                  }`}
                  onClick={() => setTempMonth(index)}
                >
                  {month}
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-3 border-t border-gray-200">
              <button 
                className="text-white-600 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100" 
                onClick={() => setShowCalendar(false)}
              >
                Cancel
              </button>
              <button 
                className="text-blue-500 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50" 
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthYearCalendar;