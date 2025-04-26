import React, { useState } from 'react';
import './ExpenseCategories.css';

import Keyboard from './Keyboard';

// Firebase imports
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Import all icons
import Shopping from './Categoriesicons/Shopping.svg';
import Food from './Categoriesicons/Food.svg';
import Grocery from './Categoriesicons/Grocery.svg';
import Bills from './Categoriesicons/Bills.svg';
import Entertainment from './Categoriesicons/Entertainment.svg';
import Health from './Categoriesicons/Health.svg';
import Social from './Categoriesicons/Social.svg';
import Transportation from './Categoriesicons/Transportation.svg';
import Beauty from './Categoriesicons/Beauty.svg';
import Vehicle from './Categoriesicons/Vehicle.svg';
import Education from './Categoriesicons/Education.svg';
import Investment from './Categoriesicons/Investment.svg';
import HousingAndRepair from './Categoriesicons/Housing & Repair.svg';
import GiftsAndDonations from './Categoriesicons/Gifts & Donations.svg';
import Others from './Categoriesicons/Others.svg';

// Category dat\172693+

const categoryData = [
  { name: 'Shopping', icon: Shopping },
  { name: 'Food', icon: Food },
  { name: 'Grocery', icon: Grocery },
  { name: 'Bills', icon: Bills },
  { name: 'Entertainment', icon: Entertainment },
  { name: 'Health', icon: Health },
  { name: 'Social', icon: Social },
  { name: 'Transportation', icon: Transportation },
  { name: 'Beauty', icon: Beauty },
  { name: 'Vehicle', icon: Vehicle },
  { name: 'Education', icon: Education },
  { name: 'Investment', icon: Investment },
  { name: 'Housing & Repair', icon: HousingAndRepair },
  { name: 'Gifts & Donations', icon: GiftsAndDonations },
  { name: 'Others', icon: Others },
];

const ExpenseCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false); // Track submission state

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSubmit = async ({ amount, note }) => {
    if (isNaN(amount) || amount <= 0) {
      // Add some validation for the amount (should be a positive number)
      alert('Please enter a valid amount.');
      return;
    }

    setLoading(true); // Disable the button when submitting
    const auth = getAuth();
    const db = getFirestore();

    try {
      const record = {
        userId: auth.currentUser.uid,
        category: selectedCategory.name,
        amount: parseFloat(amount),
        note,
        timestamp: new Date().toISOString(),
      };

      await addDoc(collection(db, 'expenses'), record);
      console.log('Record saved to Firebase:', record);

      // Optionally, show a success message or toast
      setSelectedCategory(null); // Close keyboard
      setLoading(false); // Reset loading state
    } catch (error) {
      console.error('Error saving record:', error);
      setLoading(false); // Reset loading state
      // Optionally, show an error toast or message
    }
  };

  return (
    <div className="category-container">
      <h2 className="category-heading">SELECT CATEGORY</h2>

      <div className="category-grid">
        {categoryData.map((cat) => (
          <div
            key={cat.name}
            className={`category-item ${selectedCategory?.name === cat.name ? 'selected' : ''}`}
            onClick={() => handleCategoryClick(cat)}
          >
            <img src={cat.icon} alt={cat.name} className="category-icon" />
            <span className="category-label">{cat.name}</span>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <Keyboard onSubmit={handleSubmit} loading={loading} /> // Pass loading state to Keyboard component
      )}
    </div>
  );
};

export default ExpenseCategories;


