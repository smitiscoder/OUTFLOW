// src/layouts/MainLayout.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavbar from '../BottomNavbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden bg-[#0D0D0D]">
      {/* Main content area with proper padding for different devices */}
      <div className="flex-1 w-full overflow-x-hidden px-2 sm:px-6 md:px-8 lg:px-10 pb-20 sm:pb-24 md:pb-28">
        {/* Container with max-width constraints for different screen sizes */}
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] mx-auto">
          <Outlet />
        </div>
      </div>
      {/* Bottom navigation with responsive padding */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default MainLayout;
