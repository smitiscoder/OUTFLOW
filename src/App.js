import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Auth from "./components/login";
import Home from "./components/Home";

import ExpenseCategories from "./pages/ExpenseCategories";
import AddRecord from "./pages/AddRecord";
import Search from "./components/Search";
import ReportsScreen from "./components/ReportsScreen";
import Keyboard from "./components/Keyboard"; // Corrected import ✅

import ProfilePage from "./components/ProfilePage"; // Corrected import ✅

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth } from "./components/firebase";
import Onboarding from "./components/onboarding";
import Login from "./components/login";
import Phone from "./components/Phone";
import ContinueWithGoogle from "./components/ContinuewithGoogle";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

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
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/phone" element={<Phone/>} />
        <Route path="/continuewithgoogle" element={<ContinueWithGoogle/>} />

        {/* Protected routes */}
        {user ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/reports" element={<ReportsScreen />} />
            <Route path="/keyboard" element={<Keyboard/>} />

            
            <Route path="/categories" element={<ExpenseCategories />} />
            <Route path="/addrecord" element={<AddRecord />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<ProfilePage />} />
          </>
        ) : (
          <Route path="/" element={<Auth />} /> // Default to Auth if no user is logged in
        )}

        {/* If no route matches */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;




