import { getFirestore, collection, query, where, onSnapshot, doc } from 'firebase/firestore';

const fetchBudget = (auth, setBudget) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const db = getFirestore();
  const unsubscribe = onSnapshot(doc(db, 'budgets', userId), (doc) => {
    if (doc.exists()) {
      setBudget(doc.data().amount);
    } else {
      setBudget(null);
    }
  }, (error) => {
    console.error("Error listening to budget:", error);
    setBudget(null);
  });

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
      const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
      return dateB - dateA;
    });

    setExpenses(sortedExpenses);
  }, (error) => {
    setLoading(false);
    console.error("Error fetching expenses: ", error);
  });

  return unsubscribe;
};

export { fetchBudget, fetchExpenses };