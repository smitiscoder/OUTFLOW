import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../components/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);

  // Add new expense
  const addExpense = async (amount, category, note, date) => {
    try {
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

        // Handle various timestamp formats
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
          timestamp: timestamp || new Date(data.createdAt?.toDate() || Date.now())
        };
      });

      // Sort newest first
      fetchedExpenses.sort((a, b) => b.timestamp - a.timestamp);
      setExpenses(fetchedExpenses);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const value = {
    expenses,
    addExpense,
    setExpenses
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
