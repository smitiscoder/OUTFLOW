import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";

export default function ContinueWithGoogle() {
  const handleGoogleSignIn = async () => {
    try {
      console.groupCollapsed("[Firebase] Google Sign-In Initiated");

      // Step 1: Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("Authentication successful:", {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
      });

      // Step 2: Reference to Firestore document
      const userDocRef = doc(db, "users", user.uid);

      const userData = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "User",
        photoURL: user.photoURL || "",
        provider: "google",
        lastLogin: serverTimestamp(),
      };

      // Step 3: Check if user exists
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // New user
        userData.createdAt = serverTimestamp();
        await setDoc(userDocRef, userData);
        toast.success("Welcome! Your account has been created.");
      } else {
        // Existing user
        await setDoc(userDocRef, userData, { merge: true });
        toast.success("Welcome back!");
      }

      console.groupEnd();
    } catch (error) {
      console.groupCollapsed("[Firebase] Error during Google Sign-In");

      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      switch (error.code) {
        case "auth/popup-closed-by-user":
          console.warn("User closed the sign-in popup.");
          break;
        case "auth/network-request-failed":
          toast.error("Network error. Check your internet connection.");
          break;
        case "auth/cancelled-popup-request":
          toast.warning("Sign-in popup request was cancelled.");
          break;
        case "firestore/permission-denied":
          toast.error("You don't have permission to access the database.");
          break;
        default:
          toast.error(`Google sign-in failed: ${error.message}`);
      }

      console.groupEnd();
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










