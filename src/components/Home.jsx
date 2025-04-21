
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import BudgetGauge from '../components/BudgetGauge';
import BudgetCategory from '../components/BudgetCategory';
import BottomNav from '../components/BottomNavbar';
import { Button } from '../components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { format } from 'date-fns';

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

  const [date, setDate] = React.useState();

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      <div className="max-w-md mx-auto px-4">
        <header className="py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Spending & Budgets</h1>
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 bg-gray-800 rounded hover:bg-gray-700">
                <CalendarIcon className="w-6 h-6" />
              </button> 
            </PopoverTrigger>
            <PopoverContent className="z-50 bg-white rounded-lg p-3 text-black shadow-xl w-auto" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-1"
              />
            </PopoverContent>
          </Popover>
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










