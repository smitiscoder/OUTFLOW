import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { RoundButton } from "../components/ui/roundbutton";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { CalendarDays, Check, Delete, Plus, Minus, ShoppingCart, Utensils, Smartphone, Music, BookOpen, Heart, Dumbbell, Users, Bus, Shirt, Car, Wine, Activity, Monitor, Plane, HeartPulse, Dog, Wrench, Home, Sofa, Gift, HandHeart, BadgeDollarSign, CupSoda, Baby, Salad, Grape } from "lucide-react";

const categories = [
  { name: "Shopping", icon: <ShoppingCart size={16} /> },
  { name: "Food", icon: <Utensils size={16} /> },
  { name: "Phone", icon: <Smartphone size={16} /> },
  { name: "Entertainment", icon: <Music size={16} /> },
  { name: "Education", icon: <BookOpen size={16} /> },
  { name: "Beauty", icon: <Heart size={16} /> },
  { name: "Sports", icon: <Dumbbell size={16} /> },
  { name: "Social", icon: <Users size={16} /> },
  { name: "Transportation", icon: <Bus size={16} /> },
  { name: "Clothing", icon: <Shirt size={16} /> },
  { name: "Car", icon: <Car size={16} /> },
  { name: "Alcohol", icon: <Wine size={16} /> },
  { name: "Cigarettes", icon: <Activity size={16} /> },
  { name: "Electronics", icon: <Monitor size={16} /> },
  { name: "Travel", icon: <Plane size={16} /> },
  { name: "Health", icon: <HeartPulse size={16} /> },
  { name: "Pets", icon: <Dog size={16} /> },
  { name: "Repairs", icon: <Wrench size={16} /> },
  { name: "Housing", icon: <Home size={16} /> },
  { name: "Home", icon: <Sofa size={16} /> },
  { name: "Gifts", icon: <Gift size={16} /> },
  { name: "Donations", icon: <HandHeart size={16} /> },
  { name: "Lottery", icon: <BadgeDollarSign size={16} /> },
  { name: "Snacks", icon: <CupSoda size={16} /> },
  { name: "Kids", icon: <Baby size={16} /> },
  { name: "Vegetables", icon: <Salad size={16} /> },
  { name: "Fruits", icon: <Grape size={16} /> },
];

export default function ExpenseKeyboardPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState("expense");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleNumberClick = (num) => {
    setAmount((prev) => parseFloat(prev.toString() + num.toString()));
  };

  const handleClear = () => {
    setAmount(0);
  };

  return (
    <div className="p-4 space-y-4 max-w-sm mx-auto bg-gray-900 text-white min-h-screen">
      <h1 className="text-xl font-bold text-center">Select Type</h1>
      <div className="flex justify-center gap-4">
        <RoundButton
          onClick={() => setType("income")}
          className={`px-4 py-2 rounded-full ${
            type === "income" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          <Plus size={16} className="mr-1" /> Income
        </RoundButton>
        <RoundButton
          onClick={() => setType("expense")}
          className={`px-4 py-2 rounded-full ${
            type === "expense" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          <Minus size={16} className="mr-1" /> Expense
        </RoundButton>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {categories.map((cat) => (
          <button
           
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 p-2 text-xs font-semibold ${
              selectedCategory === cat.name ? "border-yellow-500 bg-yellow-800" : "border-gray-700 bg-gray-800"
            }`}
          >
            {cat.icon}
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent text-[10px] text-center leading-tight">
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Enter a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="bg-gray-800 text-white placeholder-gray-400 border-gray-700"
        />
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-700 bg-gray-800 text-white p-2 rounded w-full"
          />
          <CalendarDays />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
          <RoundButton key={num} onClick={() => handleNumberClick(num)} className="bg-gray-700 hover:bg-gray-600 text-white">{num}</RoundButton>
        ))}
        <RoundButton onClick={() => handleNumberClick('.')} className="bg-gray-700 hover:bg-gray-600 text-white">.</RoundButton>
        < RoundButton onClick={() => handleNumberClick(0)} className="bg-gray-700 hover:bg-gray-600 text-white">0</RoundButton>
        <RoundButton onClick={handleClear} className="bg-red-600 hover:bg-red-700 text-white"><Delete size={18} /></RoundButton>
      </div>

      <div className="flex justify-end">
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black"><Check /> Save</Button>
      </div>
    </div>
  );
}
