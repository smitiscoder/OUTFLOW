import React, { useState } from "react";
import "./Keyboard.css"; // Ensure this file exists and styles the layout
import DoneIcon from "../pages/Categoriesicons/Done.svg";
import BackspaceIcon from "../pages/Categoriesicons/Backspace.svg";
import { useNavigate } from "react-router-dom"; // Updated to use useNavigate

const Keyboard = ({ onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(true); // Track keyboard visibility
  const navigate = useNavigate(); // Updated to use useNavigate

  // Handle input key press
  const handleKeyPress = (key) => {
    // Backspace functionality
    if (key === "backspace") {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      // Prevent multiple decimal points in the amount
      if (key === "." && amount.includes(".")) return;
      // Add the pressed key to the amount
      setAmount((prev) => prev + key);
    }
  };

  // Submit the amount and note
  const handleSubmit = () => {
    // Ensure a valid amount is entered
    if (amount && parseFloat(amount) > 0) {
      onSubmit({ amount, note });
      setAmount("");
      setNote("");
      setIsKeyboardVisible(false); // Hide keyboard after submit

      // Navigate to the home page after submitting the form
      // Using React Router navigate() instead of history.push()
      navigate("/home"); // Replace '/home' with the actual route for your home page
    } else {
      // Optionally show an error message if the amount is invalid
      alert("Please enter a valid amount.");
    }
  };

  return (
    isKeyboardVisible && (
      <div className="keyboard-container">
        {/* Displayed Amount */}
        <div className="amount-display">{amount || "0"}</div>

        {/* Note input and Done button */}
        <div className="note-input-container">
          <span>Note :</span>
          <input
            type="text"
            value={note}
            placeholder="Enter a note..."
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="done-btn"
            disabled={!amount || parseFloat(amount) <= 0} // Disable button if invalid
          >
            <img src={DoneIcon} alt="Done" className="icon" />
          </button>
        </div>

        {/* Keyboard Grid */}
        <div className="keyboard-grid">
          {["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "backspace"].map(
            (key, index) => (
              <button
                key={index}
                className="key-btn"
                onClick={() => handleKeyPress(key)}
              >
                {key === "backspace" ? (
                  <img src={BackspaceIcon} alt="Backspace" className="icon" />
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
