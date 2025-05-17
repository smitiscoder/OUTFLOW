import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Loader Component
import Loader from "./components/Loading"; // Updated path (adjust to "./components/Loading" if needed)

<<<<<<< HEAD
// Optional Splash Screen Route (uncomment if needed)
// import SplashScreen from "./components/SplashScreen";
=======
// Public Pages
import Login from "./pages/Login/login";
import Phone from "./pages/Login/Phone";
import EmailLogin from "./pages/Login/EmailLogin";
import ContinueWithGoogle from "./pages/Login/ContinuewithGoogle";
import ForgotPassword from "./pages/Login/ForgotPassword";
import EmailSignup from "./pages/Login/EmailSignup";
import OnBoarding from "./pages/Onboarding/OnBoarding";
>>>>>>> bb93636 (add new onboarding page , change the button color,modify the graph ui)

// Layout (Lazy-loaded)
const MainLayout = lazy(() => import("./components/layout/MainLayout"));

// Public Pages (Lazy-loaded)
const Login = lazy(() => import("./pages/Login/login"));
const Phone = lazy(() => import("./pages/Login/Phone"));
const EmailLogin = lazy(() => import("./pages/Login/EmailLogin"));
const ContinueWithGoogle = lazy(() => import("./pages/Login/ContinuewithGoogle"));
const ForgotPassword = lazy(() => import("./pages/Login/ForgotPassword"));
const EmailSignup = lazy(() => import("./pages/Login/EmailSignup"));
const OnBoarding = lazy(() => import("./pages/OnBoarding"));

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
const UpdateEmail = lazy(() => import("./pages/Profile/UpdateEmail"));
const UpdatePhone = lazy(() => import("./pages/Profile/Phonenumberupadte"));
const ExportData = lazy(() => import("./pages/Profile/ExportData"));

function AppRoutes({ user, isAuthLoading }) {
  // Show Loader while authentication state is loading
  if (isAuthLoading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Optional Splash Screen Route (uncomment if needed) */}
        {/* <Route path="/splash" element={<SplashScreen />} /> */}

        {/* Public Routes */}
        <Route path="/onboarding" element={<OnBoarding />} />
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

        {/* Redirect /home to root */}
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Protected Routes */}
        {user ? (
          <>
            {/* Main layout with nested routes */}
            <Route path="/" element={<MainLayout />}>
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
    </Suspense>
  );
}

export default AppRoutes;
