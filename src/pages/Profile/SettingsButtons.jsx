import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Moon, Edit, BellDot } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { ROUTES } from "../../utils/constants";

export default function SettingsButtons({ user, budget, darkMode, setDarkMode, navigate, auth }) {
  return (
    <div className="space-y-4">
      {/* Account Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-[#DFDFDF]">Account</h3>
        <div
          className="flex items-center justify-between bg-[#1A1A1A] rounded-lg p-4 cursor-pointer"
          onClick={() => navigate(ROUTES.UPDATE_EMAIL)}
        >
          <div className="flex items-center space-x-3">
            <Mail size={20} className="text-[#DFDFDF]" />
            <div>
              <div className="text-sm text-[#DFDFDF]">Email</div>
              <div className="text-xs text-[#DFDFDF] text-opacity-60">
                {user?.email || "Not provided"}
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex items-center justify-between bg-[#1A1A1A] rounded-lg p-4 cursor-pointer"
          onClick={() => navigate(ROUTES.UPDATE_PHONE)}
        >
          <div className="flex items-center space-x-3">
            <Phone size={20} className="text-[#DFDFDF]" />
            <div>
              <div className="text-sm text-[#DFDFDF]">Phone Number</div>
              <div className="text-xs text-[#DFDFDF] text-opacity-60">
                {user?.phoneNumber || "Not provided"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-[#DFDFDF]">Preferences</h3>
        <div className="flex items-center justify-between bg-[#1A1A1A] rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Moon size={20} className="text-[#DFDFDF]" />
            <div>
              <div className="text-sm text-[#DFDFDF]">Dark Mode</div>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              darkMode ? "bg-purple-500" : "bg-[#333333]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-[#DFDFDF] transition ${
                darkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <div
          className="flex items-center justify-between bg-[#1A1A1A] rounded-lg p-4 cursor-pointer"
          onClick={() => navigate(ROUTES.SET_BUDGET)}
        >
          <div className="flex items-center space-x-3">
            <Edit size={20} className="text-[#DFDFDF]" />
            <div>
              <div className="text-sm text-[#DFDFDF]">Set Budget</div>
              <div className="text-xs text-[#DFDFDF] text-opacity-60">
                {budget ? `₹${budget.toLocaleString()}` : "Not set"}
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex items-center justify-between bg-[#1A1A1A] rounded-lg p-4 cursor-pointer"
          onClick={() => navigate(ROUTES.NOTIFICATIONS)}
        >
          <div className="flex items-center space-x-3">
            <BellDot size={20} className="text-[#DFDFDF]" />
            <div>
              <div className="text-sm text-[#DFDFDF]">Notifications</div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-[#DFDFDF]">Support</h3>
        <LogoutButton auth={auth} />
      </div>
    </div>
  );
}