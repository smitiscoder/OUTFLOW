import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Public Pages
import Login from "./pages/Login/login";
import Phone from "./pages/Login/Phone";
import EmailLogin from "./pages/Login/EmailLogin";
import ContinueWithGoogle from "./pages/Login/ContinuewithGoogle";
import ForgotPassword from "./pages/Login/ForgotPassword";
import EmailSignup from "./pages/Login/EmailSignup";
import OnBoarding from "./pages/OnBoarding";

// Protected Pages
import Home from "./pages/Home/Homemain";
import Search from "./pages/Search/SearchMain";
import Reports from "./pages/Reports/ReportsScreen";
import BarGraphScreen from "./pages/Reports/BarGraphScreen"; // Added
import RecurringExpenses from "./pages/Reports/RecurringExpenses"; // Added
import ExpenseCategory from "./pages/Add Expense/ExpenseCategory";
import ProfileMain from "./pages/Profile/ProfileMain";
import SetBudget from "./pages/Profile/SetBudget";
import Notifications from "./pages/Profile/Notifications";
import UpdateEmail from "./pages/Profile/UpdateEmail";
import UpdatePhone from "./pages/Profile/Phonenumberupadte";

function AppRoutes({ user }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/onboarding" element={<OnBoarding />} />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/phone" element={user ? <Navigate to="/" replace /> : <Phone />} />
      <Route path="/email" element={user ? <Navigate to="/" replace /> : <EmailLogin />} />
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <EmailSignup />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/" replace /> : <ForgotPassword />} />
      <Route path="/continuewithgoogle" element={user ? <Navigate to="/" replace /> : <ContinueWithGoogle />} />

      {/* Redirect /home to root */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      {/* Protected Routes */}
      {user ? (
        <>
          {/* Main layout with nested routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="reports" element={<Reports />} />
            <Route path="bar-graphs" element={<BarGraphScreen />} /> {/* Added */}
            <Route path="recurring-expenses" element={<RecurringExpenses />} /> {/* Added */}
            <Route path="expensecategory" element={<ExpenseCategory />} />
            <Route path="search" element={<Search />} />
            <Route path="profile" element={<ProfileMain />} />
            <Route path="setbudget" element={<SetBudget />} />
            <Route path="notifications" element={<Notifications />} />
            {/* Fallback for unmatched routes */}
            <Route
              path="*"
              element={<div className="text-center text-2xl p-10">404 - Page Not Found</div>}
            />
          </Route>

          {/* Settings pages outside layout */}
          <Route path="/update-email" element={<UpdateEmail />} />
          <Route path="/update-phone" element={<UpdatePhone />} />
        </>
      ) : (
        // Redirect any unknown route to login if not authenticated
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default AppRoutes;
