// src/ExpenseContext.jsx
import React, { createContext, useContext, useState } from "react";

// 1. Create the context
const ExpenseContext = createContext();

// 2. Custom hook to access context
export const useExpenses = () => useContext(ExpenseContext);

// 3. Context Provider component
export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);

  return (
    <ExpenseContext.Provider value={{ expenses, setExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
};
