import React, { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Auth from "./components/Auth";
import Home from "./pages/Home";
import PieChartPage from "./pages/PieChartPage"; // ✅ Renamed for clarity
import ExpenseCategories from "./pages/ExpenseCategories";
import AddRecord from "./pages/AddRecord";
import Search from "./pages/Search";
import PhoneLogin from "./components/Phone";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth } from "./components/firebase";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true); // optional loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (checkingAuth) return null; // or a loader

  return (
    <Router>
      {user ? (
        <>
          <div className="auth-wrapper">
            <div className="auth-inner">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/home" element={<Home />} />
                <Route path="/piechart" element={<PieChartPage />} />
                <Route path="/categories" element={<ExpenseCategories />} />
                <Route path="/addrecord" element={<AddRecord />} />
                <Route path="/search" element={<Search />} />
              </Routes>
              <ToastContainer />
            </div>
          </div>
        </>
      ) : (
        <PhoneLogin />
      )}
    </Router>
  );
}

export default App;



