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
  enableIndexedDbPersistence,
} from 'firebase/firestore';

// Enable Firestore offline persistence (already in place)
enableIndexedDbPersistence(db).catch((err) => {
  console.error('Failed to enable Firestore offline persistence:', err);
});

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [offlineQueue, setOfflineQueue] = useState(() => {
    const savedQueue = localStorage.getItem('offlineQueue');
    return savedQueue ? JSON.parse(savedQueue) : [];
  });

  // Save expenses and queue to localStorage on change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
  }, [expenses, offlineQueue]);

  // Add new expense (already in place, repeated for context)
  const addExpense = async (amount, category, note, date) => {
    try {
      const expenseDate = date ? new Date(date) : new Date();
      const newExpense = {
        amount: parseFloat(amount),
        category,
        note,
        timestamp: expenseDate,
        createdAt: serverTimestamp(),
        localId: Date.now(),
      };

      if (navigator.onLine) {
        const docRef = await addDoc(collection(db, 'expenses'), newExpense);
        return docRef.id;
      } else {
        const localExpense = {
          ...newExpense,
          id: newExpense.localId,
          createdAt: new Date(),
        };
        setExpenses((prev) => {
          const updatedExpenses = [...prev, localExpense].sort(
            (a, b) => b.timestamp - a.timestamp
          );
          return updatedExpenses;
        });
        setOfflineQueue((prev) => [...prev, { action: 'add', data: newExpense }]);
        return localExpense.id;
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      const expenseDate = date ? new Date(date) : new Date();
      const localExpense = {
        amount: parseFloat(amount),
        category,
        note,
        timestamp: expenseDate,
        createdAt: new Date(),
        id: Date.now(),
      };
      setExpenses((prev) => {
        const updatedExpenses = [...prev, localExpense].sort(
          (a, b) => b.timestamp - a.timestamp
        );
        return updatedExpenses;
      });
      setOfflineQueue((prev) => [
        ...prev,
        { action: 'add', data: { ...localExpense, localId: localExpense.id } },
      ]);
      return localExpense.id;
    }
  };

  // Edit an expense
  const editExpense = async (id, updatedExpense) => {
    try {
      if (navigator.onLine) {
        // Online: Update in Firestore
        const expenseRef = doc(db, 'expenses', id);
        await updateDoc(expenseRef, {
          ...updatedExpense,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Offline: Update local expenses and queue the action
        setExpenses((prev) =>
          prev
            .map((exp) =>
              exp.id === id ? { ...exp, ...updatedExpense, updatedAt: new Date() } : exp
            )
            .sort((a, b) => b.timestamp - a.timestamp)
        );
        setOfflineQueue((prev) => [
          ...prev,
          { action: 'edit', id, data: { ...updatedExpense, localId: id } },
        ]);
      }
    } catch (error) {
      console.error('Error editing expense:', error);
      // Fallback: Update locally and queue
      setExpenses((prev) =>
        prev
          .map((exp) =>
            exp.id === id ? { ...exp, ...updatedExpense, updatedAt: new Date() } : exp
          )
          .sort((a, b) => b.timestamp - a.timestamp)
      );
      setOfflineQueue((prev) => [
        ...prev,
        { action: 'edit', id, data: { ...updatedExpense, localId: id } },
      ]);
    }
  };

  // Delete an expense
  const deleteExpense = async (id) => {
    try {
      if (navigator.onLine) {
        // Online: Delete from Firestore
        const expenseRef = doc(db, 'expenses', id);
        await deleteDoc(expenseRef);
      } else {
        // Offline: Remove from local expenses and queue the action
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
        setOfflineQueue((prev) => [...prev, { action: 'delete', id }]);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      // Fallback: Remove locally and queue
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      setOfflineQueue((prev) => [...prev, { action: 'delete', id }]);
    }
  };

  // Firestore snapshot listener (already in place)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      const fetchedExpenses = snapshot.docs.map((doc) => {
        const data = doc.data();
        let timestamp;
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
          timestamp: timestamp || new Date(data.createdAt?.toDate() || Date.now()),
        };
      });

      setExpenses((prev) => {
        const localIds = new Set(prev.map((exp) => exp.localId).filter(Boolean));
        const mergedExpenses = [
          ...prev.filter((exp) => localIds.has(exp.localId)),
          ...fetchedExpenses.filter((exp) => !localIds.has(exp.localId)),
        ].sort((a, b) => b.timestamp - a.timestamp);
        return mergedExpenses;
      });
    }, (error) => {
      console.error('Firestore snapshot error:', error);
    });

    return () => unsubscribe();
  }, []);

  // Sync offline queue when back online (updated to handle edit/delete)
  useEffect(() => {
    const handleOnline = async () => {
      if (offlineQueue.length === 0) return;

      try {
        for (const queuedAction of offlineQueue) {
          if (queuedAction.action === 'add') {
            const { localId, ...expenseData } = queuedAction.data;
            const docRef = await addDoc(collection(db, 'expenses'), {
              ...expenseData,
              createdAt: serverTimestamp(),
            });
            setExpenses((prev) =>
              prev
                .map((exp) =>
                  exp.localId === localId ? { ...exp, id: docRef.id, localId: undefined } : exp
                )
                .sort((a, b) => b.timestamp - a.timestamp)
            );
          } else if (queuedAction.action === 'edit') {
            const { id, data } = queuedAction;
            const expenseRef = doc(db, 'expenses', id);
            await updateDoc(expenseRef, {
              ...data,
              updatedAt: serverTimestamp(),
            });
          } else if (queuedAction.action === 'delete') {
            const { id } = queuedAction;
            const expenseRef = doc(db, 'expenses', id);
            await deleteDoc(expenseRef);
          }
        }
        setOfflineQueue([]);
        localStorage.setItem('offlineQueue', JSON.stringify([]));
      } catch (error) {
        console.error('Error syncing offline queue:', error);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [offlineQueue]);

  const value = {
    expenses,
    addExpense,
    editExpense,
    deleteExpense,
    setExpenses,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};