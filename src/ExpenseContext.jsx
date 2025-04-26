// src/ExpenseContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from './components/firebase'; // Assuming you have firebase configured

// 1. Create the context
const ExpenseContext = createContext();

// 2. Custom hook to access context
export const useExpenses = () => useContext(ExpenseContext);

// 3. Context Provider component
export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses from the database (Assuming Firebase Firestore)
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const snapshot = await db.collection("expenses").get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <ExpenseContext.Provider value={{ expenses, setExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
};
