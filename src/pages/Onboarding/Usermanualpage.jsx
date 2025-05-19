import React, { useEffect, useState } from "react";
import { Smartphone, Laptop, ChevronRight } from "lucide-react";

const Usermanualpage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center py-24 bg-[#020106] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-8">User Manual</h1>

          <div className="space-y-12">
            {/* 1. Getting Started */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">1. Getting Started</h2>
              <ul className="space-y-4">
                <li>
                  <strong>Login & Sign-in Options</strong>
                  <ul className="ml-6 list-disc">
                    <li>Phone Number + OTP</li>
                    <li>Google Sign-in</li>
                    <li>Email & Password</li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* 2. Home Page */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">2. Home Page</h2>
              <ul className="space-y-4">
                <li>Calendar - View expenses for specific months/years.</li>
                <li>Pie Chart - Visual summary of expenses.</li>
                <li>Expense List - Detailed view of expenses.</li>
              </ul>
            </div>

            {/* 3. Bottom Navigation Bar */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">3. Bottom Navigation Bar</h2>
              <ul className="space-y-4">
                <li>Home, Reports, Add Expense, Search, Profile/Settings</li>
              </ul>
            </div>

            {/* 4. Reports Page */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">4. Reports Page</h2>
              <ul className="space-y-4">
                <li>Pie Chart - Expense distribution by category.</li>
                <li>Top 5 Expenses - Shows major expense categories.</li>
                <li>Summary Section - Includes Total Spend, Highest Category, Avg Daily Spend.</li>
                <li>Bar Graph - Compares Budget vs Actual Expenses.</li>
                <li>Recurring - Displays recurring expenses.</li>
              </ul>
            </div>

            {/* 5. Add Expense */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">5. Add Expense</h2>
              <ul className="space-y-4">
                <li>Category Selection - 24 categories available.</li>
                <li>Expense Entry - Enter amount, note, and submit.</li>
              </ul>
            </div>

            {/* 6. Search Feature */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">6. Search Feature</h2>
              <ul className="space-y-4">
                <li>Search by Date, Amount, Category, or Note.</li>
                <li>Tap “X” to clear search input.</li>
              </ul>
            </div>

            {/* 7. Profile/Settings */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">7. Profile/Settings</h2>
              <ul className="space-y-4">
                <li>Edit Profile - Change username and profile picture.</li>
                <li>Set Budget - Adjust monthly budget.</li>
                <li>Export Options - Export data as PDF.</li>
                <li>Logout - Exit the app.</li>
              </ul>
            </div>

            {/* 8. Data Security & Performance */}
            <div className="bg-black p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">8. Data Security & Performance</h2>
              <p>
                Our app ensures data encryption and optimized performance to safeguard your financial data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Usermanualpage;
