import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import MonthYearModal from '../components/MonthYearModal';
import BottomNavbar from '../components/BottomNavbar';
import './Home.css';
import { useExpenses } from '../ExpenseContext'; // ✅ import context

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState({
    year: 2025,
    month: 'APR',
  });
  const [loading, setLoading] = useState(true); // Loading state

  const { expenses, setExpenses } = useExpenses(); // ✅ use context
  const db = getFirestore();
  const auth = getAuth();

  const handleDateClick = () => setShowModal(true);

  const handleDateSelect = (year, month) => {
    setCurrentDate({ year, month });
    setShowModal(false);
  };

  const monthMap = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
  };

  const fetchExpenses = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(db, 'expenses'), where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setLoading(false);
      const monthIndex = monthMap[currentDate.month];

      const allExpenses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredExpenses = allExpenses.filter((exp) => {
        const rawTimestamp = exp.timestamp;

        let date;
        if (rawTimestamp instanceof Date) {
          date = rawTimestamp;
        } else if (rawTimestamp?.toDate) {
          date = rawTimestamp.toDate();
        } else if (typeof rawTimestamp === 'string') {
          date = new Date(rawTimestamp);
        } else {
          return false;
        }

        return (
          date.getFullYear() === parseInt(currentDate.year) &&
          date.getMonth() === monthIndex
        );
      });

      // ✅ Sort filtered expenses by timestamp DESC (newest first)
      const sortedExpenses = filteredExpenses.sort((a, b) => {
        const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return dateB - dateA;
      });

      setExpenses(sortedExpenses); // ✅ Update context with sorted expenses
    }, (error) => {
      setLoading(false);
      console.error("Error fetching expenses: ", error);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchExpenses();
    return () => unsubscribe && unsubscribe();
  }, [currentDate]);

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

        <div className="nav-section">
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading...</p>
          ) : expenses.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              No expenses added yet.
            </p>
          ) : (
            expenses.map((exp) => (
              <div className="expense-card" key={exp.id}>
                <div className="expense-header">
                  <strong>{exp.category}</strong>
                  <span>₹{exp.amount}</span>
                </div>
                {exp.note && <div className="expense-note">{exp.note}</div>}
                <div className="expense-date">
                  {new Date(
                    exp.timestamp?.toDate ? exp.timestamp.toDate() : exp.timestamp
                  ).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar />

      {/* Date Modal (Floating Calendar) */}
      {showModal && (
        <>
          <div className="backdrop" onClick={() => setShowModal(false)}></div>
          <div className="modal-container">
            <MonthYearModal
              currentYear={currentDate.year}
              currentMonth={currentDate.month}
              onSelect={handleDateSelect}
              onClose={() => setShowModal(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;









