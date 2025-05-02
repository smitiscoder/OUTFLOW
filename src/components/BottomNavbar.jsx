import React from 'react';
import { Home, PieChart, Search, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const BottomNavbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0D0D0D]/90 backdrop-blur-lg border-t border-[#DFDFDF]/10 py-2 z-50">
      <div className="relative flex items-center justify-around max-w-md mx-auto">

        {/* Curved background behind + button */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#0D0D0D] rounded-full z-0 shadow-lg" />

        {/* Home */}
        <Button variant="ghost" size="icon" className="text-[#DFDFDF] hover:bg-[#1A1A1A] z-10">
          <Link to="/" className="flex items-center justify-center w-full h-full">
            <Home className="w-6 h-6" />
          </Link>
        </Button>

        {/* Reports */}
        <Button variant="ghost" size="icon" className="text-[#DFDFDF] hover:bg-[#1A1A1A] z-10">
          <Link to="/reports" className="flex items-center justify-center w-full h-full">
            <PieChart className="w-6 h-6" />
          </Link>
        </Button>

        {/* + Button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white relative -top-8 z-20 p-4 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all">
          <Link to="/ExpenseCategory" className="flex items-center justify-center w-full h-full">
            <span className="text-3xl font-bold text-[#DFDFDF]">+</span>
          </Link>
        </Button>

        {/* Search */}
        <Button variant="ghost" size="icon" className="text-[#DFDFDF] hover:bg-[#1A1A1A] z-10">
          <Link to="/search" className="flex items-center justify-center w-full h-full">
            <Search className="w-6 h-6" />
          </Link>
        </Button>

        {/* Profile */}
        <Button variant="ghost" size="icon" className="text-[#DFDFDF] hover:bg-[#1A1A1A] z-10">
          <Link to="/profile" className="flex items-center justify-center w-full h-full">
            <User className="w-6 h-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BottomNavbar;




