import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../components/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import EditName from "./EditName";
import SettingsButtons from "./SettingsButtons";
import Avatar from "./Avatar";
import { ROUTES } from "../../utils/constants";

export default function ProfileMain() {
  const [darkMode, setDarkMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Authentication and data fetching
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber,
          });

          // Fetch user data from Firestore
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : null;
          setEditedName(userData?.name || "");

          // Fetch budget from Firestore
          const budgetRef = doc(db, "budgets", currentUser.uid);
          const budgetSnap = await getDoc(budgetRef);
          const budgetData = budgetSnap.exists() ? budgetSnap.data() : null;
          setBudget(budgetData?.amount || null);
        } else {
          navigate(ROUTES.LOGIN);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Name editing handlers
  const handleNameEdit = () => setIsEditing(true);

  const handleNameSave = async () => {
    if (!user?.uid || !editedName.trim()) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { name: editedName.trim() }, { merge: true });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving name:", error);
    }
  };

  const handleNameCancel = async () => {
    try {
      const userRef = doc(db, "users", user?.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : null;
      setEditedName(userData?.name || "");
    } catch (error) {
      console.error("Error fetching name:", error);
      setEditedName("");
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
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF]">
    <div className="container mx-auto px-4 pb-20 max-w-md">
      <header className="py-4 flex items-center justify-between mt-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>

        {/* Avatar and Name */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar />
          <EditName
            isEditing={isEditing}
            editedName={editedName}
            setEditedName={setEditedName}
            handleNameEdit={handleNameEdit}
            handleNameSave={handleNameSave}
            handleNameCancel={handleNameCancel}
          />
        </div>

        {/* Settings Sections */}
        <SettingsButtons
          user={user}
          budget={budget}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          navigate={navigate}
          auth={auth}
        />

        {/* App Info */}
        <div className="text-center text-sm text-[#DFDFDF] text-opacity-60 pt-10">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
}