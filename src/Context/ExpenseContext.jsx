import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  query,
  where,
} from 'firebase/firestore';
import { openDB } from 'idb';
import { toast } from 'react-toastify';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Enable Firestore offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  console.error('Failed to enable Firestore offline persistence:', err);
  toast.error('Offline support is unavailable. Please check your connection.');
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
  const [currentUser, setCurrentUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load initial data from IndexedDB
  useEffect(() => {
    if (!currentUser?.uid) return;

    async function loadData() {
      try {
        const db = await dbPromise;
        const tx = db.transaction(['expenses', 'offlineQueue'], 'readonly');
        const expenseStore = tx.objectStore('expenses');
        const queueStore = tx.objectStore('offlineQueue');

        const allExpenses = await expenseStore.getAll();
        const userExpenses = allExpenses.filter((exp) => exp.userId === currentUser.uid);
        const loadedQueue = await queueStore.getAll();

        setExpenses(userExpenses.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
        setOfflineQueue(loadedQueue);
      } catch (error) {
        console.error('Error loading data from IndexedDB:', error);
        toast.error('Failed to load local data.');
      }
    }
    loadData();
  }, [currentUser]);

  // Sync offline queue (defined early to avoid reference errors)
  const handleOnlineSync = useCallback(
    async () => {
      if (offlineQueue.length === 0 || isSyncing || !currentUser?.uid) return;

      setIsSyncing(true);
      let newQueue = [...offlineQueue];

      try {
        for (const queuedAction of offlineQueue) {
          try {
            if (queuedAction.action === 'add') {
              const { localId, ...expenseData } = queuedAction.data;
              const docRef = await addDoc(collection(db, 'expenses'), {
                ...expenseData,
                timestamp: serverTimestamp(),
                createdAt: serverTimestamp(),
                userId: currentUser.uid,
              });
              setExpenses((prev) =>
                prev
                  .map((exp) =>
                    exp.localId === localId
                      ? { ...exp, id: docRef.id, localId: undefined }
                      : exp
                  )
                  .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
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
                      exp.id === id
                        ? { ...exp, ...serverData, updatedAt: serverUpdatedAt }
                        : exp
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
                  timestamp: serverTimestamp(),
                  createdAt: serverTimestamp(),
                  userId: currentUser.uid,
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
            // Remove successfully synced action
            newQueue = newQueue.filter((action) => action !== queuedAction);
          } catch (error) {
            console.error(`Error syncing action: ${queuedAction.action}`, error);
            // Keep failed action in queue
          }
        }

        // Update offline queue
        const db = await dbPromise;
        const tx = db.transaction('offlineQueue', 'readwrite');
        const store = tx.objectStore('offlineQueue');
        await store.clear();
        for (const action of newQueue) {
          await store.add(action);
        }
        await tx.done;

        setOfflineQueue(newQueue);
        if (newQueue.length === 0) {
          toast.success('All changes synced successfully!');
        } else {
          toast.warn('Some changes failed to sync. Will retry later.');
        }
      } catch (error) {
        console.error('Error syncing offline queue:', error);
        toast.error('Sync failed. Changes will retry later.');
      } finally {
        setIsSyncing(false);
      }
    },
    [offlineQueue, currentUser, isSyncing]
  );

  // Offline/online status listener
  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      toast.warn('You are now offline. Changes will sync when you reconnect.');
    };
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('Back online! Syncing changes...');
      handleOnlineSync();
    };
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [handleOnlineSync]);

  // Add new expense with user ID
  const addExpense = async (amount, category, note, date) => {
    if (!currentUser?.uid) {
      toast.error('Please sign in to add an expense.');
      throw new Error('User not authenticated');
    }

    const expenseDate = date ? new Date(date) : new Date();
    const newExpense = {
      amount: parseFloat(amount),
      category,
      note,
      timestamp: expenseDate,
      createdAt: serverTimestamp(),
      localId: Date.now().toString(),
      userId: currentUser.uid,
    };

    try {
      if (navigator.onLine && !isOffline) {
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
            (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
          );
          return updatedExpenses;
        });
        setOfflineQueue((prev) => {
          const newQueue = [...prev, { action: 'add', data: newExpense }];
          return [...new Set(newQueue.map(JSON.stringify))].map(JSON.parse);
        });
        toast.info('Expense added offline. Will sync when online.');
        return localExpense.id;
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Error adding expense. Please try again.');
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
      if (navigator.onLine && !isOffline) {
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
            .map((exp) => (exp.id === id ? { ...exp, ...updatedLocalExpense } : exp))
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        );
        setOfflineQueue((prev) => {
          const newQueue = [
            ...prev,
            { action: 'edit', id, data: { ...updatedLocalExpense, localId: id } },
          ];
          return [...new Set(newQueue.map(JSON.stringify))].map(JSON.parse);
        });
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
    if (!currentUser?.uid) {
      toast.error('Please sign in to delete an expense.');
      throw new Error('User not authenticated');
    }

    try {
      if (navigator.onLine && !isOffline) {
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
        setOfflineQueue((prev) => {
          const newQueue = [...prev, { action: 'delete', id }];
          return [...new Set(newQueue.map(JSON.stringify))].map(JSON.parse);
        });
        toast.info('Expense deleted三大offline. Will sync when online.');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Error deleting expense. Please try again.');
      throw error;
    }
  };

  // Firestore snapshot listener with user filtering
  useEffect(() => {
    if (!currentUser?.uid) return;

    const expensesRef = collection(db, 'expenses');
    const q = query(expensesRef, where('userId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
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

          setExpenses((prev) => {
            const localIds = new Set(prev.map((exp) => exp.localId).filter(Boolean));
            const mergedExpenses = [
              ...prev.filter((exp) => localIds.has(exp.localId)),
              ...fetchedExpenses.filter((exp) => !localIds.has(exp.localId)),
            ].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

            // Update IndexedDB efficiently
            dbPromise.then(async (db) => {
              try {
                const tx = db.transaction('expenses', 'readwrite');
                const store = tx.objectStore('expenses');
                await store.clear();
                for (const exp of mergedExpenses) {
                  await store.put(exp);
                }
                await tx.done;
              } catch (error) {
                console.error('Error updating IndexedDB:', error);
                toast.error('Failed to update local storage.');
              }
            });

            return mergedExpenses;
          });
        } catch (error) {
          console.error('Error processing Firestore snapshot:', error);
          toast.error('Error fetching expenses. Using local data.');
        }
      },
      (error) => {
        console.error('Firestore snapshot error:', error);
        toast.error('Error fetching expenses. Using local data.');
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

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