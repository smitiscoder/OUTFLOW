import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const MonthYearModal = ({ selectedDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Default to current date if none selected
  const currentDate = selectedDate || new Date();
  
  // Generate months
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(0, i), 'MMMM')
  }));
  
  // Generate years (10 years range)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleMonthChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    onDateChange(newDate);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(e.target.value));
    onDateChange(newDate);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="p-2 bg-gray-800 rounded hover:bg-gray-700">
          <CalendarIcon className="w-6 h-6" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="z-50 bg-white rounded-lg p-3 text-black shadow-xl w-auto" align="end">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="month-select" className="mr-2">Month:</label>
            <select
              id="month-select"
              className="p-2 border rounded"
              value={currentDate.getMonth()}
              onChange={handleMonthChange}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="year-select" className="mr-2">Year:</label>
            <select
              id="year-select"
              className="p-2 border rounded"
              value={currentDate.getFullYear()}
              onChange={handleYearChange}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MonthYearModal;