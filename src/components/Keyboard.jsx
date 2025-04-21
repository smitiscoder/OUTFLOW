import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Tag, FileText, DollarSign } from "lucide-react";
import { Button } from "../components/ui/button";
import DatePicker from "react-datepicker";


const categories = ["Food", "Transport", "Shopping", "Bills", "Other"];

const Keyboard = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const handleKeyPress = (key) => {
    if (key === "backspace") {
      setAmount((prev) => prev.slice(0, -1));
    } else if (key === "." && amount.includes(".")) {
      return;
    } else {
      setAmount((prev) => prev + key);
    }
  };

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const entry = {
      amount,
      description,
      category,
      date: date.toISOString(),
    };

    console.log("Saving entry:", entry);
    // Here you'd send to backend or global state
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-4">
      <div className="max-w-md mx-auto space-y-6">
        <h2 className="text-2xl font-semibold text-center">New Expense</h2>

        {/* Amount display */}
        <div className="flex items-center justify-center text-4xl font-bold text-accent-orange">
          <DollarSign className="w-6 h-6 mr-2" />
          {amount || "0"}
        </div>

        {/* Description input */}
        <div className="flex items-center bg-gray-800 rounded-lg p-3">
          <FileText className="mr-3 text-gray-400" />
          <input
            type="text"
            className="bg-transparent w-full outline-none placeholder-gray-400"
            placeholder="Add a note..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Category dropdown */}
        <div className="flex items-center bg-gray-800 rounded-lg p-3">
          <Tag className="mr-3 text-gray-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent w-full outline-none text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-black">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date picker */}
        <div className="flex items-center bg-gray-800 rounded-lg p-3">
          <Calendar className="mr-3 text-gray-400" />
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            className="bg-transparent text-white outline-none w-full"
            dateFormat="MMM d, yyyy"
          />
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 text-center text-2xl font-medium">
          {["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "backspace"].map((key, index) => (
            <button
              key={index}
              className="bg-gray-800 py-4 rounded-lg hover:bg-gray-700 transition"
              onClick={() => handleKeyPress(key)}
            >
              {key === "backspace" ? "⌫" : key}
            </button>
          ))}
        </div>

        {/* Submit button */}
        <Button
          className="w-full bg-accent-orange hover:bg-accent-orange/90 mt-2 text-white"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default Keyboard;
