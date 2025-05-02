import React, { useState } from "react";
import { Moon, LogOut, ChevronRight, Edit, Check, X, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase";

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("WINter");
  const navigate = useNavigate();

  const user = {
    name: editedName,
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

  const handleNameEdit = () => {
    setIsEditing(true);
  };

  const handleNameSave = () => {
    setIsEditing(false);
    // Here you would typically also save the name to your backend/database
  };

  const handleNameCancel = () => {
    setIsEditing(false);
    setEditedName("WINter"); // Reset to original name
  };

  return (
<div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF] p-6 flex justify-center">
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
              className="w-40 h-40 rounded-full border-3 border-purple-500"
            />
          </div>

          {/* Profile Info */}
          <div className="text-center flex items-center gap-2">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-[#1A1A1A] text-[#DFDFDF] border border-[#333333] rounded px-2 py-1"
                  autoFocus
                />
                <button 
                  onClick={handleNameSave}
                  className="text-green-500 hover:text-green-400"
                >
                  <Check size={20} />
                </button>
                <button 
                  onClick={handleNameCancel}
                  className="text-red-500 hover:text-red-400"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <button 
                  onClick={handleNameEdit}
                  className="text-purple-500 hover:text-purple-400"
                >
                  <Edit size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Account Section */}
          <SettingsSection title="Account">
            <SettingItem
              icon={<Mail size={20} />}
              label="Email"
              value={user.email}
              type="link"
              onClick={() => navigate("/update-email")}
            />
            <SettingItem
              icon={<Phone size={20} />}
              label="Phone Number"
              value={user.phone}
              type="link"
              onClick={() => navigate("/update-phone")}
            />
          </SettingsSection>

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
        <div className="text-center text-sm text-[#DFDFDF] text-opacity-60 pt-10">Version 1.0.0</div>
      </div>
    </div>
  );
}

function SettingsSection({ title, children }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="bg-[#1A1A1A] rounded-xl divide-y divide-[#333333]">
        {children}
      </div>
    </div>
  );
}

function SettingItem({ icon, label, value, type, onClick, onToggle, labelColor = "text-[#DFDFDF]" }) {
  const clickable = type === "link";

  return (
    <div
      className={`flex justify-between items-center px-4 py-4 ${
        clickable ? "cursor-pointer hover:bg-[#252525] transition" : ""
      }`}
      onClick={clickable ? onClick : undefined}
    >
      <div className="flex items-start space-x-3">
        <div className="mt-1">{icon}</div>
        <div>
          <div className={`font-medium ${labelColor}`}>{label}</div>
          {value && <div className="text-sm text-[#DFDFDF] text-opacity-60">{value}</div>}
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
          <div className="w-11 h-6 bg-[#333333] rounded-full peer peer-checked:bg-purple-500"></div>
        </label>
      ) : type === "link" ? (
        <ChevronRight size={20} className="text-[#DFDFDF] text-opacity-60" />
      ) : null}
    </div>
  );
}



