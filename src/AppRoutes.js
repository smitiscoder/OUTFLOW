import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import Login from "./components/login";
import Phone from "./components/Phone";
import ContinueWithGoogle from "./components/ContinuewithGoogle";

import Home from "./pages/Home/Homemain";
import Search from "./pages/Search";
import Reports from "./pages/Reports";
import ExpenseCategory from "./pages/ExpenseCategory";
import ProfileMain from "./pages/Profile/ProfileMain"; // Fixed case
import OnBoarding from "./pages/OnBoarding";
import UpdateEmail from "./pages/UpdateEmail";
import UpdatePhone from "./pages/Phonenumberupadte";
import SetBudget from "./pages/SetBudget";
import Notifications from "./pages/Profile/Notifications";

function AppRoutes({ user }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/onboarding" element={<OnBoarding />} />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/phone" element={user ? <Navigate to="/" replace /> : <Phone />} />
      <Route
        path="/continuewithgoogle"
        element={user ? <Navigate to="/" replace /> : <ContinueWithGoogle />}
      />

      {/* Redirect /home to root */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      {/* Protected Routes */}
      {user ? (
        <>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="reports" element={<Reports />} />
            <Route path="expensecategory" element={<ExpenseCategory />} />
            <Route path="search" element={<Search />} />
            <Route path="profile" element={<ProfileMain />} />
            <Route path="setbudget" element={<SetBudget />} />
            <Route path="notifications" element={<Notifications />} />
            {/* Fallback 404 for protected routes */}
            <Route
              path="*"
              element={<div className="text-center text-2xl p-10">404 - Page Not Found</div>}
            />
          </Route>

          {/* Account Settings Outside Layout */}
          <Route path="/update-email" element={<UpdateEmail />} />
          <Route path="/update-phone" element={<UpdatePhone />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default AppRoutes;



