import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login/login";
import Phone from "./pages/Login/Phone";
import EmailLogin from "./pages/Login/EmailLogin"; // Added EmailLogin import
import ContinueWithGoogle from "./pages/Login/ContinuewithGoogle";
// Placeholder imports for ForgotPassword and Signup (create these components)
import ForgotPassword from "./pages/Login/ForgotPassword"; // Adjust path as needed
import EmailSignup from "./pages/Login/EmailSignup"; // Adjust path as needed

import Home from "./pages/Home/Homemain";
import Search from "./pages/Search";
import Reports from "./pages/Reports";
import ExpenseCategory from "./pages/ExpenseCategory";
import ProfileMain from "./pages/Profile/ProfileMain";
import OnBoarding from "./pages/OnBoarding";
import UpdateEmail from "./pages/Profile/UpdateEmail";
import UpdatePhone from "./pages/Profile/Phonenumberupadte";
import SetBudget from "./pages/Profile/SetBudget";
import Notifications from "./pages/Profile/Notifications";

function AppRoutes({ user }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/onboarding" element={<OnBoarding />} />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/phone" element={user ? <Navigate to="/" replace /> : <Phone />} />
      <Route
        path="/email"
        element={user ? <Navigate to="/" replace /> : <EmailLogin />}
      />
      <Route
        path="/forgot-password"
        element={user ? <Navigate to="/" replace /> : <ForgotPassword />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <EmailSignup />}
      />
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