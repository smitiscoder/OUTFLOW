
import React from 'react';
import { Home, PieChart, Search, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';


const BottomNavbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-white/10 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Button variant="ghost" size="icon" className="text-white">
          <Home className="w-6 h-6" />
        </Button>


        <Button variant="ghost" size="icon" className="text-white">
             <Link to="/Reports" className="flex items-center justify-center w-full h-full">
               <PieChart className="w-6 h-6" />
            </Link>
        </Button>




        <Button variant="ghost" size="icon" className="text-white relative -top-8 p-2 rounded-full bg-accent-orange hover:bg-accent-orange/90">
          <Link to="/keyboard" className="flex items-center justify-center w-full h-full">
          <span className="text-3xl font-bold text-white">+</span>
          </Link>
        </Button>



        <Button variant="ghost" size="icon" className="text-white">
          <Search className="w-6 h-6" />
        </Button>


        <Button variant="ghost" size="icon" className="text-white">
          <Link to="/Profile" className="flex items-center justify-center w-full h-full">
          <User className="w-6 h-6" />
          </Link>
        </Button>



      </div>
    </div>
  );
};

export default BottomNavbar;



