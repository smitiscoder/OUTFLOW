import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import EditName from "./EditName";
import SettingsButtons from "./SettingsButtons";
import Avatar from "./Avatar";
import { ROUTES } from "../../utils/constants";
import { toast } from "react-hot-toast";
import Loader from '../../components/Loading';

export default function ProfileMain() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  // Authentication and data fetching
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser({
            uid: currentUser.uid,
            providerData: currentUser.providerData, // For Google display name
          });

          // Fetch user data from Firestore
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          let userData = userSnap.exists() ? userSnap.data() : null;

          // If no name in Firestore, use Google display name (if available)
          if (!userData?.name) {
            const googleProvider = currentUser.providerData.find(
              (provider) => provider.providerId === "google.com"
            );
            if (googleProvider?.displayName) {
              await setDoc(
                userRef,
                { name: googleProvider.displayName },
                { merge: true }
              );
              setEditedName(googleProvider.displayName);
            } else {
              setEditedName("");
            }
          } else {
            setEditedName(userData.name);
          }

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
        toast.error("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Name editing handlers
  const handleNameEdit = () => setIsEditing(true);

  const handleNameSave = async () => {
    if (!user?.uid || !editedName.trim() || editedName.length < 2) {
      toast.error("Name must be at least 2 characters long.");
      return;
    }
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { name: editedName.trim() }, { merge: true });
      setIsEditing(false);
      toast.success("Name updated successfully!");
    } catch (error) {
      console.error("Error saving name:", error);
      toast.error("Failed to save name. Please try again.");
    }
  };

  const handleNameCancel = async () => {
    try {
      const userRef = doc(db, "users", user?.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : null;
      setEditedName(userData?.name || "");
      setIsEditing(false);
    } catch (error) {
      console.error("Error fetching name:", error);
      toast.error("Failed to cancel edit. Please try again.");
      setEditedName("");
      setIsEditing(false);
    }
  };

  if (loading) {
    return <Loader />;
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
};