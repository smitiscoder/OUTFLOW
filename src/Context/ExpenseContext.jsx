// src/Context/ExpenseContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../components/firebase'; // Correct path to firebase
import { collection, onSnapshot } from 'firebase/firestore';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Subscribe to real-time updates from Firestore
    const unsubscribe = onSnapshot(collection(db, "expenses"), (snapshot) => {
      const fetchedExpenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(fetchedExpenses);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  return (
    <ExpenseContext.Provider value={{ expenses, setExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
};
