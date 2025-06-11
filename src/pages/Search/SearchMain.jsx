import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { Search as SearchIcon, X, ArrowLeft } from "lucide-react";
import { format, parse, parseISO } from "date-fns";
import getIconForCategory from "./AllIcons";
import filterExpenses from "./DataFilteration";
import { useNavigate } from "react-router-dom";

export default function SearchMain() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userExpenses, setUserExpenses] = useState([]);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  // Fetch user expenses from Firestore
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(
      collection(db, "expenses"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserExpenses(expenses);
    });

    return () => unsubscribe();
  }, []);

  // Filter and sort expenses using the updated filterExpenses function
  const filteredExpenses = filterExpenses(userExpenses, searchTerm);

  // Clear search input
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
      <div className="container mx-auto px-4 max-w-md relative">
        {/* Header with consistent styling */}
        <header className="py-4 flex items-center justify-between mt-6">
          <h1 className="text-2xl font-bold">Search Expenses</h1>
        </header>

        {/* Search Input with responsive sizing */}
        <div className="relative mt-4 sm:mt-6 mb-6 sm:mb-8">
          <SearchIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#DFDFDF] text-opacity-60 w-4 sm:w-5 h-4 sm:h-5" />
          <input
            type="text"
            className="w-full rounded-full bg-[#1A1A1A] pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 text-[#DFDFDF] placeholder-[#DFDFDF] placeholder-opacity-60 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search by amount, note, category, or date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-[#DFDFDF] text-opacity-60 hover:text-opacity-100"
            >
              <X className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          )}
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="bg-[#1A1A1A] rounded-xl p-4 sm:p-6">
            {filteredExpenses.length === 0 ? (
              <p className="text-center text-[#DFDFDF] text-opacity-60 py-4 sm:py-6 text-sm sm:text-base">
                No matching expenses found.
              </p>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {filteredExpenses.map((expense) => {
                  let timestamp;
                  try {
                    if (expense.timestamp?.toDate) {
                      timestamp = expense.timestamp.toDate();
                    } else if (typeof expense.timestamp === "string") {
                      const parsed = parseISO(expense.timestamp) || 
                        parse(expense.timestamp, "dd/MM/yyyy", new Date()) ||
                        parse(expense.timestamp, "yyyy-MM-dd", new Date()) ||
                        parse(expense.timestamp, "dd-MM-yyyy", new Date());
                      timestamp = isNaN(parsed) ? null : parsed;
                    } else {
                      timestamp = expense.timestamp;
                    }

                    if (!(timestamp instanceof Date) || isNaN(timestamp)) {
                      timestamp = null;
                    }
                  } catch (error) {
                    timestamp = null;
                  }

                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-[#0D0D0D] hover:bg-[#252525] transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center">
                          {getIconForCategory(expense.category)}
                        </div>
                        <div>
                          <p className="text-sm sm:text-base text-[#DFDFDF] font-medium capitalize">
                            {expense.category}
                          </p>
                          {expense.note && (
                            <p className="text-xs sm:text-sm text-[#DFDFDF] text-opacity-60">
                              {expense.note}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm sm:text-base text-[#DFDFDF] font-semibold whitespace-nowrap">
                          ₹{Math.round(expense.amount)}
                        </p>
                        <p className="text-xs text-[#DFDFDF] text-opacity-60">
                          {timestamp ? format(timestamp, "MMM d, yyyy") : "Date N/A"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}