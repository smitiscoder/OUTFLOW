import React from 'react';
import './ExpenseCategories.css';

// Import all icons
import Shopping from './Categoriesicons/Shopping.svg';
import Food from './Categoriesicons/Food.svg';
import Grocery from './Categoriesicons/Grocery.svg';
import Bills from './Categoriesicons/Bills.svg';
import Entertainment from './Categoriesicons/Entertainment.svg';
import Health from './Categoriesicons/Health.svg';
import Social from './Categoriesicons/Social.svg';
import Transportation from './Categoriesicons/Transportation.svg';
import Beauty from './Categoriesicons/Beauty.svg';
import Vehicle from './Categoriesicons/Vehicle.svg';
import Education from './Categoriesicons/Education.svg';
import Investment from './Categoriesicons/Investment.svg';
import HousingAndRepair from './Categoriesicons/Housing & Repair.svg';
import GiftsAndDonations from './Categoriesicons/Gifts & Donations.svg';
import Others from './Categoriesicons/Others.svg';

// Category data
const categoryData = [
  { name: 'Shopping', icon: Shopping },
  { name: 'Food', icon: Food },
  { name: 'Grocery', icon: Grocery },
  { name: 'Bills', icon: Bills },
  { name: 'Entertainment', icon: Entertainment },
  { name: 'Health', icon: Health },
  { name: 'Social', icon: Social },
  { name: 'Transportation', icon: Transportation },
  { name: 'Beauty', icon: Beauty },
  { name: 'Vehicle', icon: Vehicle },
  { name: 'Education', icon: Education },
  { name: 'Investment', icon: Investment },
  { name: 'Housing & Repair', icon: HousingAndRepair },
  { name: 'Gifts & Donations', icon: GiftsAndDonations },
  { name: 'Others', icon: Others },
];

const ExpenseCategories = () => {
  return (
    <div className="category-container">
      <h2 className="category-heading">SELECT CATEGORY</h2>
      <div className="category-grid">
        {categoryData.map(({ name, icon }) => (
          <div className="category-item" key={name}>
            <img src={icon} alt={name} className="category-icon" />
            <span className="category-label">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseCategories;

