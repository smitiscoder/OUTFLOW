import React from 'react';
import { db } from '../components/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import Keyboard from '../pages/Keyboard'; // Make sure path is correct

const AddRecord = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCategory = location.state?.category || 'Misc'; // Fallback if category not passed

  const handleSubmitExpense = async ({ amount, note }) => {
    const user = auth.currentUser;

    if (!user) {
      alert('Please log in to add an expense.');
      return;
    }

    try {
      const expense = {
        userId: user.uid,
        category: selectedCategory,
        amount: parseFloat(amount),
        note,
        timestamp: new Date(),
      };

      await addDoc(collection(db, 'expenses'), expense);
      console.log('✅ Expense added:', expense);
      navigate('/home');
    } catch (error) {
      console.error('❌ Error adding expense:', error);
      alert('Failed to save expense.');
    }
  };

  return (
    <div className="add-record-page">
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>
        Add {selectedCategory} Expense
      </h2>
      <Keyboard onSubmit={handleSubmitExpense} />
    </div>
  );
};

export default AddRecord;

