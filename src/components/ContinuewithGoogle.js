import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();

function ContinueWithGoogle() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if the user's data already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // Ask the user if they want to add their name
        const userName = window.confirm("Would you like to add your name to your profile?");
        if (userName) {
          const name = prompt("Please enter your name:");
          // Save user data with the name
          await setDoc(userDocRef, {
            displayName: name || "User", // Use entered name or default to "User"
            email: user.email,
            photoURL: user.photoURL || "default-avatar-url", // Optional, use default avatar if none
            createdAt: new Date(),
          });
        } else {
          // Save user data without the name
          await setDoc(userDocRef, {
            displayName: "User", // Default to "User" if no name provided
            email: user.email,
            photoURL: user.photoURL || "default-avatar-url", // Optional, use default avatar if none
            createdAt: new Date(),
          });
        }
      }

      // Notify the user that they logged in successfully
      toast.success("User logged in successfully!", { position: "top-center" });
      navigate("/home");
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to log in with Google.", { position: "bottom-center" });
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="flex items-center justify-center gap-3 w-full py-3 rounded-full bg-[#1f1f1f] border border-gray-600 text-white font-medium text-sm"
    >
      <FcGoogle size={20} />
      Sign in with Google
    </button>
  );
}

export default ContinueWithGoogle;







