
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
    spent: 0,
    total: 0,
    categories: [],
  };

  const [date, setDate] = React.useState();

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      <div className="max-w-md mx-auto px-4">
        <header className="py-4 flex items-center justify-between">
        <div className="flex justify-center items-center mt-6">
        <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full mr-2"></div>
        <h1 className="text-2xl font-bold">OutFlow</h1>
      </div>
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

        <div className="mt-5 p-3 rounded-lg bg-white/5 backdrop-blur-sm text-center">
          <p className="text-white">Start tracking your budget 🎯</p>
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










