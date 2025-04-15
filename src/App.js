import React, { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Auth from "./components/Auth"; // fixed path
import Home from "./pages/Home";
import PieChart from "./pages/PieChart";
import ExpenseCategories from "./pages/ExpenseCategories";
import AddRecord from "./pages/AddRecordForm";
import Search from "./pages/Search";
import PhoneLogin from "./components/Phone"; // ✅ new component

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth } from "./components/firebase";

const AppContent = ({ user }) => {
  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/charts" element={<PieChart />} />
            <Route path="/categories" element={<ExpenseCategories />} />
            <Route path="/addrecord" element={<AddRecord />} />
            <Route path="/search" element={<Search />} />
            <Route path="/phone-login" element={<PhoneLogin />} /> {/* ✅ new route */}
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <AppContent user={user} />
    </Router>
  );
}

export default App;

