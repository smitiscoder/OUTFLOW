import React from 'react';
import { Home, PieChart, Search, User, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const navIconStyle =
  'inline-flex items-center justify-center p-2 text-[#DFDFDF] hover:bg-white/10 rounded-md transition';

const BottomNavbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 py-2 z-50">
      <div className="relative flex items-center justify-around max-w-md mx-auto bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-lg shadow-lg border-t border-white/10 px-4 py-2 rounded-t-3xl">

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
          className="relative z-20"
        >
          <Link
            to="/ExpenseCategory"
            className="p-2 bg-gradient-to-br from-purple-600 to-purple-500 text-white rounded-full shadow-[0_4px_12px_rgba(147,51,234,0.3)] hover:shadow-[0_6px_16px_rgba(147,51,234,0.5)] transition-all inline-flex items-center justify-center"
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
