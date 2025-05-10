import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { ROUTES } from "../../utils/constants";

export default function LogoutButton({ auth }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div
      className="flex items-center justify-between bg-[#1A1A1A] rounded-lg p-4 cursor-pointer"
      onClick={handleLogout}
    >
      <div className="flex items-center space-x-3">
        <LogOut size={20} color="red" />
        <div className="text-sm text-red-500">Log Out</div>
      </div>
    </div>
  );
}