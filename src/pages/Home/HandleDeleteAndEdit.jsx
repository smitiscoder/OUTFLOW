import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

const handleDelete = async (expenseId, setSelectedExpense, setExpenses) => {
  const db = getFirestore();
  try {
    await deleteDoc(doc(db, 'expenses', expenseId));
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
    setSelectedExpense(null);
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

const handleExpenseSelect = (expenseId, selectedExpense, setSelectedExpense) => {
  setSelectedExpense(selectedExpense === expenseId ? null : expenseId);
};

export { handleDelete, handleExpenseSelect };