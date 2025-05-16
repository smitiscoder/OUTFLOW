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
import { toast } from 'react-toastify';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth(), // 0-11 (January is 0)
    year: new Date().getFullYear(),
  });

  // Listen for auth state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setExpenses([]);
        toast.info('Please sign in to manage expenses.');
      } else {
        console.log('Authenticated user:', user.uid); // Debug: Confirm user ID
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch expenses for the current user and filter by selected month/year
  useEffect(() => {
    if (!currentUser?.uid) return;

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

          console.log('Fetched expenses:', fetchedExpenses); // Debug: Log raw expenses

          // Filter expenses by selected month and year
          const filteredExpenses = fetchedExpenses.filter((expense) => {
            const expenseDate = new Date(expense.timestamp);
            const isValidDate = !isNaN(expenseDate.getTime());
            if (!isValidDate) {
              console.warn('Invalid date for expense:', expense); // Debug: Log invalid dates
              return false;
            }
            return (
              expenseDate.getMonth() === selectedDate.month &&
              expenseDate.getFullYear() === selectedDate.year
            );
          });

          console.log('Filtered expenses:', filteredExpenses); // Debug: Log filtered expenses

          // Sort expenses by timestamp (newest first)
          filteredExpenses.sort((a, b) => b.timestamp - a.timestamp);
          setExpenses(filteredExpenses);
        } catch (error) {
          console.error('Error processing Firestore snapshot:', error);
          toast.error('Failed to fetch expenses. Please try again.');
        }
      },
      (error) => {
        console.error('Firestore snapshot error:', error);
        toast.error('Error fetching expenses. Please check your connection.');
      }
    );

    return () => unsubscribe();
  }, [currentUser, selectedDate]);

  // Add new expense
  const addExpense = async (amount, category, note, date) => {
    if (!currentUser?.uid) {
      toast.error('Please sign in to add an expense.');
      throw new Error('User not authenticated');
    }

    try {
      const expenseDate = date ? new Date(date) : new Date();
      const newExpense = {
        amount: parseFloat(amount),
        category,
        note,
        timestamp: expenseDate,
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
      };

      const docRef = await addDoc(collection(db, 'expenses'), newExpense);
      toast.success('Expense added successfully!');
      return docRef.id;
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense. Please try again.');
      throw error;
    }
  };

  // Edit an expense
  const editExpense = async (id, updatedExpense) => {
    if (!currentUser?.uid) {
      toast.error('Please sign in to edit an expense.');
      throw new Error('User not authenticated');
    }

    try {
      const expenseRef = doc(db, 'expenses', id);
      await updateDoc(expenseRef, {
        ...updatedExpense,
        updatedAt: serverTimestamp(),
      });
      toast.success('Expense updated successfully!');
    } catch (error) {
      console.error('Error editing expense:', error);
      toast.error('Failed to edit expense. Please try again.');
      throw error;
    }
  };

  // Delete an expense
  const deleteExpense = async (id) => {
    if (!currentUser?.uid) {
      toast.error('Please sign in to delete an expense.');
      throw new Error('User not authenticated');
    }

    try {
      const expenseRef = doc(db, 'expenses', id);
      await deleteDoc(expenseRef);
      toast.success('Expense deleted successfully!');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense. Please try again.');
      throw error;
    }
  };

  // Function to update selected month/year
  const updateSelectedDate = (month, year) => {
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
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};