import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../components/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FiArrowLeft } from "react-icons/fi";

export default function SetBudget() {
  const [budget, setBudget] = useState("");
  const [currentBudget, setCurrentBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [applyToAllMonths, setApplyToAllMonths] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  // Get current month name and year
  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const budgetDocId = `${user?.uid}_${currentYear}_${currentDate.getMonth() + 1}`;

  useEffect(() => {
    const fetchBudget = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "budgets", budgetDocId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBudget(docSnap.data().amount);
          setCurrentBudget(docSnap.data().amount);
        } else {
          setCurrentBudget(null);
        }
      } catch (err) {
        console.error("Error fetching budget:", err);
      }
    };

    fetchBudget();
  }, [user, budgetDocId]);

  const handleSaveBudget = async () => {
    if (!user || !budget) return;

    setLoading(true);
    try {
      await setDoc(doc(db, "budgets", budgetDocId), {
        amount: Number(budget),
        updatedAt: new Date(),
        month: currentDate.getMonth() + 1,
        year: currentYear,
      });

      if (applyToAllMonths) {
        for (let i = 1; i <= 12; i++) {
          const futureDate = new Date();
          futureDate.setMonth(currentDate.getMonth() + i);
          const futureMonth = futureDate.getMonth() + 1;
          const futureYear = futureDate.getFullYear();
          const futureDocId = `${user.uid}_${futureYear}_${futureMonth}`;
          
          await setDoc(doc(db, "budgets", futureDocId), {
            amount: Number(budget),
            updatedAt: new Date(),
            month: futureMonth,
            year: futureYear,
            isRecurring: true
          });
        }
      }

      setCurrentBudget(Number(budget));
      navigate("/");
    } catch (err) {
      console.error("Error saving budget:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBudget = async () => {
    if (!user) return;

    setRemoveLoading(true);
    try {
      await deleteDoc(doc(db, "budgets", budgetDocId));
      setBudget("");
      setCurrentBudget(null);
      navigate("/");
    } catch (err) {
      console.error("Error removing budget:", err);
    } finally {
      setRemoveLoading(false);
    }
  };

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
              <FiArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">Set Budget</h1>
          </div>
        </div>
      </div>

      {/* Main Content with proper spacing for fixed header */}
      <div className="pt-24 sm:pt-28 px-4 sm:px-6 md:px-8 pb-20">
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
          <div className="flex flex-col items-center">
            {/* Month Display */}
            <div className="w-full max-w-md text-center mb-4">
              <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 mb-2">
                {currentMonthName}
              </h2>
              <p className="text-[#DFDFDF] text-opacity-60 text-lg">
                {currentYear}
              </p>
            </div>

            {/* Budget Input Card */}
            <div className="w-full max-w-md">
              {/* Current Budget Display */}
              {currentBudget && (
                <div className="mb-8 text-center">
                  <p className="text-[#DFDFDF] text-opacity-60 text-sm mb-1">Current Budget</p>
                  <p className="text-2xl font-semibold">₹{currentBudget.toLocaleString()}</p>
                </div>
              )}

              {/* Input Section */}
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DFDFDF] text-opacity-60 text-lg">₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter new budget amount"
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-[#1A1A1A] border border-[#333333] text-white text-lg placeholder-[#DFDFDF] placeholder-opacity-40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Apply to All Months Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1A1A1A] border border-[#333333] mb-6">
                <div className="flex items-center">
                  <label htmlFor="applyToAll" className="text-[#DFDFDF] text-opacity-80 text-sm cursor-pointer">
                    Apply to all future months
                  </label>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={applyToAllMonths}
                  onClick={() => setApplyToAllMonths(!applyToAllMonths)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ease-in-out ${
                    applyToAllMonths ? 'bg-purple-600' : 'bg-[#333333]'
                  }`}
                >
                  <span
                    className={`${
                      applyToAllMonths ? 'translate-x-5' : 'translate-x-1'
                    } inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleSaveBudget}
                  disabled={loading || !budget}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    loading || !budget
                      ? "bg-[#333333] text-[#DFDFDF] text-opacity-40 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/20"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Budget"
                  )}
                </button>
                
                {currentBudget !== null && (
                  <button
                    onClick={handleRemoveBudget}
                    disabled={removeLoading}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      removeLoading
                        ? "bg-[#333333] text-[#DFDFDF] text-opacity-40 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-500/20"
                    }`}
                  >
                    {removeLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Removing...
                      </span>
                    ) : (
                      "Remove Budget"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}