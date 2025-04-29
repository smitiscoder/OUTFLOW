import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Delete, Calendar } from "lucide-react";
import { format } from "date-fns";

const Keyboard = ({ onSubmit }) => {
  const { state } = useLocation();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();
  const { selectedCategory } = state || {};

  const handleKeyPress = (key) => {
    if (key === "Delete") {
      setAmount(prev => prev.slice(0, -1));
    } else if (!(key === "." && amount.includes("."))) {
      setAmount(prev => prev + key);
    }
  };

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    
    // Create a date-only string without timezone offset issues
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const dateObj = new Date(dateStr);
    
    onSubmit({ 
      amount, 
      note,
      date: dateObj.toISOString() // Send ISO string of the date-only object
    });
    
    setAmount("");
    setNote("");
    navigate("/home"); // Changed to match your AddRecord navigation
  };

  const handleDateChange = (e) => {
    // Create a new date from the input value (already in local time)
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  const handleMonthChange = (months) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + months);
    setSelectedDate(newDate);
  };

  const handleYearChange = (years) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newDate.getFullYear() + years);
    setSelectedDate(newDate);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-3 pt-4 rounded-t-2xl shadow-lg max-w-md mx-auto pb-24">
      {/* Amount Display */}
      <div className="text-right text-xl mb-2 px-2 min-h-6">
        {amount || "0"}
      </div>

      {/* Selected Category Display */}
      {selectedCategory && (
        <div className="text-sm mb-2 px-2 text-gray-300">
          {selectedCategory.label}
        </div>
      )}

      {/* Date Display */}
      <div className="text-sm mb-2 px-2 text-gray-300 flex justify-between items-center">
        <span>Date: {format(selectedDate, "MMM dd, yyyy")}</span>
        <button 
          onClick={() => setShowCalendar(!showCalendar)}
          className="text-blue-400 text-xs"
        >
          {showCalendar ? "Hide" : "Change"}
        </button>
      </div>

      {/* Calendar Popup */}
      {showCalendar && (
        <div className="bg-gray-800 p-3 rounded-lg mb-3">
          <div className="flex justify-between items-center mb-2">
            <button 
              onClick={() => handleMonthChange(-1)}
              className="p-1 text-sm"
            >
              &lt;
            </button>
            <div className="text-center">
              {format(selectedDate, "MMMM yyyy")}
            </div>
            <button 
              onClick={() => handleMonthChange(1)}
              className="p-1 text-sm"
            >
              &gt;
            </button>
          </div>
          <div className="flex justify-between items-center mb-2">
            <button 
              onClick={() => handleYearChange(-1)}
              className="p-1 text-sm"
            >
              &lt;&lt;
            </button>
            <div className="text-center">
              {format(selectedDate, "yyyy")}
            </div>
            <button 
              onClick={() => handleYearChange(1)}
              className="p-1 text-sm"
            >
              &gt;&gt;
            </button>
          </div>
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={handleDateChange}
            className="w-full bg-gray-700 p-2 rounded"
          />
        </div>
      )}

      {/* Note Input and Submit Button */}
      <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg mb-3">
        <input
          type="text"
          value={note}
          placeholder="Note..."
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 bg-transparent text-white text-sm border-none outline-none"
        />
        <button
          onClick={handleSubmit}
          className={`p-1.5 rounded-md ${amount ? 'bg-green-500' : 'bg-gray-600'}`}
          disabled={!amount}
        >
          <Check className="w-4 h-4" />
        </button>
      </div>

      {/* Number Keyboard */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className="py-2 rounded-md text-lg bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors"
          >
            {key}
          </button>
        ))}
        
        {/* Bottom row with custom layout */}
        <div className="col-span-3 grid grid-cols-3 gap-2">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="py-2 rounded-md bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors flex justify-center items-center"
          >
            <Calendar className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={() => handleKeyPress("0")}
            className="py-2 rounded-md text-lg bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors"
          >
            0
          </button>
          
          <button
            onClick={() => handleKeyPress("Delete")}
            className="py-2 rounded-md bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors flex justify-center items-center"
          >
            <Delete className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="h-16"></div>
    </div>
  );
};

export default Keyboard;





