import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useExpenses } from "./Context/ExpenseContext"; // Import ExpenseContext hook

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { auth } from "./components/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRoutes from "./AppRoutes"; // Import the new routing file

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { isOffline } = useExpenses(); // Access isOffline from ExpenseContext

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (checkingAuth) return <div>Loading...</div>;

  return (
    <Router>
      {/* Offline Banner */}
      {isOffline && (
        <div
          style={{
            background: '#ffcc00',
            padding: '10px',
            textAlign: 'center',
            color: '#333',
            fontWeight: 'bold',
          }}
        >
          You are offline. Changes will sync when you reconnect.
        </div>
      )}
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AppRoutes user={user} />
    </Router>
  );
}

export default App;


