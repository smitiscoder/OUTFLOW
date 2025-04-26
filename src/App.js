import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Auth from "./components/login";
import Home from "./pages/Home";
import ExpenseCategories from "./pages/ExpenseCategories";
import AddRecord from "./pages/AddRecord";
import Search from "./pages/Search";
import ReportsScreen from "./pages/ReportsScreen";
import Keyboard from "./pages/Keyboard";
import ProfilePage from "./pages/ProfilePage";
import Onboarding from "./pages/onboarding";
import Login from "./components/login";
import Phone from "./components/Phone";
import ContinueWithGoogle from "./components/ContinuewithGoogle";

import { ToastContainer } from "react-toastify";
import { auth } from "./components/firebase";

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
        {/* Public Routes */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/phone" element={<Phone />} />
        <Route path="/continuewithgoogle" element={<ContinueWithGoogle />} />

        {/* Protected Routes */}
        {user ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/reports" element={<ReportsScreen />} />
            <Route path="/keyboard" element={<Keyboard />} />
            <Route path="/categories" element={<ExpenseCategories />} />
            <Route path="/addrecord" element={<AddRecord />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<ProfilePage />} />
          </>
        ) : (
          <Route path="*" element={<Auth />} />
        )}

        {/* Fallback route if no path matches */}
        {!user && <Route path="/" element={<Auth />} />}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;




