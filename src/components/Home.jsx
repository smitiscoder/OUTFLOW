
import React from 'react';
import { Calendar } from 'lucide-react';
import BudgetGauge from '../components/BudgetGauge';
import BudgetCategory from '../components/BudgetCategory';
import BottomNav from '../components/BottomNavbar';
import { Button } from '../components/ui/button';

const Home = () => {
  const budgetData = {
    spent: 82.97,
    total: 2000,
    categories: [
      {
        type: 'auto',
        spent: 25.99,
        total: 400,
        remaining: 375,
      },
      {
        type: 'entertainment',
        spent: 50.99,
        total: 500,
        remaining: 375,
      },
      {
        type: 'security',
        spent: 5.99,
        total: 900,
        remaining: 375,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">

      <div className="max-w-md mx-auto px-4">
        <header className="py-4 flex items-center justify-between">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full ">
      {/* You can add an icon or some content inside the circle */}
    </div>
    <h1 className="text-2xl font-bold tracking-wide text-center ">OutFlow</h1>
          <Button variant="ghost" size="icon">
            <Calendar className="w-6 h-6" />
          </Button>
        </header>

        <BudgetGauge spent={budgetData.spent} total={budgetData.total} />

        <div className="mt-4 p-3 rounded-lg bg-white/5 backdrop-blur-sm text-center">
          <p className="text-white">Your budgets are on track 👍</p>
        </div>

        <div className="mt-6 space-y-4">
          {budgetData.categories.map((category) => (
            <BudgetCategory key={category.type} {...category} />
          ))}
        </div>

        <button className="w-full mt-4 p-4 rounded-xl text-gray-400 border border-dashed border-gray-700 hover:border-gray-600 transition-colors">
          Add new category
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;









