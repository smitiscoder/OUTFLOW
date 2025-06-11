import React, { useState } from 'react';
import { 
  ShoppingCart, Utensils, FileText, Mic, 
  Stethoscope, Users, Bus, Scissors, Car, BookOpen, 
  TrendingUp, Home, Gift, Plane, Shield, CreditCard,
  Dog, Wrench, Pen, Smartphone, Baby, Cookie, Apple,
  MoreHorizontal, Banknote, Salad, X // Import X icon
} from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import Keyboard from './Keyboard';

const expensecategories = [
  { id: 'shopping', icon: ShoppingCart, label: 'Shopping' },
  { id: 'food', icon: Utensils, label: 'Food' },
  { id: 'grocery', icon: Salad, label: 'Grocery' },
  { id: 'bills', icon: FileText, label: 'Bills' },
  { id: 'entertainment', icon: Mic, label: 'Entertainment' },
  { id: 'health', icon: Stethoscope, label: 'Health' },
  { id: 'social', icon: Users, label: 'Social' },
  { id: 'transportation', icon: Bus, label: 'Transportation' },
  { id: 'beauty', icon: Scissors, label: 'Beauty' },
  { id: 'vehicle', icon: Car, label: 'Vehicle' },
  { id: 'education', icon: BookOpen, label: 'Education' },
  { id: 'investment', icon: TrendingUp, label: 'Investment' },
  { id: 'housing_repair', icon: Wrench, label: 'Housing & Repair' },
  { id: 'gifts_donations', icon: Gift, label: 'Gifts & Donations' },
  { id: 'travel', icon: Plane, label: 'Travel' },
  { id: 'insurance', icon: Shield, label: 'Insurance' },
  { id: 'subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { id: 'pets', icon: Dog, label: 'Pets' },
  { id: 'emi_loans', icon: Banknote, label: 'EMIs & Loans' },
  { id: 'electronics', icon: Smartphone, label: 'Electronics' },
  { id: 'kids', icon: Baby, label: 'Kids' },
  { id: 'snacks', icon: Cookie, label: 'Snacks' },
  { id: 'fruits', icon: Apple, label: 'Fruits' },
  { id: 'others', icon: Pen, label: 'Others' },
];

const ExpenseCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCategoryClick = (id, label) => {
    setSelectedCategory({ id, label });
  };

  const handleSubmit = async ({ amount, note }) => {
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setLoading(true);
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
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error saving record:', error);
    } finally {
      setLoading(false);
    }
  };

  // Close handler
  const handleClose = () => {
    window.history.back(); // Navigate back in browser history
    // Alternatively, you could use: 
    // - useNavigate() from react-router-dom: navigate(-1)
    // - A custom onClose prop: onClose()
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF] pb-20 relative">
      <div className="w-full max-w-screen-lg mx-auto px-4">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-[#1A1A1A] transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-[#DFDFDF]" />
        </button>

        <h2 className="text-center text-2xl font-semibold mb-6 pt-6">SELECT CATEGORY</h2>

        {/* Fixed 6x4 Grid (24 items max) */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {expensecategories.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                selectedCategory?.id === id 
                  ? 'bg-[#1A1A1A] border border-[#DFDFDF]/20' 
                  : 'hover:bg-[#1A1A1A]'
              }`}
              onClick={() => handleCategoryClick(id, label)}
            >
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-2">
                <Icon className="w-5 h-5 text-[#DFDFDF]" />
              </div>
              <span className="text-xs text-center">{label}</span>
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] p-4 rounded-t-2xl shadow-lg border-t border-[#DFDFDF]/10">
            <Keyboard 
              category={selectedCategory.label} 
              onSubmit={handleSubmit} 
              loading={loading} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseCategories;






