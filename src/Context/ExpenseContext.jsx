import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../components/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ExpenseContext = createContext();

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth(), // 0-11 (January is 0)
    year: new Date().getFullYear(),
  });
  const [isLoading, setIsLoading] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setExpenses([]);
      } else {
        console.log('Authenticated user:', user.uid); // Debug: Confirm user ID
      }
    }, (error) => {
      console.error('Auth state change error:', error);
    });
    return () => unsubscribe();
  }, []);

  // Fetch expenses for the current user and filter by selected month/year
  useEffect(() => {
    if (!currentUser?.uid) {
      setExpenses([]);
      return;
    }

    setIsLoading(true);
    const expensesRef = collection(db, 'expenses');
    const q = query(expensesRef, where('userId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const fetchedExpenses = snapshot.docs.map((doc) => {
            const data = doc.data();
            let timestamp;
            if (data.timestamp?.toDate) {
              timestamp = data.timestamp.toDate();
            } else if (typeof data.timestamp === 'string') {
              timestamp = new Date(data.timestamp);
            } else {
              timestamp = data.createdAt?.toDate() || new Date();
            }
            return {
              id: doc.id,
              ...data,
              timestamp,
            };
          });

          // Filter expenses by selected month and year
          const filteredExpenses = fetchedExpenses.filter((expense) => {
            const expenseDate = new Date(expense.timestamp);
            const isValidDate = !isNaN(expenseDate.getTime());
            if (!isValidDate) {
              console.warn('Invalid date for expense:', expense);
              return false;
            }
            return (
              expenseDate.getMonth() === selectedDate.month &&
              expenseDate.getFullYear() === selectedDate.year
            );
          });

          // Sort expenses by timestamp (newest first)
          filteredExpenses.sort((a, b) => b.timestamp - a.timestamp);
          setExpenses(filteredExpenses);
          setIsLoading(false);
        } catch (error) {
          console.error('Error processing Firestore snapshot:', error);
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Firestore snapshot error:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid, selectedDate.month, selectedDate.year]);

  // Add new expense
  const addExpense = async (amount, category, note, date) => {
    if (!currentUser?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      const expenseDate = date ? new Date(date) : new Date();
      if (isNaN(expenseDate.getTime())) {
        throw new Error('Invalid date provided');
      }
      const newExpense = {
        amount: parseFloat(amount) || 0,
        category: category || 'Uncategorized',
        note: note || '',
        timestamp: expenseDate,
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
      };

      const docRef = await addDoc(collection(db, 'expenses'), newExpense);
      return docRef.id;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  // Edit an expense
  const editExpense = async (id, updatedExpense) => {
    if (!currentUser?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      const expenseRef = doc(db, 'expenses', id);
      await updateDoc(expenseRef, {
        ...updatedExpense,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error editing expense:', error);
      throw error;
    }
  };

  // Delete an expense
  const deleteExpense = async (id) => {
    if (!currentUser?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      const expenseRef = doc(db, 'expenses', id);
      await deleteDoc(expenseRef);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  };

  // Update selected month/year
  const updateSelectedDate = (month, year) => {
    if (month < 0 || month > 11 || year < 1900 || year > 9999) {
      console.warn('Invalid month or year:', { month, year });
      return;
    }
    setSelectedDate({ month, year });
  };

  const value = {
    expenses,
    addExpense,
    editExpense,
    deleteExpense,
    setExpenses,
    currentUser,
    selectedDate,
    updateSelectedDate,
    isLoading,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};