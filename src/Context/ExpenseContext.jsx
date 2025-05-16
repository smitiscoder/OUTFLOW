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

  // Listen for auth state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setExpenses([]); // Clear expenses when user logs out
        toast.info('Please sign in to manage expenses.');
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch expenses for the current user
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
            const timestamp =
              (data.timestamp?.toDate && data.timestamp.toDate()) ||
              (data.timestamp instanceof Date ? data.timestamp : null) ||
              new Date(data.createdAt?.toDate() || Date.now());
            return {
              id: doc.id,
              ...data,
              timestamp,
            };
          });

          // Sort expenses by timestamp (newest first)
          fetchedExpenses.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          setExpenses(fetchedExpenses);
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
  }, [currentUser]);

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

  const value = {
    expenses,
    addExpense,
    editExpense,
    deleteExpense,
    setExpenses,
    currentUser,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};