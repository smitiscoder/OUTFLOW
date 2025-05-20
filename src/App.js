import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useExpenses } from "./Context/ExpenseContext";

// Components
import SplashScreen from "./components/SplashScreen"; // New splash screen
import Loader from "./components/Loading"; // Loading screen
import ScrollToTop from "./components/ScrollToTop"; // Add this import

// Styles
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Firebase Auth
import { auth } from "./components/firebase";

// Toast Notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// App Routes
import AppRoutes from "./AppRoutes";

function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const { isOffline } = useExpenses();

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsAuthLoading(false);
    });

    return () => {
      clearTimeout(splashTimer);
      unsubscribe();
    };
  }, []);

  if (showSplash) return <SplashScreen />;
  if (isAuthLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      <Router>
        <ScrollToTop /> {/* Add this component here */}

        {isOffline && (
          <div
            style={{
              background: "#ffcc00",
              padding: "10px",
              textAlign: "center",
              color: "#333",
              fontWeight: "bold",
            }}
          >
            You are offline. Changes will sync when you reconnect.
          </div>
        )}

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

        <AppRoutes user={user} isAuthLoading={isAuthLoading} />
      </Router>
    </div>
  );
}

export default App;

