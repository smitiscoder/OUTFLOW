import React from 'react';

const Header = ({ title }) => {
  return (
    <div className="w-full py-4 px-3 bg-[#0D0D0D] text-white text-xl font-semibold shadow-md rounded-b-lg">
      {title}
    </div>
  );
};

export default Header;
