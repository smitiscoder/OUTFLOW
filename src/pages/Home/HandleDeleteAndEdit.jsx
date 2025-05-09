// HandleDeleteAndEdit.js
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

export const handleExpenseSelect = (expenseId, selectedExpense, setSelectedExpense) => {
  setSelectedExpense(selectedExpense === expenseId ? null : expenseId);
};

export const handleDelete = async (expenseId, setSelectedExpense) => {
  const db = getFirestore();
  const expenseRef = doc(db, 'expenses', expenseId);
  const confirmDelete = window.confirm('Are you sure you want to delete this expense?');
  if (confirmDelete) {
    try {
      await deleteDoc(expenseRef);
      console.log('Expense deleted:', expenseId);
      setSelectedExpense(null); // Clear selection after deletion
    } catch (error) {
      console.error('Error deleting expense:', error);
      setSelectedExpense(null); // Clear selection even on error
    }
  } else {
    setSelectedExpense(null); // Clear selection if user cancels
  }
};