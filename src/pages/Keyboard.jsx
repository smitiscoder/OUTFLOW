import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Delete } from "lucide-react";

const Keyboard = ({ initialAmount = "", initialNote = "", category = "", onSubmit, onCancel, loading = false }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [expression, setExpression] = useState(initialAmount);
  const [note, setNote] = useState(initialNote);

  // Determine the category to display
  const displayCategory = category || state?.selectedCategory?.label || "Category";

  // Update state if props change (e.g., editing a different expense)
  useEffect(() => {
    setExpression(initialAmount);
    setNote(initialNote);
  }, [initialAmount, initialNote]);

  const isOperator = (char) => ["+", "-"].includes(char);

  const handleKeyPress = (key) => {
    if (key === "Delete") {
      setExpression((prev) => prev.slice(0, -1));
    } else if (key === "=") {
      try {
        const result = eval(expression);
        setExpression(result.toString());
      } catch {
        alert("Invalid expression");
      }
    } else if (key === "." && expression.split(/[\+\-]/).pop().includes(".")) {
      return; // Prevent multiple decimals in a single number
    } else if (isOperator(key)) {
      if (expression === "" || isOperator(expression.slice(-1))) {
        return; // Prevent starting with or stacking operators
      }
      setExpression((prev) => prev + key);
    } else {
      setExpression((prev) => prev + key);
    }
  };

  const handleSubmit = () => {
    if (!expression || isOperator(expression.slice(-1))) {
      alert("Enter a valid amount.");
      return;
    }

    const finalAmount = eval(expression);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    onSubmit({ amount: finalAmount.toFixed(2), note });
    setExpression("");
    setNote("");
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(); // Edit flow (HomeMain)
    } else {
      navigate(-1); // Add flow (ExpenseCategories)
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-[#0D0D0D] text-white px-3 pt-3 pb-20 rounded-t-2xl shadow-lg max-w-screen-sm mx-auto">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-400">{displayCategory}</div>
        <div className="text-2xl">{expression || "0"}</div>
      </div>

      <div className="flex items-center gap-2 bg-[#1A1A1A] p-3 rounded-lg mb-3">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note : Enter a note..."
          className="flex-1 bg-transparent text-white text-sm placeholder-gray-400 outline-none"
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {["7", "8", "9", "-", "4", "5", "6", "+", "1", "2", "3", "="].map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className="py-3 text-lg bg-[#1A1A1A] rounded-md hover:bg-[#2A2A2A] active:bg-[#333333] transition-colors"
          >
            {key}
          </button>
        ))}

        <button
          onClick={() => handleKeyPress(".")}
          className="py-3 text-lg bg-[#1A1A1A] rounded-md hover:bg-[#2A2A2A] active:bg-[#333333]"
        >
          .
        </button>

        <button
          onClick={() => handleKeyPress("0")}
          className="py-3 text-lg bg-[#1A1A1A] rounded-md hover:bg-[#2A2A2A] active:bg-[#333333]"
        >
          0
        </button>

        <button
          onClick={() => handleKeyPress("Delete")}
          className="py-3 bg-[#1A1A1A] rounded-md hover:bg-[#2A2A2A] active:bg-[#333333] flex justify-center items-center"
        >
          <Delete className="w-5 h-6 text-white" />
        </button>

        <button
          onClick={handleSubmit}
          disabled={!expression || loading}
          className={`py-3 rounded-md flex justify-center items-center ${
            expression && !loading ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-[#333333]"
          }`}
        >
          <Check className="w-5 h-6" />
        </button>
      </div>

      <button
        onClick={handleCancel}
        disabled={loading}
        className="mt-2 w-full py-2 bg-[#1A1A1A] text-red-500 border border-red-500 rounded-md transition-colors"
      >
        Cancel
      </button>
    </div>
  );
};

export default Keyboard;







