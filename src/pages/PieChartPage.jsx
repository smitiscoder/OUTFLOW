import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { useExpenses } from '../ExpenseContext';
import BottomNavbar from '../components/BottomNavbar';

const COLORS = [
  "#D4AF37", "#20B2AA", "#FF6B6B", "#00FA9A",
  "#66BB6A", "#9C27B0", "#03A9F4", "#F4A261",
];

export default function PieChartPage() {
  const { expenses } = useExpenses();

  // Debug log to check expenses
  console.log('Expenses:', expenses);

  if (!expenses || expenses.length === 0) {
    return (
      <div style={{ backgroundColor: "#000", minHeight: "100vh", color: "white" }}>
        <div style={{ paddingTop: "80px", textAlign: "center" }}>
          <p>No expenses data available</p>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  const total = expenses.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "80px", // give space for BottomNavbar
      }}
    >
      <div style={{ position: "relative" }}>
        <PieChart width={350} height={350}>
          <Pie
            data={expenses}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={1}
            dataKey="amount"
            stroke="none"
          >
            {expenses.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>

        {/* Total in center */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          ₹{total}
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
}

