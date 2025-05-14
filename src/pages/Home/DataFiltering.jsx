import { getFirestore, doc, onSnapshot, query, collection, where } from 'firebase/firestore';

const fetchBudget = (auth, currentDate, setBudget) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    setBudget(null);
    return () => {};
  }

  const db = getFirestore();
  // Use the same document ID format as SetBudget: ${userId}_${year}_${month}
  const budgetDocId = `${userId}_${currentDate.year}_${currentDate.month + 1}`; // Month is 1-based in SetBudget
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
        setBudget(null); // No budget for this month
      }
    },
    (error) => {
      console.error('Error fetching budget:', error);
      setBudget(null);
    }
  );

  return unsubscribe;
};

const fetchExpenses = (auth, currentDate, setExpenses, setLoading) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const db = getFirestore();
  const q = query(collection(db, 'expenses'), where('userId', '==', userId));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    setLoading(false);
    const allExpenses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredExpenses = allExpenses.filter((exp) => {
      const rawTimestamp = exp.timestamp;

      let date;
      if (rawTimestamp instanceof Date) {
        date = rawTimestamp;
      } else if (rawTimestamp?.toDate) {
        date = rawTimestamp.toDate();
      } else if (typeof rawTimestamp === 'string') {
        date = new Date(rawTimestamp);
      } else {
        return false;
      }

      return (
        date.getFullYear() === parseInt(currentDate.year) &&
        date.getMonth() === currentDate.month
      );
    });

    const sortedExpenses = filteredExpenses.sort((a, b) => {
      const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
      const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(a.timestamp);
      return dateB - dateA;
    });

    setExpenses(sortedExpenses);
  }, (error) => {
    setLoading(false);
    console.error('Error fetching expenses: ', error);
  });

  return unsubscribe;
};

export { fetchBudget, fetchExpenses };