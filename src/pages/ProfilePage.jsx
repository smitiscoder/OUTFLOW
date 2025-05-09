import React, { useState, useEffect } from "react";
import {
  Moon,
  LogOut,
  ChevronRight,
  Edit,
  Check,
  X,
  Mail,
  Phone,
  BellDot,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../components/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUserId(user.uid);
          setEmail(user.email || "");
          setPhone(user.phoneNumber || "");

          // Fetch user data
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setEditedName(userData.name || "");
          }

          // Fetch budget information
          const budgetRef = doc(db, "budgets", user.uid);
          const budgetSnap = await getDoc(budgetRef);
          if (budgetSnap.exists()) {
            setBudget(budgetSnap.data().amount);
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleNameEdit = () => setIsEditing(true);

  const handleNameSave = async () => {
    if (!userId || !editedName.trim()) return;

    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { name: editedName.trim() }, { merge: true });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving name:", error);
    }
  };

  const handleNameCancel = () => {
    if (userId) {
      // Reset to the original name from Firestore
      const userRef = doc(db, "users", userId);
      getDoc(userRef).then((doc) => {
        if (doc.exists()) {
          setEditedName(doc.data().name || "");
        }
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-[#DFDFDF]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF] p-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-10">
        {/* Header */}
        <div className="text-2xl font-semibold">Settings</div>

        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src="https://i.pinimg.com/736x/23/4f/d4/234fd4285d600aaa90ae6af22512c7f5.jpg"
            alt="Avatar"
            className="w-40 h-40 rounded-full border-3 border-purple-500 object-cover"
          />

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
                  maxLength={30}
                />
                <button
                  onClick={handleNameSave}
                  className="text-green-500"
                  disabled={!editedName.trim()}
                >
                  <Check size={20} />
                </button>
                <button onClick={handleNameCancel} className="text-red-500">
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">{editedName || "username"}</h2>
                <button
                  onClick={handleNameEdit}
                  className="text-purple-500 hover:text-purple-400"
                  aria-label="Edit name"
                >
                  <Edit size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Account */}
          <SettingsSection title="Account">
            <SettingItem
              icon={<Users size={20} />}
              label="Space"
              value={"space" || "Not provided"}
              type="link"
              onClick={() => navigate("/Space")}
            />
            <SettingItem
              icon={<Mail size={20} />}
              label="Email"
              value={email || "Not provided"}
              type="link"
              onClick={() => navigate("/update-email")}
            />
            <SettingItem
              icon={<Phone size={20} />}
              label="Phone Number"
              value={phone || "Not provided"}
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
            <SettingItem
              icon={<Edit size={20} />}
              label="Set Budget"
              value={budget ? `₹${budget.toLocaleString()}` : "Not set"}
              type="link"
              onClick={() => navigate("/setbudget")}
            />
            <SettingItem
              icon={<BellDot size={20} />}
              label="Notification"
              type="link"
              onClick={() => navigate("/Notifications")} // Fixed typo
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
        <div className="text-center text-sm text-[#DFDFDF] text-opacity-60 pt-10">
          Version 1.0.0
        </div>
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

function SettingItem({
  icon,
  label,
  value,
  type,
  onClick,
  onToggle,
  labelColor = "text-[#DFDFDF]",
}) {
  const clickable = type === "link";

  return (
    <div
      className={`flex justify-between items-center px-4 py-4 ${
        clickable ? "cursor-pointer hover:bg-[#252525] transition" : ""
      }`}
      onClick={clickable ? onClick : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <div className="flex items-start space-x-3">
        <div className="mt-1">{icon}</div>
        <div>
          <div className={`font-medium ${labelColor}`}>{label}</div>
          {value && (
            <div className="text-sm text-[#DFDFDF] text-opacity-60">{value}</div>
          )}
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
          <div className="relative w-11 h-6 bg-[#333333] rounded-full peer peer-checked:bg-purple-500">
            <div className="absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform peer-checked:translate-x-5"></div>
          </div>
        </label>
      ) : type === "link" ? (
        <ChevronRight size={20} className="text-[#DFDFDF] text-opacity-60" />
      ) : null}
    </div>
  );
}