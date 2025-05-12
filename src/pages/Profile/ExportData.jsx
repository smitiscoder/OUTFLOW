import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa6";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportData() {
  const navigate = useNavigate();
  const [userExpenses, setUserExpenses] = useState([]);
  const auth = getAuth();
  const db = getFirestore();

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
        hotfixes: ["px_scaling"] // Fixes font scaling issues
      });

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text("Expense Report", 14, 20);

      // Convert all timestamps to Date objects and sort by newest first
      const sortedExpenses = userExpenses
        .map(expense => {
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

      // Generate tables for each month on the same page
      sortedMonths.forEach((monthYear) => {
        // Month title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(60);
        doc.text(monthYear, 14, startY);
        startY += 8; // Space between header and table

        // Prepare table data for this month (already sorted by date)
        const tableData = expensesByMonth[monthYear].map((expense) => {
          return [
            expense.date.toLocaleDateString("en-IN"),
            expense.category || "-",
            `Rs. ${Math.round(expense.amount) || 0}`, // Changed from ₹ to Rs.
            expense.note || "-",
          ];
        });

        // Add table for this month
        autoTable(doc, {
          startY: startY,
          head: [["Date", "Category", "Amount", "Note"]],
          headStyles: {
            fillColor: [50, 50, 50],
            textColor: 255,
            fontStyle: "bold",
            fontSize: 10
          },
          body: tableData,
          margin: { top: 5, bottom: 5 },
          styles: {
            font: "helvetica",
            fontSize: 10,
            cellPadding: 3,
            overflow: 'linebreak',
            textColor: [40, 40, 40]
          },
          didDrawPage: (data) => {
            // Update startY for next section
            startY = data.cursor.y + 10;
          }
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
    <div className="min-h-screen bg-[#121212] text-[#DFDFDF] p-6">
      <div className="max-w-md mx-auto bg-[#1A1A1A] rounded-lg p-6 shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          <FaFilePdf size={48} className="text-red-500" />
          <h2 className="text-2xl font-bold text-center">Export Your Data</h2>
          <p className="text-center text-[#DFDFDF] text-opacity-80">
            Do you want to download your data as PDF?
          </p>

          <div className="flex space-x-4 w-full justify-center">
            <button
              onClick={handleExport}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>Yes</span>
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-[#333333] hover:bg-[#444444] text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}