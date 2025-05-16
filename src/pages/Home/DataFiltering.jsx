import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

const fetchBudget = (auth, currentDate, setBudget) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    setBudget(null);
    return () => {};
  }

  const db = getFirestore();
  const budgetDocId = `${userId}_${currentDate.year}_${currentDate.month + 1}`; // Month is 1-based
  const budgetRef = doc(db, 'budgets', budgetDocId);

  const unsubscribe = onSnapshot(
    budgetRef,
    (doc) => {
      if (doc.exists()) {
        const budgetData = doc.data();
        const amount =
          typeof budgetData.amount === 'string'
            ? parseFloat(budgetData.amount) || null
            : typeof budgetData.amount === 'number'
            ? budgetData.amount
            : null;
        setBudget(amount);
      } else {
        setBudget(null);
      }
    },
    (error) => {
      console.error('Error fetching budget:', error);
      setBudget(null);
    }
  );

  return unsubscribe;
};

export { fetchBudget };
