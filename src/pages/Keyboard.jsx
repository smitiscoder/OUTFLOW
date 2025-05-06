import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Delete, Calendar } from "lucide-react";
import { format } from "date-fns";

const Keyboard = ({ onSubmit }) => {
  const { state } = useLocation();
  const [input, setInput] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [isEvaluated, setIsEvaluated] = useState(false);

  const navigate = useNavigate();
  const { selectedCategory } = state || {};

  const handleKeyPress = (key) => {
    if (key === "Delete") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => prev + key);
    }
    setCalculatedAmount("");
    setIsEvaluated(false);
  };

  const evaluateAmount = () => {
    try {
      const result = eval(input);
      if (!isNaN(result)) {
        const final = parseFloat(result).toFixed(2);
        setCalculatedAmount(final);
        setInput(final);
        setIsEvaluated(true);
      }
    } catch (e) {
      alert("Invalid expression");
    }
  };

  const handleSubmit = () => {
    if (!calculatedAmount || parseFloat(calculatedAmount) <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    const finalDate = new Date(selectedDate);
    finalDate.setHours(0, 0, 0, 0);
    const formattedDate = format(finalDate, "yyyy-MM-dd");

    onSubmit({
      amount: calculatedAmount,
      note,
      date: formattedDate,
    });

    setInput("");
    setNote("");
    setCalculatedAmount("");
    setIsEvaluated(false);
    navigate("/home");
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    newDate.setHours(0, 0, 0, 0);
    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const isMathOperationPresent = /[+\-*/]/.test(input) && !isEvaluated;

  const keys = [
    "7", "8", "9", "Delete",
    "4", "5", "6", "+",
    "1", "2", "3", "-",
    ".", "0", "Cal", isMathOperationPresent ? "=" : "Done"
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-[#0D0D0D] text-[#DFDFDF] px-4 pt-4 pb-24 rounded-t-2xl shadow-lg max-w-md mx-auto">
      {/* Display area */}
      <div className="text-right text-2xl mb-3 px-2 min-h-8 break-words font-medium">
        {input || "0"}
      </div>
  
      {/* Category indicator */}
      {selectedCategory && (
        <div className="text-xs mb-3 px-2 text-[#DFDFDF] text-opacity-60 capitalize">
          {selectedCategory.label.toLowerCase()}
        </div>
      )}
  
      {/* Date picker */}
      {showCalendar && (
        <div className="bg-[#1A1A1A] p-3 rounded-lg mb-4">
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={handleDateChange}
            className="w-full bg-[#0D0D0D] p-2 text-[#DFDFDF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      )}
  
      {/* Note input */}
      <div className="flex items-center bg-[#1A1A1A] rounded-lg p-3 mb-4">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-[#DFDFDF] placeholder-[#DFDFDF] placeholder-opacity-60"
        />
      </div>
  
      {/* Calculator keyboard */}
      <div className="grid grid-cols-4 gap-2">
        {keys.map((key, index) => {
          if (key === "Delete") {
            return (
              <button
                key={index}
                onClick={() => handleKeyPress("Delete")}
                className="bg-[#1A1A1A] hover:bg-[#333] py-3 rounded-lg flex items-center justify-center transition-colors"
              >
                <Delete className="text-[#DFDFDF] w-5 h-5" />
              </button>
            );
          } else if (key === "Cal") {
            return (
              <button
                key={index}
                onClick={toggleCalendar}
                className="bg-[#1A1A1A] hover:bg-[#333] py-3 rounded-lg flex items-center justify-center transition-colors"
              >
                <Calendar className="text-[#DFDFDF] w-5 h-5" />
              </button>
            );
          } else if (key === "=") {
            return (
              <button
                key={index}
                onClick={evaluateAmount}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-[#DFDFDF] py-3 rounded-lg text-lg font-medium transition-colors"
              >
                =
              </button>
            );
          } else if (key === "Done") {
            return (
              <button
                key={index}
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-[#DFDFDF] py-3 rounded-lg flex items-center justify-center transition-colors"
              >
                <Check className="w-5 h-5" />
              </button>
            );
          } else {
            return (
              <button
                key={index}
                onClick={() => handleKeyPress(key)}
                className="bg-[#1A1A1A] hover:bg-[#333] py-3 rounded-lg text-lg font-medium transition-colors"
              >
                {key}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Keyboard;








