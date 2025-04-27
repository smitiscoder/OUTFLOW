// src/layouts/MainLayout.jsx
import React from 'react';
import BottomNavbar from '../BottomNavbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen pb-20"> {/* Padding bottom for navbar space */}
      <Outlet /> 
      <BottomNavbar />
    </div>
  );
};

export default MainLayout;
