// Calendar.jsx
import React, { useState } from 'react';
import './Calendar.css'; // (Rename your CSS file too for clarity)
import { ReactComponent as CalendarIcon } from '../icons/Calendar.svg';

const Calendar = ({ selectedYear, selectedMonth, onDateChange }) => {
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
    <div className="calendar-container">
      {/* Calendar Button */}
      <button
        className="calendar-button"
        onClick={() => setShowCalendar(!showCalendar)}
        aria-label="Open calendar"
      >
        <CalendarIcon className="calendar-icon" />
        <span>{months[selectedMonth]} {selectedYear}</span>
      </button>

      {/* Calendar Popup */}
      {showCalendar && (
        <>
          <div className="calendar-backdrop" onClick={() => setShowCalendar(false)} />

          <div className="calendar-popup">
            <div className="calendar-header">
              {months[tempMonth]} {tempYear}
            </div>

            <select
              className="year-selector"
              value={tempYear}
              onChange={(e) => setTempYear(parseInt(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <div className="months-grid">
              {months.map((month, index) => (
                <button
                  key={month}
                  className={`month-button ${index === tempMonth ? 'active' : ''}`}
                  onClick={() => setTempMonth(index)}
                >
                  {month}
                </button>
              ))}
            </div>

            <div className="calendar-footer">
              <button className="cancel-button" onClick={() => setShowCalendar(false)}>
                Cancel
              </button>
              <button className="confirm-button" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Calendar;

