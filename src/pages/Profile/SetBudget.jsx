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
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 md:px-8 pb-20">
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
          <div className="flex justify-center items-center">
            <div className="w-full max-w-md space-y-6">
              <h2 className="text-2xl font-bold">Set Your Monthly Budget</h2>
              <p className="text-gray-400">
                {currentMonthName} {currentYear}
              </p>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter budget amount"
                className="w-full p-3 rounded bg-[#1A1A1A] border border-[#333333] text-white"
              />
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="applyToAll"
                  checked={applyToAllMonths}
                  onChange={(e) => setApplyToAllMonths(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="applyToAll" className="text-sm text-gray-300">
                  Apply to all future months
                </label>
              </div>
              
              <button
                onClick={handleSaveBudget}
                disabled={loading || !budget}
                className={`w-full py-2 rounded font-semibold ${
                  loading || !budget
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-500"
                }`}
              >
                {loading ? "Saving..." : "Save Budget"}
              </button>
              
              {currentBudget !== null && (
                <button
                  onClick={handleRemoveBudget}
                  disabled={removeLoading}
                  className={`w-full py-2 rounded font-semibold ${
                    removeLoading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-500"
                  }`}
                >
                  {removeLoading ? "Removing..." : "Remove Budget"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}