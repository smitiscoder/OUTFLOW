// HandleDeleteAndEdit.js
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { useState } from 'react';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { Trash2 } from 'lucide-react';

export const handleExpenseSelect = (expenseId, selectedExpense, setSelectedExpense) => {
  setSelectedExpense(selectedExpense === expenseId ? null : expenseId);
};

export const DeleteExpenseButton = ({ expenseId, setSelectedExpense }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    const db = getFirestore();
    const expenseRef = doc(db, 'expenses', expenseId);
    try {
      await deleteDoc(expenseRef);
      console.log('Expense deleted:', expenseId);
      setSelectedExpense(null); // Clear selection after deletion
    } catch (error) {
      console.error('Error deleting expense:', error);
      setSelectedExpense(null); // Clear selection even on error
    }
  };

  return (
    <>
      <button
        className="p-2 text-red-500 hover:bg-red-500 hover:bg-opacity-20 rounded-full transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setIsDeleteDialogOpen(true);
        }}
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
      />
    </>
  );
};