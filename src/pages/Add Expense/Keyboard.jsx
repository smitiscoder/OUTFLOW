import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Delete } from "lucide-react";

const Keyboard = ({
  category = "",
  onSubmit = () => {},
  onCancel,
  loading = false,
}) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [expression, setExpression] = useState("");
  const [note, setNote] = useState("");

  const displayCategory = category || state?.selectedCategory?.label || "Category";

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
      return;
    } else if (isOperator(key)) {
      if (expression === "" || isOperator(expression.slice(-1))) {
        return;
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

    let finalAmount;
    try {
      finalAmount = eval(expression);
    } catch {
      alert("Invalid expression");
      return;
    }

    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    onSubmit({ amount: finalAmount.toFixed(2), note });
    setExpression("");
    setNote("");
    navigate("/"); // Redirect to Home page
  };

  const handleCancel = () => {
    onCancel ? onCancel() : navigate(-1);
  };

  return (
    <div className="bg-[#0D0D0D] text-white px-3 pt-3 pb-6 rounded-t-2xl shadow-lg">
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
          disabled={loading}
          className="col-span-4 mt-2 py-3 bg-outflow-accent text-white font-medium rounded-md hover:bg-outflow-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
