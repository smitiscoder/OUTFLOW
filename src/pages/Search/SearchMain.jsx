import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { Search as SearchIcon, X } from "lucide-react";
import { format, parse, parseISO } from "date-fns";
import getIconForCategory from "./AllIcons";
import filterExpenses from "./DataFilteration";

const SearchMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userExpenses, setUserExpenses] = useState([]);
  const auth = getAuth();
  const db = getFirestore();

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
      <Header title="Search Expenses" />

      <div className="container mx-auto px-4 pb-20 max-w-md">
        {/* Search Input */}
        <div className="relative mt-6 mb-6">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#DFDFDF] text-opacity-60 w-5 h-5" />
          <input
            type="text"
            className="w-full rounded-full bg-[#1A1A1A] pl-12 pr-10 py-3 text-[#DFDFDF] placeholder-[#DFDFDF] placeholder-opacity-60 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search by amount, note, category, or date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#DFDFDF] text-opacity-60 hover:text-opacity-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="bg-[#1A1A1A] rounded-xl p-6">
          {searchTerm && filteredExpenses.length === 0 ? (
            <p className="text-center text-[#DFDFDF] text-opacity-60 py-4">
              No matching expenses found.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredExpenses.map((expense) => {
                let timestamp;
                try {
                  // Handle Firestore Timestamp
                  if (expense.timestamp?.toDate) {
                    timestamp = expense.timestamp.toDate();
                  }
                  // Handle string timestamps (e.g., "2025-05-12T05:21:15.127Z")
                  else if (typeof expense.timestamp === "string") {
                    const parsed =
                      parseISO(expense.timestamp) || // ISO 8601
                      parse(expense.timestamp, "dd/MM/yyyy", new Date()) ||
                      parse(expense.timestamp, "yyyy-MM-dd", new Date()) ||
                      parse(expense.timestamp, "dd-MM-yyyy", new Date());
                    timestamp = isNaN(parsed) ? null : parsed;
                  }
                  // Handle JavaScript Date or other cases
                  else {
                    timestamp = expense.timestamp;
                  }

                  // Validate timestamp
                  if (!(timestamp instanceof Date) || isNaN(timestamp)) {
                    timestamp = null; // Invalid date
                  }
                } catch (error) {
                  timestamp = null; // Handle conversion errors
                }

                return (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#0D0D0D]"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        {getIconForCategory(expense.category)}
                      </div>
                      <div>
                        <p className="text-[#DFDFDF] font-medium capitalize">
                          {expense.category}
                        </p>
                        {expense.note && (
                          <p className="text-[#DFDFDF] text-opacity-60 text-sm">
                            {expense.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#DFDFDF] font-semibold whitespace-nowrap">
                        ₹{Math.round(expense.amount)}
                      </p>
                      <p className="text-[#DFDFDF] text-opacity-60 text-xs">
                        {timestamp ? format(timestamp, "MMM d, yyyy") : "Date N/A"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchMain;