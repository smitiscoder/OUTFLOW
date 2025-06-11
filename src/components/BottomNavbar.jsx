import React from 'react';
import { Home, PieChart, Search, User, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const navIconStyle =
  'inline-flex items-center justify-center p-2 text-[#DFDFDF] transition';

const BottomNavbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 py-2 z-50 bg-[#0D0D0D] border-t border-white/5">
      <div className="relative flex items-center justify-around max-w-md mx-auto px-4 py-2">
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
            className="p-2 bg-purple-600 text-white rounded-full shadow-[0_4px_12px_rgba(147,51,234,0.3)] hover:bg-purple-700 hover:shadow-[0_6px_16px_rgba(147,51,234,0.5)] transition-all inline-flex items-center justify-center"
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
