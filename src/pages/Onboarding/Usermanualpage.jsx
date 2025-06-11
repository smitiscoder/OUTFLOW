// In src/pages/Onboarding/Usermanualpage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Usermanualpage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      {/* Fixed Header with Back Button */}
      <div className="fixed top-0 left-0 right-0 bg-[#0D0D0D]/95 backdrop-blur-sm z-50 border-b border-[#1A1A1A]">
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="h-16 sm:h-20 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-[#1A1A1A] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">User Manual</h1>
          </div>
        </div>
      </div>

      {/* Main Content with proper spacing for fixed header */}
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 md:px-8 pb-20">
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
          {/* Background (subtle gradient) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_70%)] -z-10" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-full sm:max-w-3xl md:max-w-4xl mx-auto text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-8 sm:mt-12 md:mt-16 mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                User Manual
              </h1>

              <div className="space-y-8 sm:space-y-12 text-left">
                {/* 1. Authentication */}
                <div
                  className={`bg-black p-4 sm:p-6 rounded-xl border border-gray-700 transition-all duration-1000 delay-300 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    1. Getting Started with Authentication
                  </h2>
                  <p className="mb-4 text-sm sm:text-base text-white/80">
                    Log in to Outflow to access your expense tracking features. Follow these steps to sign in or create an account.
                  </p>
                  <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base">
                    <li>
                      <strong>Google Sign-in</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>On the login screen, click the "Continue with Google" button.</li>
                        <li>Select your Google account and confirm permissions.</li>
                        <li>You'll be redirected to the Home page.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Email and Password</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Click "Sign in with Email" on the login screen.</li>
                        <li>Enter your email and password, then click "Log In".</li>
                        <li>
                          To sign up, click "Sign Up", enter your email and password, and follow the verification email instructions.
                        </li>
                        <li>
                          Forgot your password? Click "Forgot Password", enter your email, and follow the reset link sent to your inbox.
                        </li>
                      </ul>
                    </li>
                  </ol>
                  <p className="mt-4 text-xs sm:text-sm text-white/70 italic">
                    Note: Ensure your email is verified for sign-up or password reset. Check your spam folder if emails don't arrive.
                  </p>
                </div>

                {/* 2. Home Page */}
                <div
                  className={`bg-black p-4 sm:p-6 rounded-xl border border-gray-700 transition-all duration-1000 delay-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    2. Navigating the Home Page
                  </h2>
                  <p className="mb-4 text-sm sm:text-base text-white/80">
                    The Home page is your central hub for viewing and managing expenses. Here's how to use it.
                  </p>
                  <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base">
                    <li>
                      <strong>Select a Time Period</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Tap the calendar at the top to choose a month and year.</li>
                        <li>Use the arrows or dropdown to navigate to the desired period.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>View Expense Summary</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Check the pie chart for a visual breakdown of expenses by category.</li>
                        <li>Tap the pie chart to go to the Reports page for more details.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Manage Expenses</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Scroll through the expense list, showing category icons, notes, amounts, dates, and daily totals.</li>
                        <li>Tap an expense card to edit (update note, amount, or category) or delete it.</li>
                        <li>Confirm deletions to avoid accidental removal.</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                {/* 3. Bottom Navigation Bar */}
                <div
                  className={`bg-black p-4 sm:p-6 rounded-xl border border-gray-700 transition-all duration-1000 delay-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    3. Using the Bottom Navigation Bar
                  </h2>
                  <p className="mb-4 text-sm sm:text-base text-white/80">
                    The bottom navigation bar is always available, letting you switch between app features quickly.
                  </p>
                  <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base">
                    <li>Tap "Home" to return to the Home page.</li>
                    <li>Tap "Reports" to view detailed expense analytics.</li>
                    <li>Tap "+ Add Expense" to record a new expense.</li>
                    <li>Tap "Search" to find specific expenses.</li>
                    <li>Tap "Profile / Settings" to manage your account and preferences.</li>
                  </ol>
                  <p className="mt-4 text-xs sm:text-sm text-white/70 italic">
                    Tip: The navigation bar is fixed at the bottom of every screen for easy access.
                  </p>
                </div>

                {/* 4. Reports Page */}
                <div
                  className={`bg-black p-4 sm:p-6 rounded-xl border border-gray-700 transition-all duration-1000 delay-900 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    4. Analyzing Expenses on the Reports Page
                  </h2>
                  <p className="mb-4 text-sm sm:text-base text-white/80">
                    The Reports page helps you understand your spending patterns with charts and summaries.
                  </p>
                  <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base">
                    <li>
                      <strong>View the Pie Chart</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>See category-wise expense distribution for the selected period.</li>
                        <li>The top 4 categories are highlighted; others are grouped as "Others".</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Apply Filters</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Choose Week, Month, Quarter, or Year from the filter menu.</li>
                        <li>The chart and summary update automatically.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Check the Summary</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Review Total Spend, Highest Spending Category, and Average Daily Spend.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Explore Bar Graph View</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Switch to the bar graph to compare Budget vs. Actual Expense.</li>
                        <li>Stacked bars show spending patterns over time.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>View Recurring Expenses</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Check the list of monthly repeating expenses.</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                {/* 5. Add Expense */}
                <div
                  className={`bg-black p-4 sm:p-6 rounded-xl border border-gray-700 transition-all duration-1000 delay-1100 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    5. Adding a New Expense
                  </h2>
                  <p className="mb-4 text-sm sm:text-base text-white/80">
                    Record your expenses quickly using the Add Expense feature.
                  </p>
                  <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base">
                    <li>
                      Tap "+ Add Expense" in the bottom navigation bar.
                    </li>
                    <li>
                      <strong>Select a Category</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Choose from 24 categories (e.g., Food, Travel, Others) in the 6x4 grid.</li>
                        <li>Tap a category to proceed.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Enter Expense Details</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Use the custom numeric keyboard (0–9, backspace, ".", "+", "−") to enter the amount.</li>
                        <li>Type a note in the mandatory Note field to describe the expense (e.g., "Lunch at Cafe").</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Save the Expense</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Click "Submit" to save the record.</li>
                        <li>You'll return to the Home page, with the new expense in the list.</li>
                      </ul>
                    </li>
                  </ol>
                  <p className="mt-4 text-xs sm:text-sm text-white/70 italic">
                    Tip: Double-check the note for clarity, as it helps when searching later.
                  </p>
                </div>

                {/* 6. Search Feature */}
                <div
                  className={`bg-black p-4 sm:p-6 rounded-xl border border-gray-700 transition-all duration-1000 delay-1300 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    6. Searching for Expenses
                  </h2>
                  <p className="mb-4 text-sm sm:text-base text-white/80">
                    Use the Search feature to find specific expenses by date, amount, category, or note.
                  </p>
                  <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base">
                    <li>Tap "Search" in the bottom navigation bar.</li>
                    <li>
                      <strong>Enter Search Terms</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Type a month (e.g., "Apr") to view all April expenses.</li>
                        <li>Type a full date (e.g., "Apr 27") to view expenses from that day.</li>
                        <li>Type a year (e.g., "2025") to view all expenses from that year.</li>
                        <li>Type a year and month together (e.g., "2025 Apr" or "Apr 2025") to view all April 2025 expenses (newest to oldest).</li>
                        <li>Enter an amount (e.g., "50") to find expenses around that amount.</li>
                        <li>Search by category (e.g., "Food") or note (e.g., "Coffee").</li>
                      </ul>
                    </li>
                    <li>
                      <strong>View Results</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Matching expenses appear in a list.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Clear the Search</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Click the "X" button to clear the search bar and reset results.</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                {/* 7. Profile / Settings */}
                <div
                  className={`bg-black p-4 sm:p-6 rounded-xl border border-gray-700 transition-all duration-1000 delay-1500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    7. Managing Your Profile and Settings
                  </h2>
                  <p className="mb-4 text-sm sm:text-base text-white/80">
                    Customize your account and export data in the Profile/Settings section.
                  </p>
                  <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base">
                    <li>
                      Tap "Profile / Settings" in the bottom navigation bar.
                    </li>
                    <li>
                      <strong>Update Profile</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Change your name from the default "username" by editing the Name field.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Set Budget</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Enter a monthly budget to track spending in the Reports page's bar graph.</li>
                        <li>Save changes to update the graph.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Export Data</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Click "Export Data" to download your expenses as a PDF file.</li>
                        <li>Check your Downloads folder for the file.</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Log Out</strong>:
                      <ul className="ml-4 sm:ml-6 list-disc">
                        <li>Click "Logout" to return to the Sign-In screen.</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usermanualpage;