import React, { useState } from "react";
import { useExpenses } from "../Context/ExpenseContext";
import { ShoppingCart, Utensils, Bus, Shirt, Gift, Heart, Ticket, Search as SearchIcon, Phone, Mic, BookOpen, Scissors, Dumbbell, Users, Car, Smartphone, Plane, Stethoscope, Dog, Wrench, Home, Cookie, Baby, Salad, Apple } from "lucide-react"; // Add missing icons here
import { format } from "date-fns";

const getIconForCategory = (category) => {
  const key = category?.toLowerCase();
  const categoryIcons = {
    shopping: <ShoppingCart className="w-5 h-5" />,
    food: <Utensils className="w-5 h-5" />,
    phone: <Phone className="w-5 h-5" />,
    entertainment: <Mic className="w-5 h-5" />,
    education: <BookOpen className="w-5 h-5" />,
    beauty: <Scissors className="w-5 h-5" />,
    sports: <Dumbbell className="w-5 h-5" />,
    social: <Users className="w-5 h-5" />,
    transportation: <Bus className="w-5 h-5" />,
    clothing: <Shirt className="w-5 h-5" />,
    car: <Car className="w-5 h-5" />,
    electronics: <Smartphone className="w-5 h-5" />,
    travel: <Plane className="w-5 h-5" />,
    health: <Stethoscope className="w-5 h-5" />,
    pets: <Dog className="w-5 h-5" />,
    repairs: <Wrench className="w-5 h-5" />,
    housing: <Home className="w-5 h-5" />,
    gifts: <Gift className="w-5 h-5" />,
    donations: <Heart className="w-5 h-5" />,
    lottery: <Ticket className="w-5 h-5" />,
    snacks: <Cookie className="w-5 h-5" />,
    kids: <Baby className="w-5 h-5" />,
    vegetables: <Salad className="w-5 h-5" />,
    fruits: <Apple className="w-5 h-5" />,
  };
  return categoryIcons[key] || <Gift className="w-5 h-5" />;
};

const Search = () => {
  const { expenses } = useExpenses();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExpenses = expenses.filter((expense) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return false;

    const timestamp = expense.timestamp?.toDate ? expense.timestamp.toDate() : expense.timestamp;

    // Amount match
    const amountAsNumber = parseFloat(query);
    if (!isNaN(amountAsNumber)) {
      if (expense.amount === amountAsNumber) {
        return true;
      }
    }

    // Date matching (short month, full month, different formats)
    const dateFormats = [
      format(timestamp, 'MMM d'),      // Jan 12
      format(timestamp, 'MMMM d'),     // January 12
      format(timestamp, 'd MMM'),      // 12 Jan
      format(timestamp, 'd MMMM'),     // 12 January
      format(timestamp, 'MM/dd'),      // 01/12
      format(timestamp, 'yyyy-MM-dd')  // 2023-01-12
    ];

    if (dateFormats.some(dateStr => dateStr.toLowerCase().includes(query))) {
      return true;
    }

    // Note or Category match
    const noteMatch = expense.note?.toLowerCase().includes(query);
    const categoryMatch = expense.category?.toLowerCase().includes(query);

    return noteMatch || categoryMatch;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      <div className="max-w-md mx-auto px-4">
        <header className="py-4">
          <h2 className="text-2xl font-bold">Search Expenses</h2>

          {/* Search Input with Icon */}
          <div className="relative mt-4">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full rounded-full bg-gray-800 pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Search by amount, note, category, or date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="mt-4">
          {searchTerm && filteredExpenses.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              No matching expenses found.
            </p>
          )}

          {filteredExpenses.map((expense) => {
            const timestamp = expense.timestamp?.toDate ? expense.timestamp.toDate() : expense.timestamp;

            return (
              <div
                key={expense.id}
                className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-lg shadow mb-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
                    {getIconForCategory(expense.category)}
                  </div>
                  <div>
                    <p className="text-white font-medium capitalize">{expense.category}</p>
                    {expense.note && (
                      <p className="text-gray-400 text-sm">{expense.note}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold whitespace-nowrap">
                    ₹{Math.round(expense.amount)}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {format(timestamp, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Search;





