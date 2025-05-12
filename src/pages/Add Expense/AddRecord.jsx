import React from 'react';
import { db } from '../../components/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import Keyboard from './Keyboard';

const AddRecord = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCategory = location.state?.category || 'Misc';

  const handleSubmitExpense = async ({ amount, note, date }) => {
    const user = auth.currentUser;

    if (!user) {
      alert('Please log in to add an expense.');
      return;
    }

    try {
      // Use Timestamp.fromDate() to store the exact date from the user
      const expense = {
        userId: user.uid,
        category: selectedCategory,
        amount: parseFloat(amount),
        note,
        timestamp: date ? Timestamp.fromDate(new Date(date)) : Timestamp.now(), // Use the user-specified date
        createdAt: Timestamp.now() // optional for tracking insert time
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
