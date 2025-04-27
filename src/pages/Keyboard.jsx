import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check } from "lucide-react"; // You can keep using this for other icons

// Import the local Backspace icon from the icons folder
import { ReactComponent as Backspace } from '../icons/Backspace.svg'; // Adjust the path if necessary

const Keyboard = ({ onSubmit }) => {
  const { state } = useLocation(); // Access the state passed by the navigate function
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(true);
  const navigate = useNavigate();

  const { selectedCategory } = state || {}; // Destructure selected category

  const handleKeyPress = (key) => {
    if (key === "backspace") {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      if (key === "." && amount.includes(".")) return;
      setAmount((prev) => prev + key);
    }
  };

  const handleSubmit = () => {
    if (amount && parseFloat(amount) > 0) {
      onSubmit({ amount, note });
      setAmount("");
      setNote("");
      setIsKeyboardVisible(false);
      navigate("/"); // Navigate to the root route instead of /home
    } else {
      alert("Please enter a valid amount.");
    }
  };

  return (
    isKeyboardVisible && (
      <div className="fixed bottom-0 left-0 right-0 w-full bg-gray-900 text-white p-4 rounded-t-2xl shadow-lg z-50">
        <div className="text-right text-xl mb-4 pr-4">{amount || "0"}</div>

        {/* Display selected category */}
        <div className="flex items-center gap-2 mb-4">
          {selectedCategory && (
            <>
              <span className="text-lg">{selectedCategory.label}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-xl mb-4">
          <span>Note:</span>
          <input
            type="text"
            value={note}
            placeholder="Enter a note..."
            onChange={(e) => setNote(e.target.value)}
            className="flex-1 bg-transparent text-white border-none outline-none"
          />
          <button
            onClick={handleSubmit}
            className="bg-green-500 p-2 rounded-lg"
            disabled={!amount || parseFloat(amount) <= 0}
          >
            <Check className="w-6 h-6" />
          </button>
        </div>

        {/* Keyboard layout */}
        <div className="grid grid-cols-3 gap-2 mb-12">
          {["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "backspace"].map(
            (key, index) => (
              <button
                key={index}
                onClick={() => handleKeyPress(key)}
                className="bg-gray-800 text-white text-lg p-3 rounded-lg"
              >
                {key === "backspace" ? (
                  <Backspace className="w-5 h-5 text-white" /> // Backspace icon with white color
                ) : (
                  key
                )}
              </button>
            )
          )}
        </div>
      </div>
    )
  );
};

export default Keyboard;





