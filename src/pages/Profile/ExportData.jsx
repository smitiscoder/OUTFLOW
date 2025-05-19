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
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-[#1A1A1A] mr-2"
        >
          <FaArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Export Data</h1>
      </div>

      {/* Content area */}
      <div className="flex flex-col items-center justify-start space-y-8 flex-1 max-w-md mx-auto w-full">
        <FaFilePdf size={64} className="text-red-500" />
        
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Export Your Expenses</h2>
          <p className="text-[#DFDFDF] text-opacity-80">
            Download a PDF report of all your expenses, organized by month
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full">
          <button
            onClick={handleExport}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-[#333333] hover:bg-[#444444] text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}