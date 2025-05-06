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
<div className="fixed bottom-0 left-0 right-0 w-full bg-[#0D0D0D] text-[#DFDFDF] px-4 pt-4 pb-24 rounded-t-2xl shadow-lg max-w-screen-lg mx-auto">
  {/* Amount Display */}
  <div className="text-right text-xl mb-2 px-1 min-h-6 break-words">
    {amount || "0"}
  </div>

  {/* Selected Category Display */}
  {selectedCategory && (
    <div className="text-sm mb-2 px-1 text-gray-300">
      {selectedCategory.label}
    </div>
  )}

  {/* Date Display - Only shown after selection */}
  {dateSelected && (
    <div className="text-sm mb-2 px-1 text-gray-300 flex justify-between items-center">
      <span>Date: {format(selectedDate, "MMM dd, yyyy")}</span>
      <button onClick={toggleCalendar} className="text-blue-400 text-xs">
        Change
      </button>
    </div>
  )}

  {/* Minimal Calendar Popup */}
  {showCalendar && (
    <div className="bg-[#1A1A1A] p-3 rounded-lg mb-3">
      <input
        type="date"
        value={format(selectedDate, "yyyy-MM-dd")}
        onChange={handleDateChange}
        className="w-full bg-[#333333] p-2 rounded text-white"
      />
    </div>
  )}

  {/* Note Input and Submit Button */}
  <div className="flex items-center gap-2 bg-[#1A1A1A] p-2 rounded-lg mb-3">
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
        amount ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-[#333333]"
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
        className="py-3 rounded-md text-lg bg-[#1A1A1A] hover:bg-[#333333] active:bg-[#444444] transition-colors"
      >
        {key}
      </button>
    ))}

    {/* Bottom row with calendar, 0, delete */}
    <div className="col-span-3 grid grid-cols-3 gap-2">
      <button
        onClick={toggleCalendar}
        className="py-3 rounded-md bg-[#1A1A1A] hover:bg-[#333333] active:bg-[#444444] transition-colors flex justify-center items-center"
      >
        <Calendar className="w-5 h-5 text-white" />
      </button>

      <button
        onClick={() => handleKeyPress("0")}
        className="py-3 rounded-md text-lg bg-[#1A1A1A] hover:bg-[#333333] active:bg-[#444444] transition-colors"
      >
        0
      </button>

      <button
        onClick={() => handleKeyPress("Delete")}
        className="py-3 rounded-md bg-[#1A1A1A] hover:bg-[#333333] active:bg-[#444444] transition-colors flex justify-center items-center"
      >
        <Delete className="w-5 h-5 text-white" />
      </button>
    </div>
  </div>

  <div className="h-2"></div>
</div>



  );
};

export default Keyboard;








