import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Loader Component
import Loader from "./components/Loading"; // Adjust path if needed

// Layout (Lazy-loaded)
const MainLayout = lazy(() => import("./components/layout/MainLayout"));

// Public Pages (Lazy-loaded)
const Login = lazy(() => import("./pages/Login/login"));
const Phone = lazy(() => import("./pages/Login/Phone"));
const EmailLogin = lazy(() => import("./pages/Login/EmailLogin"));
const ContinueWithGoogle = lazy(() => import("./pages/Login/ContinuewithGoogle"));
const ForgotPassword = lazy(() => import("./pages/Login/ForgotPassword"));
const EmailSignup = lazy(() => import("./pages/Login/EmailSignup"));
const OnBoarding = lazy(() => import("./pages/Onboarding/OnBoarding"));
const Download = lazy(() => import("./pages/Onboarding/Download"));

// Protected Pages (Lazy-loaded)
const Home = lazy(() => import("./pages/Home/Homemain"));
const Search = lazy(() => import("./pages/Search/SearchMain"));
const Reports = lazy(() => import("./pages/Reports/ReportsScreen"));
const BarGraphScreen = lazy(() => import("./pages/Reports/BarGraphScreen"));
const RecurringExpenses = lazy(() => import("./pages/Reports/RecurringExpenses"));
const ExpenseCategory = lazy(() => import("./pages/Add Expense/ExpenseCategory"));
const ProfileMain = lazy(() => import("./pages/Profile/ProfileMain"));
const SetBudget = lazy(() => import("./pages/Profile/SetBudget"));
const Notifications = lazy(() => import("./pages/Profile/Notifications"));
const ExportData = lazy(() => import("./pages/Profile/ExportData"));
const HelpPage = lazy(() => import("./pages/Profile/Help"));

function AppRoutes({ user, isAuthLoading }) {
  const location = useLocation();

  // Show Loader while authentication state is loading
  if (isAuthLoading) {
    return <Loader />;
  }

  // Check if user has visited before (stored in localStorage)
  const hasVisited = localStorage.getItem("hasVisited") === "true";

  // Set hasVisited to true after visiting onboarding
  const markAsVisited = () => {
    localStorage.setItem("hasVisited", "true");
  };

  // Wrapper for OnBoarding to mark as visited
  const OnBoardingWrapper = () => {
    useEffect(() => {
      markAsVisited();
    }, []);
    return <OnBoarding />;
  };

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/onboarding" element={<OnBoardingWrapper />} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/phone" element={user ? <Navigate to="/" replace /> : <Phone />} />
        <Route path="/email" element={user ? <Navigate to="/" replace /> : <EmailLogin />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <EmailSignup />} />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/" replace /> : <ForgotPassword />}
        />
        <Route
          path="/continuewith.google"
          element={user ? <Navigate to="/" replace /> : <ContinueWithGoogle />}
        />
        <Route path="/download" element={<Download />} />

        {/* Redirect /home to root */}
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Root Route Logic */}
        <Route
          path="/"
          element={
            user ? (
              hasVisited ? (
                <MainLayout />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : hasVisited ? (
              <Navigate to="/login" replace />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        >
          {/* Protected Routes (only accessible if user is authenticated and hasVisited) */}
          {user && hasVisited && (
            <>
              <Route index element={<Home />} />
              <Route path="reports" element={<Reports />} />
              <Route path="bar-graphs" element={<BarGraphScreen />} />
              <Route path="recurring-expenses" element={<RecurringExpenses />} />
              <Route path="expensecategory" element={<ExpenseCategory />} />
              <Route path="search" element={<Search />} />
              <Route path="profile" element={<ProfileMain />} />
              <Route path="setbudget" element={<SetBudget />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="exportdata" element={<ExportData />} />
              <Route path="help" element={<HelpPage />} />
            </>
          )}
        </Route>

        {/* Fallback for unmatched routes */}
        <Route
          path="*"
          element={
            user && hasVisited ? (
              <div className="text-center text-2xl p-10">404 - Page Not Found</div>
            ) : hasVisited ? (
              <Navigate to="/login" replace />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;