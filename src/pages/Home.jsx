import React, { useState } from 'react';
import MonthYearModal from '../components/MonthYearModal';
import BottomNavbar from '../components/BottomNavbar';
import './Home.css';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState({
    year: 2025,
    month: 'APR',
  });

  const handleDateClick = () => setShowModal(true);
  const handleDateSelect = (year, month) => {
    setCurrentDate({ year, month });
    setShowModal(false);
  };

  return (
    <div className="home-container">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="date-and-tab">
          <div className="date-display" onClick={handleDateClick}>
            <span className="month">{currentDate.month}</span>
            <span className="year">{currentDate.year}</span>
            <span className="dropdown-icon">▼</span>
          </div>
          <div className="current-section">EXPENSES</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="divider"></div>
        <div className="nav-section">{/* Add your dynamic content here */}</div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar />

      {/* Date Modal */}
      {showModal && (
        <MonthYearModal
          currentYear={currentDate.year}
          currentMonth={currentDate.month}
          onSelect={handleDateSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Home;


