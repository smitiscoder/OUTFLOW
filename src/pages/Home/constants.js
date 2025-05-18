import {
  ShoppingCart, Utensils, FileText, Mic, Stethoscope, Users, Bus, Scissors, Car, BookOpen,
  TrendingUp, Gift, Plane, Shield, Dog, CreditCard, Pen, Wrench, Smartphone, Baby, Cookie, Apple, Salad, Banknote, Trash2
} from 'lucide-react';

const COLORS = [
  ["#8B5CF6", "#6D28D9"], // Purple gradient
  ["#EC4899", "#BE185D"], // Pink gradient
  ["#3B82F6", "#1D4ED8"], // Blue gradient
  ["#10B981", "#047857"], // Green gradient
  ["#F59E0B", "#B45309"], // Amber gradient
  ["#6366F1", "#4338CA"], // Indigo gradient
  ["#14B8A6", "#0F766E"], // Teal gradient
  ["#F472B6", "#BE185D"]  // Pink gradient
];

const categoryIcons = {
  shopping: <ShoppingCart className="w-5 h-5" />,
  food: <Utensils className="w-5 h-5" />,
  grocery: <Salad className="w-5 h-5" />,
  bills: <FileText className="w-5 h-5" />,
  entertainment: <Mic className="w-5 h-5" />,
  health: <Stethoscope className="w-5 h-5" />,
  social: <Users className="w-5 h-5" />,
  transportation: <Bus className="w-5 h-5" />,
  beauty: <Scissors className="w-5 h-5" />,
  vehicle: <Car className="w-5 h-5" />,
  education: <BookOpen className="w-5 h-5" />,
  investment: <TrendingUp className="w-5 h-5" />,
  housing_repair: <Wrench className="w-5 h-5" />,
  gifts_donations: <Gift className="w-5 h-5" />,
  travel: <Plane className="w-5 h-5" />,
  insurance: <Shield className="w-5 h-5" />,
  subscriptions: <CreditCard className="w-5 h-5" />,
  pets: <Dog className="w-5 h-5" />,
  emi_loans: <Banknote className="w-5 h-5" />,
  electronics: <Smartphone className="w-5 h-5" />,
  kids: <Baby className="w-5 h-5" />,
  snacks: <Cookie className="w-5 h-5" />,
  fruits: <Apple className="w-5 h-5" />,
  others: <Pen className="w-5 h-5" />,
};

const getIconForCategory = (category) => {
  const key = category?.toLowerCase();
  return categoryIcons[key] || <Gift className="w-5 h-5" />;
};

export { COLORS, categoryIcons, getIconForCategory };
