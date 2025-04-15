import React from 'react';
import './BottomNavbar.css';
import { NavLink } from 'react-router-dom';

import { ReactComponent as HomeIcon } from '../icons/Home.svg';
import { ReactComponent as AddIcon } from '../icons/Add.svg';
import { ReactComponent as SearchIcon } from '../icons/Search.svg';
import { ReactComponent as ProfileIcon } from '../icons/Profile.svg';
import { ReactComponent as PieChartIcon } from '../icons/PieChart.svg';

const BottomNavbar = () => {
  return (
    <div className="bottom-nav">
      <NavLink 
        to="/home" 
        className={({ isActive }) => isActive ? "nav-icon active" : "nav-icon"}>
        <HomeIcon width={24} height={24} />
        <span>RECORDS</span>
      </NavLink>

      <NavLink 
        to="/piechart" 
        className={({ isActive }) => isActive ? "nav-icon active" : "nav-icon"}>
        <PieChartIcon width={24} height={24} />
        <span>CHARTS</span>
      </NavLink>

      <NavLink 
      to="/categories" 
      className="add-button">
      <AddIcon width={36} height={36} />
      </NavLink>


      <NavLink 
        to="/search" 
        className={({ isActive }) => isActive ? "nav-icon active" : "nav-icon"}>
        <SearchIcon width={24} height={24} />
        <span>SEARCH</span>
      </NavLink>

      <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? "nav-icon active" : "nav-icon"}>
        <ProfileIcon width={24} height={24} />
        <span>ME</span>
      </NavLink>
    </div>
  );
};

export default BottomNavbar;



