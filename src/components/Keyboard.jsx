
import React from 'react';
import { RoundButton } from '../components/ui/roundbutton';
import { X, ShoppingCart, Utensils, Phone, Mic, BookOpen, Scissors, Dumbbell, Users, Bus, Shirt, Car, Smartphone, Plane, Stethoscope, Dog, Wrench, Home, Gift, Heart, Ticket, Cookie, Baby, Salad, Apple, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BadgeDollarSign, Briefcase, Banknote, TrendingUp, RotateCcw, } from 'lucide-react';

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


const incomecategories = [
  { id: 'salary', icon: BadgeDollarSign, label: 'Salary' },
  { id: 'business', icon: Briefcase, label: 'Business' },
  { id: 'investments', icon: Banknote, label: 'Investments' },
  { id: 'interest', icon: TrendingUp, label: 'Interest' },
  { id: 'refund', icon: RotateCcw, label: 'Refund' },
  
];

const Categories = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('expense');
  const visibleCategories = activeTab === 'expense' ? expensecategories : incomecategories;
 

  return (
    <div className="min-h-screen bg-gray-800 text-white pb-24">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <header className="py-4 flex items-center justify-between">
          <RoundButton variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <X className="w-6 h-6" />
          </RoundButton>
          <h1 className="text-xl font-semibold">Add</h1>
          <div className="w-10" /> {/* Spacer to center the title */}
        </header>

        {/* Tabs */}
        <div className="flex rounded-lg bg-white/10 p-1 mb-8">
          {['expense', 'income', ].map((tab) => (
            <RoundButton
              key={tab}
              className="flex-1 py-2 text-sm font-medium rounded-md bg-gray-700 text-white "
                onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </RoundButton>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-4 gap-6">
          {visibleCategories.map(({ id, icon: Icon, label }) => (
            <RoundButton
              key={id}
              className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs text-center">{label}</span>
            </RoundButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;