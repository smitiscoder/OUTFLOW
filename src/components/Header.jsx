import React from 'react';

const Header = ({ title }) => {
  return (
    <div className="w-full py-4 px-6 bg-gray-800 text-white text-xl font-semibold shadow-md rounded-b-lg">
      {title}
    </div>
  );
};

export default Header;
