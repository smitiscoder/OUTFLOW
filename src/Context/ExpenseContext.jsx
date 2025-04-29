import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../components/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Add this function to handle adding new expenses
  const addExpense = async (amount, category, note, date) => {
    try {
      // Convert the date string to a Date object if provided
      const expenseDate = date ? new Date(date) : new Date();
      
      await addDoc(collection(db, "expenses"), {
        amount: parseFloat(amount),
        category,
        note,
        timestamp: expenseDate, 
        createdAt: serverTimestamp() 
      });
    } catch (error) {
      console.error("Error adding expense: ", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "expenses"), (snapshot) => {
      const fetchedExpenses = snapshot.docs.map(doc => {
        const data = doc.data();
        let timestamp;
        
        // Handle different timestamp formats
        if (data.timestamp) {
          if (typeof data.timestamp.toDate === 'function') {
            timestamp = data.timestamp.toDate();
          } else if (data.timestamp instanceof Date) {
            timestamp = data.timestamp;
          } else if (typeof data.timestamp === 'string') {
            timestamp = new Date(data.timestamp);
          } else if (typeof data.timestamp === 'number') {
            timestamp = new Date(data.timestamp);
          }
        }
        
        return {
          id: doc.id,
          ...data,
          timestamp: timestamp || new Date(data.createdAt?.toDate() || Date.now()) // Fallback to createdAt or current time
        };
      });
      
      // Sort by timestamp descending (newest first)
      fetchedExpenses.sort((a, b) => b.timestamp - a.timestamp);
      setExpenses(fetchedExpenses);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      const filtered = expenses.filter(expense => {
        const expenseDate = expense.timestamp;
        return (
          expenseDate.getMonth() === selectedMonth.getMonth() &&
          expenseDate.getFullYear() === selectedMonth.getFullYear()
        );
      });
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses(expenses);
    }
  }, [selectedMonth, expenses]);

  const value = {
    expenses,
    filteredExpenses: selectedMonth ? filteredExpenses : expenses,
    addExpense, // Make sure to expose the addExpense function
    setExpenses,
    selectedMonth,
    setSelectedMonth
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};