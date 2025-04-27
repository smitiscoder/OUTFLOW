import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/login";
import MainLayout from "./components/layout/MainLayout";
import Phone from "./components/Phone";
import ContinueWithGoogle from "./components/ContinuewithGoogle";
import Login from "./components/login";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Reports from "./pages/Reports";
import ExpenseCategory from "./pages/ExpenseCategory";
import ProfilePage from "./pages/ProfilePage";
import Onboarding from "./pages/Onboarding";

function AppRoutes({ user }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/phone" element={user ? <Navigate to="/" /> : <Phone />} />
      <Route path="/continuewithgoogle" element={user ? <Navigate to="/" /> : <ContinueWithGoogle />} />

      {/* Protected Routes */}
      {user ? (
        <Route path="/" element={<MainLayout />}>  {/* MainLayout wraps all protected routes */}
          <Route index element={<Home />} />  {/* This is the default route */}
          <Route path="reports" element={<Reports />} />
          <Route path="ExpenseCategory" element={<ExpenseCategory />} />
          <Route path="search" element={<Search />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}

      {/* Fallback for wrong URLs */}
      {!user && (
        <Route path="*" element={<div className="text-center text-2xl p-10">404 - Page Not Found</div>} />
      )}
    </Routes>
  );
}

export default AppRoutes;


