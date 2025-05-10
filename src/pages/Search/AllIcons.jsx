import {
  ShoppingCart, Utensils, FileText, Mic, Stethoscope, Users,
  Bus, Scissors, Car, BookOpen, TrendingUp, Wrench, Gift, Plane,
  Shield, CreditCard, Dog, Pen, Smartphone, Baby, Cookie, Apple,
  Salad, Banknote
} from "lucide-react";

const getIconForCategory = (category) => {
  const key = category?.toLowerCase();
  const icons = {
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

  return icons[key] || icons['others'];
};

export default getIconForCategory;
