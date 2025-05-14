import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../components/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import { openDB } from 'idb';
import { toast } from 'react-toastify';

// Enable Firestore offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  console.error('Failed to enable Firestore offline persistence:', err);
});

// Initialize IndexedDB
const dbPromise = openDB('outflow-db', 1, {
  upgrade(db) {
    db.createObjectStore('expenses', { keyPath: 'id' });
    db.createObjectStore('offlineQueue', { autoIncrement: true });
  },
});

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Load initial data from IndexedDB
  useEffect(() => {
    async function loadData() {
      const db = await dbPromise;
      const tx = db.transaction(['expenses', 'offlineQueue'], 'readonly');
      const expenseStore = tx.objectStore('expenses');
      const queueStore = tx.objectStore('offlineQueue');
      const loadedExpenses = await expenseStore.getAll();
      const loadedQueue = await queueStore.getAll();
      setExpenses(loadedExpenses);
      setOfflineQueue(loadedQueue);
    }
    loadData();
  }, []);

  // Offline/online status listener
  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      toast.warn('You are now offline. Changes will sync when you reconnect.');
    };
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('Back online! Syncing changes...');
      handleOnlineSync(); // Trigger sync immediately
    };
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Add new expense
  const addExpense = async (amount, category, note, date) => {
    const expenseDate = date ? new Date(date) : new Date();
    const newExpense = {
      amount: parseFloat(amount),
      category,
      note,
      timestamp: expenseDate,
      createdAt: serverTimestamp(),
      localId: Date.now(),
    };

    try {
      if (navigator.onLine) {
        const docRef = await addDoc(collection(db, 'expenses'), newExpense);
        toast.success('Expense added successfully!');
        return docRef.id;
      } else {
        const localExpense = {
          ...newExpense,
          id: newExpense.localId,
          createdAt: new Date(),
        };
        const db = await dbPromise;
        const tx = db.transaction(['expenses', 'offlineQueue'], 'readwrite');
        tx.objectStore('expenses').add(localExpense);
        tx.objectStore('offlineQueue').add({ action: 'add', data: newExpense });
        await tx.done;

        setExpenses((prev) => {
          const updatedExpenses = [...prev, localExpense].sort(
            (a, b) => b.timestamp - a.timestamp
          );
          return updatedExpenses;
        });
        setOfflineQueue((prev) => [...prev, { action: 'add', data: newExpense }]);
        toast.info('Expense added offline. Will sync when online.');
        return localExpense.id;
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Error adding expense. Please try again.');
      throw error; // Rethrow to let the caller handle it
    }
  };

  // Edit an expense
  const editExpense = async (id, updatedExpense) => {
    try {
      if (navigator.onLine) {
        const expenseRef = doc(db, 'expenses', id);
        await updateDoc(expenseRef, {
          ...updatedExpense,
          updatedAt: serverTimestamp(),
        });
        toast.success('Expense updated successfully!');
      } else {
        const updatedLocalExpense = { ...updatedExpense, updatedAt: new Date() };
        const db = await dbPromise;
        const tx = db.transaction(['expenses', 'offlineQueue'], 'readwrite');
        tx.objectStore('expenses').put({ id, ...updatedLocalExpense });
        tx.objectStore('offlineQueue').add({
          action: 'edit',
          id,
          data: { ...updatedLocalExpense, localId: id },
        });
        await tx.done;

        setExpenses((prev) =>
          prev
            .map((exp) =>
              exp.id === id ? { ...exp, ...updatedLocalExpense } : exp
            )
            .sort((a, b) => b.timestamp - a.timestamp)
        );
        setOfflineQueue((prev) => [
          ...prev,
          { action: 'edit', id, data: { ...updatedLocalExpense, localId: id } },
        ]);
        toast.info('Expense updated offline. Will sync when online.');
      }
    } catch (error) {
      console.error('Error editing expense:', error);
      toast.error('Error editing expense. Please try again.');
      throw error;
    }
  };

  // Delete an expense
  const deleteExpense = async (id) => {
    try {
      if (navigator.onLine) {
        const expenseRef = doc(db, 'expenses', id);
        await deleteDoc(expenseRef);
        toast.success('Expense deleted successfully!');
      } else {
        const db = await dbPromise;
        const tx = db.transaction(['expenses', 'offlineQueue'], 'readwrite');
        tx.objectStore('expenses').delete(id);
        tx.objectStore('offlineQueue').add({ action: 'delete', id });
        await tx.done;

        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
        setOfflineQueue((prev) => [...prev, { action: 'delete', id }]);
        toast.info('Expense deleted offline. Will sync when online.');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Error deleting expense. Please try again.');
      throw error;
    }
  };

  // Firestore snapshot listener
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

        // Update IndexedDB
        dbPromise.then((db) => {
          const tx = db.transaction('expenses', 'readwrite');
          const store = tx.objectStore('expenses');
          store.clear();
          mergedExpenses.forEach((exp) => store.put(exp));
          return tx.done;
        });

        return mergedExpenses;
      });
    }, (error) => {
      console.error('Firestore snapshot error:', error);
      toast.error('Error fetching expenses. Using local data.');
    });

    return () => unsubscribe();
  }, []);

  // Sync offline queue
  const handleOnlineSync = async () => {
    if (offlineQueue.length === 0) return;

    try {
      for (const queuedAction of offlineQueue) {
        if (queuedAction.action === 'add') {
          const { localId, ...expenseData } = queuedAction.data;
          const docRef = await addDoc(collection(db, 'expenses'), {
            ...expenseData,
            timestamp: serverTimestamp(), // Ensure Firestore Timestamp
            createdAt: serverTimestamp(),
          });
          setExpenses((prev) =>
            prev
              .map((exp) =>
                exp.localId === localId ? { ...exp, id: docRef.id, localId: undefined } : exp
              )
              .sort((a, b) => b.timestamp - a.timestamp)
          );
          const db = await dbPromise;
          const tx = db.transaction('expenses', 'readwrite');
          const store = tx.objectStore('expenses');
          const expense = await store.get(localId);
          if (expense) {
            await store.put({ ...expense, id: docRef.id, localId: undefined });
          }
          await tx.done;
        } else if (queuedAction.action === 'edit') {
          const { id, data } = queuedAction;
          const expenseRef = doc(db, 'expenses', id);
          const docSnap = await getDoc(expenseRef);
          if (docSnap.exists()) {
            const serverData = docSnap.data();
            const serverUpdatedAt = serverData.updatedAt?.toDate() || new Date(0);
            const localUpdatedAt = new Date(data.updatedAt);
            if (serverUpdatedAt > localUpdatedAt) {
              toast.warn(`Expense ${id} was updated elsewhere. Keeping server version.`);
              setExpenses((prev) =>
                prev.map((exp) =>
                  exp.id === id ? { ...exp, ...serverData, updatedAt: serverUpdatedAt } : exp
                )
              );
              const db = await dbPromise;
              const tx = db.transaction('expenses', 'readwrite');
              tx.objectStore('expenses').put({
                id,
                ...serverData,
                updatedAt: serverUpdatedAt,
              });
              await tx.done;
            } else {
              await updateDoc(expenseRef, {
                ...data,
                updatedAt: serverTimestamp(),
              });
            }
          } else {
            const docRef = await addDoc(collection(db, 'expenses'), {
              ...data,
              timestamp: serverTimestamp(), // Ensure Firestore Timestamp
              createdAt: serverTimestamp(),
            });
            setExpenses((prev) =>
              prev.map((exp) =>
                exp.id === id ? { ...exp, id: docRef.id, localId: undefined } : exp
              )
            );
            const db = await dbPromise;
            const tx = db.transaction('expenses', 'readwrite');
            tx.objectStore('expenses').put({ id: docRef.id, ...data });
            await tx.done;
          }
        } else if (queuedAction.action === 'delete') {
          const { id } = queuedAction;
          const expenseRef = doc(db, 'expenses', id);
          const docSnap = await getDoc(expenseRef);
          if (docSnap.exists()) {
            await deleteDoc(expenseRef);
          }
        }
      }
      const db = await dbPromise;
      const tx = db.transaction('offlineQueue', 'readwrite');
      tx.objectStore('offlineQueue').clear();
      await tx.done;

      setOfflineQueue([]);
      toast.success('All changes synced successfully!');
    } catch (error) {
      console.error('Error syncing offline queue:', error);
      toast.error('Sync failed. Changes will retry later.');
    }
  };

  const value = {
    expenses,
    addExpense,
    editExpense,
    deleteExpense,
    setExpenses,
    isOffline,
    handleOnlineSync,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};