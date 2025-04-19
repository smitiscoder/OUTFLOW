import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Calendar from '../components/Calendar'; // ✅ updated import
import BottomNavbar from '../components/BottomNavbar';
import './Home.css';
import { useExpenses } from '../ExpenseContext'; // ✅ import context

const Home = () => {
  const [currentDate, setCurrentDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [loading, setLoading] = useState(true);

  const { expenses, setExpenses } = useExpenses();
  const db = getFirestore();
  const auth = getAuth();

  const monthMap = {
    0: 'JAN', 1: 'FEB', 2: 'MAR', 3: 'APR', 4: 'MAY', 5: 'JUN',
    6: 'JUL', 7: 'AUG', 8: 'SEP', 9: 'OCT', 10: 'NOV', 11: 'DEC',
  };

  const fetchExpenses = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(db, 'expenses'), where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setLoading(false);
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
          date.getMonth() === currentDate.month
        );
      });

      const sortedExpenses = filteredExpenses.sort((a, b) => {
        const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return dateB - dateA;
      });

      setExpenses(sortedExpenses);
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

  const handleDateChange = (year, month) => {
    setCurrentDate({ year, month });
  };

  return (
    <div className="home-container">
      {/* ✅ Calendar Button on Top */}
      <div className="calendar-button-container">
        <Calendar
          selectedYear={currentDate.year}
          selectedMonth={currentDate.month}
          onDateChange={handleDateChange}
        />
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

      {/* ✅ Bottom Navigation */}
      <BottomNavbar />
    </div>
  );
};

export default Home;












