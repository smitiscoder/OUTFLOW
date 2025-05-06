import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import Login from "./components/login";
import Phone from "./components/Phone";
import ContinueWithGoogle from "./components/ContinuewithGoogle";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Reports from "./pages/Reports";
import ExpenseCategory from "./pages/ExpenseCategory";
import ProfilePage from "./pages/ProfilePage";
import OnBoarding from "./pages/OnBoarding";
import UpdateEmail from "./pages/UpdateEmail";
import UpdatePhone from "./pages/Phonenumberupadte";

function AppRoutes({ user }) {
  const [firstVisit, setFirstVisit] = useState(false);
  const [checkedVisit, setCheckedVisit] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      setFirstVisit(true);
    } else {
      setFirstVisit(false);
    }

    setCheckedVisit(true);
  }, []);

  // Show nothing until the check is done
  if (!checkedVisit) return null;

  // Redirect to onboarding only on first visit
  if (firstVisit && location.pathname !== "/OnBoarding") {
    return <Navigate to="/OnBoarding" replace />;
  }

  return (
    <Routes>
      {/* ✅ Public Routes */}
      <Route path="/OnBoarding" element={<OnBoarding />} />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/phone" element={user ? <Navigate to="/" replace /> : <Phone />} />
      <Route path="/continuewithgoogle" element={user ? <Navigate to="/" replace /> : <ContinueWithGoogle />} />

      {/* ✅ Redirect /home to root */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      {/* ✅ Protected Routes */}
      {user ? (
        <>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="reports" element={<Reports />} />
            <Route path="expensecategory" element={<ExpenseCategory />} />
            <Route path="search" element={<Search />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="/update-email" element={<UpdateEmail />} />
          <Route path="/update-phone" element={<UpdatePhone />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}

      {/* ✅ Fallback 404 */}
      {!user && (
        <Route path="*" element={<div className="text-center text-2xl p-10">404 - Page Not Found</div>} />
      )}
    </Routes>
  );
}

export default AppRoutes;



