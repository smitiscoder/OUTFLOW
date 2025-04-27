import React, { useState } from 'react';
import { ShoppingCart, Utensils, Phone, Mic, BookOpen, Scissors, Dumbbell, Users, Bus, Shirt, Car, Smartphone, Plane, Stethoscope, Dog, Wrench, Home, Gift, Heart, Ticket, Cookie, Baby, Salad, Apple } from 'lucide-react';

// Firebase imports
import { getAuth } from 'firebase/auth'; // Import getAuth
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Import Firestore functions

// Keyboard component import
import Keyboard from '../pages/Keyboard'; // Make sure the path is correct for Keyboard component

// New Category Data with updated icons
const expensecategories = [
  { id: 'shopping', icon: ShoppingCart, label: 'Shopping' },
  { id: 'food', icon: Utensils, label: 'Food' },
  { id: 'phone', icon: Phone, label: 'Phone' },
  { id: 'entertainment', icon: Mic, label: 'Entertainment' },
  { id: 'education', icon: BookOpen, label: 'Education' },
  { id: 'beauty', icon: Scissors, label: 'Beauty' },
  { id: 'sports', icon: Dumbbell, label: 'Sports' },
  { id: 'social', icon: Users, label: 'Social' },
  { id: 'transportation', icon: Bus, label: 'Transportation' },
  { id: 'clothing', icon: Shirt, label: 'Clothing' },
  { id: 'car', icon: Car, label: 'Car' },
  { id: 'electronics', icon: Smartphone, label: 'Electronics' },
  { id: 'travel', icon: Plane, label: 'Travel' },
  { id: 'health', icon: Stethoscope, label: 'Health' },
  { id: 'pets', icon: Dog, label: 'Pets' },
  { id: 'repairs', icon: Wrench, label: 'Repairs' },
  { id: 'housing', icon: Home, label: 'Housing' },
  { id: 'gifts', icon: Gift, label: 'Gifts' },
  { id: 'donations', icon: Heart, label: 'Donations' },
  { id: 'lottery', icon: Ticket, label: 'Lottery' },
  { id: 'snacks', icon: Cookie, label: 'Snacks' },
  { id: 'kids', icon: Baby, label: 'Kids' },
  { id: 'vegetables', icon: Salad, label: 'Vegetables' },
  { id: 'fruits', icon: Apple, label: 'Fruits' },
];

const ExpenseCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false); // Track submission state

  const handleCategoryClick = (id, label) => {
    setSelectedCategory({ id, label });
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
        category: selectedCategory.label,
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
    <div className="category-container px-4 py-4">
    <h2 className="category-heading text-center text-2xl font-semibold mb-4 text-white">SELECT CATEGORY</h2>

  
      {/* Category Grid with Fixed 4x6 Layout */}
      <div className="category-grid grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4">
        {expensecategories.map(({ id, icon: Icon, label }) => (
          <div
            key={id}
            className={`category-item flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-800 cursor-pointer transition-all ${
              selectedCategory?.id === id ? 'bg-gray-600' : ''
            }`}
            onClick={() => handleCategoryClick(id, label)}
          >
            <div className="category-icon-container w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mb-1">
              <Icon className="category-icon w-6 h-6 text-white" />
            </div>
            <span className="category-label text-sm text-white">{label}</span>
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









