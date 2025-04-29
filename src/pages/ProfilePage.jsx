import React, { useState } from "react";
import { Moon, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase";

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const user = {
    name: "WINter",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    avatar:
      "https://i.pinimg.com/736x/23/4f/d4/234fd4285d600aaa90ae6af22512c7f5.jpg",
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-10">
        {/* Header */}
        <div className="text-2xl font-semibold">Settings</div>

        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Picture */}
          <div>
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-40 h-40 rounded-full border-3 border-blue-500"
            />
          </div>

          {/* Profile Info */}
          <div className="text-center">
            <h2 className="text-xl font-bold">{user.name}</h2>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Preferences */}
          <SettingsSection title="Preferences">
            <SettingItem
              icon={<Moon size={20} />}
              label="Dark Mode"
              type="toggle"
              value={darkMode}
              onToggle={() => setDarkMode(!darkMode)}
            />
          </SettingsSection>

          {/* Support */}
          <SettingsSection title="Support">
            <SettingItem
              icon={<LogOut size={20} color="red" />}
              label="Log Out"
              labelColor="text-red-500"
              type="link"
              onClick={handleLogout}
            />
          </SettingsSection>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 pt-10">Version 1.0.0</div>
      </div>
    </div>
  );
}

function SettingsSection({ title, children }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="bg-gray-800 rounded-xl divide-y divide-gray-700">
        {children}
      </div>
    </div>
  );
}

function SettingItem({ icon, label, value, type, onClick, onToggle, labelColor = "text-white" }) {
  const clickable = type === "link";

  return (
    <div
      className={`flex justify-between items-center px-4 py-4 ${
        clickable ? "cursor-pointer hover:bg-gray-700 transition" : ""
      }`}
      onClick={clickable ? onClick : undefined}
    >
      <div className="flex items-start space-x-3">
        <div className="mt-1">{icon}</div>
        <div>
          <div className={`font-medium ${labelColor}`}>{label}</div>
        </div>
      </div>

      {type === "toggle" ? (
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={value}
            onChange={onToggle}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-500"></div>
        </label>
      ) : type === "link" ? (
        <ChevronRight size={20} className="text-gray-400" />
      ) : null}
    </div>
  );
}


