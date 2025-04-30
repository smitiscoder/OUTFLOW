import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Delete, Calendar } from "lucide-react";
import { format } from "date-fns";

const Keyboard = ({ onSubmit }) => {
  const { state } = useLocation();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    // Start with today's date in local timezone
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const navigate = useNavigate();
  const { selectedCategory } = state || {};

  const handleKeyPress = (key) => {
    if (key === "Delete") {
      setAmount((prev) => prev.slice(0, -1));
    } else if (!(key === "." && amount.includes("."))) {
      setAmount((prev) => prev + key);
    }
  };

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
  
    // Use formatted date string (no time component)
    const localDate = new Date(selectedDate);
    localDate.setHours(0, 0, 0, 0);
    const dateString = format(localDate, "yyyy-MM-dd");
  
    onSubmit({
      amount,
      note,
      date: dateString, // <-- only the date part, as a string
    });
  
    setAmount("");
    setNote("");
    navigate("/home");
  };
  

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    newDate.setHours(0, 0, 0, 0); // Reset time to avoid timezone shifts
    setSelectedDate(newDate);
    setShowCalendar(false);
    setDateSelected(true);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    if (!showCalendar) {
      setDateSelected(true);
    }
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

      {/* Date Display - Only shown after selection */}
      {dateSelected && (
        <div className="text-sm mb-2 px-2 text-gray-300 flex justify-between items-center">
          <span>Date: {format(selectedDate, "MMM dd, yyyy")}</span>
          <button onClick={toggleCalendar} className="text-blue-400 text-xs">
            Change
          </button>
        </div>
      )}

      {/* Minimal Calendar Popup */}
      {showCalendar && (
        <div className="bg-gray-800 p-3 rounded-lg mb-3">
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={handleDateChange}
            className="w-full bg-gray-700 p-2 rounded text-white"
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
          className={`p-1.5 rounded-md ${
            amount ? "bg-green-500" : "bg-gray-600"
          }`}
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

        {/* Bottom row with calendar, 0, delete */}
        <div className="col-span-3 grid grid-cols-3 gap-2">
          <button
            onClick={toggleCalendar}
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

      <div className="h-14"></div>
    </div>
  );
};

export default Keyboard;






