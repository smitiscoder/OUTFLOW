import React from "react";
import { Edit, BellDot, HelpCircle } from "lucide-react";
import { FaFilePdf } from "react-icons/fa6";
import LogoutButton from "./LogoutButton";
import { ROUTES } from "../../utils/constants";

export default function SettingsButtons({ user, budget, navigate, auth }) {
  return (
    <div className="space-y-4">
      {/* Account Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-[#DFDFDF]">Account</h3>

        {/* Export Data */}
        <div
          className="flex items-center justify-between bg-[#1A1A1A] rounded-lg p-4 cursor-pointer"
          onClick={() => navigate(ROUTES.EXPORT_DATA)}
        >
          <div className="flex items-center space-x-3">
            <FaFilePdf size={20} className="text-[#DFDFDF]" />
            <div>
              <div className="text-sm text-[#DFDFDF]">Export Data</div>
              <div className="text-xs text-[#DFDFDF] text-opacity-60">
                Download your data as PDF
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-[#DFDFDF]">Preferences</h3>

        {/* Set Budget */}
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

        {/* Notifications */}
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

        {/* Help Button */}
        <div
          className="flex items-center justify-between bg-[#1A1A1A] rounded-lg p-4 cursor-pointer"
          onClick={() => navigate(ROUTES.HELP)}
        >
          <div className="flex items-center space-x-3">
            <HelpCircle size={20} className="text-[#DFDFDF]" />
            <div>
              <div className="text-sm text-[#DFDFDF]">Help</div>
              <div className="text-xs text-[#DFDFDF] text-opacity-60">
                Get help and support
              </div>
            </div>
          </div>
        </div>

        <LogoutButton auth={auth} />
      </div>
    </div>
  );
}
