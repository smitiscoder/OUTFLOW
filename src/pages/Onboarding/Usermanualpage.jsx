import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft icon from lucide-react

const Usermanualpage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center py-24 bg-[#0D0D0D] text-white relative overflow-hidden">
      {/* Back Button and About Us Text */}
      <div className="absolute top-6 left-6 flex items-center space-x-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-[#1A1A1A]"
        >
          <ArrowLeft size={24} />
        </button>
         <h1 className="text-2xl font-bold">User Manual</h1>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-12">User Manual</h1>

          <div className="space-y-12 text-left">
            {/* 1. Authentication */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">1. Authentication</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Users can log in using:</li>
                <ul className="ml-6 list-disc">
                  <li>Phone Number + OTP</li>
                  <li>Google Sign-in</li>
                  <li>Email and Password (with Sign Up and Forgot Password support)</li>
                </ul>
              </ul>
            </div>

            {/* 2. Home Page */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">2. Home Page</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Calendar to select the month and year of expenses.</li>
                <li>Pie chart shows expense summary of selected month/year (clicking navigates to Reports).</li>
                <li>List of expenses including category icon, note, amount, date, and daily total.</li>
                <li>Tap on an expense card to edit or delete the record.</li>
              </ul>
            </div>

            {/* 3. Bottom Navigation Bar */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">3. Bottom Navigation Bar</h2>
              <p className="mb-2">Available across all pages. It contains:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Home</li>
                <li>Reports</li>
                <li>+ Add Expense</li>
                <li>Search</li>
                <li>Profile / Settings</li>
              </ul>
            </div>

            {/* 4. Reports Page */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">4. Reports Page</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Pie Chart showing category-wise expense distribution.</li>
                <li>Filters: Week, Month, Quarter, Year — updates the chart and stats accordingly.</li>
                <li>Top 4 expenses shown clearly, all others grouped as “Others”.</li>
                <li>Summary includes:
                  <ul className="ml-6 list-disc">
                    <li>Total Spend</li>
                    <li>Highest Spending Category</li>
                    <li>Average Daily Spend</li>
                  </ul>
                </li>
                <li>Bar Graph View:
                  <ul className="ml-6 list-disc">
                    <li>Stacked bars showing Budget and Actual Expense.</li>
                  </ul>
                </li>
                <li>Recurring Expenses View:
                  <ul className="ml-6 list-disc">
                    <li>List of repeating monthly expenses.</li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* 5. Add Expense */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">5. Add Expense</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Choose from 24 categories (including “Others”) in a 6x4 grid layout.</li>
                <li>Custom Numeric Keyboard opens after category selection:</li>
                <ul className="ml-6 list-disc">
                  <li>Keys: 0–9, backspace, ".", "+", and "−".</li>
                  <li>Note field (mandatory) to describe the expense.</li>
                  <li>Submit button to finalize and save the record.</li>
                </ul>
              </ul>
            </div>

            {/* 6. Search Feature */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">6. Search Feature</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Search by Date, Amount, Category, or Note.</li>
                <li>Examples for date search:
                  <ul className="ml-6 list-disc">
                    <li>“Apr” — all April expenses</li>
                    <li>“Apr 27”, “April 27”, or “27 April” — specific date expenses</li>
                  </ul>
                </li>
                <li>“X” button clears the search bar instantly.</li>
              </ul>
            </div>

            {/* 7. Profile / Settings */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">7. Profile / Settings</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Displays profile picture and name (editable).</li>
                <li>Change name from default “username”.</li>
                <li>Set monthly budget (used in bar graph on Reports page).</li>
                <li>Export data to a downloadable PDF file.</li>
                <li>Logout button redirects to Sign-In screen.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Usermanualpage;