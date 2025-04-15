import React from 'react';

const TopNavbar = ({ date, onDateClick }) => {
  return (
    <div className="p-4 bg-[#ECD8A0]">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={onDateClick}
          className="text-2xl font-bold flex items-center hover:bg-black/10 px-3 py-1 rounded-lg transition-colors"
        >
          {date.year}{date.month} ▼
        </button>
      </div>
    </div>
  );
};

export default TopNavbar;