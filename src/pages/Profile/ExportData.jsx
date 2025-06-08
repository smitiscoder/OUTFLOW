import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaArrowLeft } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportData() {
  const navigate = useNavigate();
  const [userExpenses, setUserExpenses] = useState([]);
  const auth = getAuth();
  const db = getFirestore();

  // Reset scroll position to top on page load
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []); // Empty dependency array ensures this runs only on mount

  // Fetch real-time user expenses from Firestore
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(db, "expenses"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserExpenses(expenses);
    });

    return () => unsubscribe();
  }, []);

  const handleExport = () => {
    if (userExpenses.length === 0) {
      alert("No expenses to export.");
      return;
    }

    try {
      // Initialize PDF with better font support
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        hotfixes: ["px_scaling"],
      });

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text("Expense Report", 14, 20);

      // Convert all timestamps to Date objects and sort by newest first
      const sortedExpenses = userExpenses
        .map((expense) => {
          let date;
          if (expense.timestamp && typeof expense.timestamp.toDate === "function") {
            date = expense.timestamp.toDate();
          } else if (expense.timestamp) {
            date = new Date(expense.timestamp);
          } else {
            date = new Date(0); // Fallback for missing dates
          }
          return { ...expense, date };
        })
        .sort((a, b) => b.date - a.date); // Newest first

      // Group expenses by month and year
      const expensesByMonth = {};
      sortedExpenses.forEach((expense) => {
        const monthYear = expense.date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
        if (!expensesByMonth[monthYear]) {
          expensesByMonth[monthYear] = [];
        }
        expensesByMonth[monthYear].push(expense);
      });

      // Sort months in descending order (newest first)
      const sortedMonths = Object.keys(expensesByMonth).sort((a, b) => {
        return new Date(b + " 1") - new Date(a + " 1");
      });

      let startY = 30; // Initial Y position after title

      // Generate tables for each month
      sortedMonths.forEach((monthYear) => {
        // Month title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(60);
        doc.text(monthYear, 14, startY);
        startY += 8; // Space between header and table

        // Prepare table data for this month
        const tableData = expensesByMonth[monthYear].map((expense) => [
          expense.date.toLocaleDateString("en-IN"),
          expense.category || "-",
          `Rs. ${Math.round(expense.amount) || 0}`,
          expense.note || "-",
        ]);

        // Add table for this month
        autoTable(doc, {
          startY: startY,
          head: [["Date", "Category", "Amount", "Note"]],
          headStyles: {
            fillColor: [50, 50, 50],
            textColor: 255,
            fontStyle: "bold",
            fontSize: 10,
          },
          body: tableData,
          margin: { top: 5, bottom: 5 },
          styles: {
            font: "helvetica",
            fontSize: 10,
            cellPadding: 3,
            overflow: 'linebreak',
            textColor: [40, 40, 40],
          },
          didDrawPage: (data) => {
            // Update startY for next section
            startY = data.cursor.y + 10;
          },
        });
      });

      // Save PDF
      doc.save("expense-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
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
              <FaArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">Export Data</h1>
          </div>
        </div>
      </div>

      {/* Main Content with proper spacing for fixed header */}
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 md:px-8 pb-20">
        <div className="max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg">
            {/* Icon and Title */}
            <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 mb-8 sm:mb-10">
              <div className="bg-red-500/10 p-4 sm:p-5 rounded-full">
                <FaFilePdf size={48} className="text-red-500 sm:w-16 sm:h-16" />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Export Your Expenses
                </h2>
                <p className="text-[#DFDFDF] text-opacity-80 text-sm sm:text-base max-w-md mx-auto">
                  Download a detailed PDF report of all your expenses, organized by month with category-wise breakdown
                </p>
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-6 sm:space-y-8">
              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={userExpenses.length === 0}
                className={`w-full py-3 sm:py-4 px-6 rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3 ${
                  userExpenses.length === 0
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/20'
                }`}
              >
                <FaFilePdf size={20} className="sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">
                  {userExpenses.length === 0 ? 'No Data to Export' : 'Export as PDF'}
                </span>
              </button>

              {/* Info Box */}
              <div className="rounded-xl p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3 text-[#DFDFDF]">
                  What's included in the export?
                </h3>
                <ul className="space-y-2 text-sm text-[#DFDFDF] text-opacity-80">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span>Monthly expense summaries</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span>Category-wise breakdown</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span>Detailed transaction history</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span>Notes and additional information</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}