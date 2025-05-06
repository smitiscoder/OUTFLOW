import React from 'react';
import { Home, PieChart, Search, User, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const navIconStyle =
  'inline-flex items-center justify-center p-2 text-[#DFDFDF] hover:bg-white/10 rounded-md transition';

const BottomNavbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-transparent py-2 z-50">
      <div className="relative flex items-center justify-around max-w-md mx-auto">

        {/* Curved background behind center button */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg blur-md" />

        {/* Home */}
        <Link to="/" className={navIconStyle}>
          <Home className="w-6 h-6" />
        </Link>

        {/* Reports */}
        <Link to="/reports" className={navIconStyle}>
          <PieChart className="w-6 h-6" />
        </Link>

        {/* + Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="relative -top-8 z-20"
        >
          <Link
            to="/ExpenseCategory"
            className="p-3 bg-gradient-to-br from-red-500 to-orange-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </Link>
        </motion.div>

        {/* Search */}
        <Link to="/search" className={navIconStyle}>
          <Search className="w-6 h-6" />
        </Link>

        {/* Profile */}
        <Link to="/profile" className={navIconStyle}>
          <User className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default BottomNavbar;
