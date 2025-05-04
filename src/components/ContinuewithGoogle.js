import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";

export default function ContinueWithGoogle() {
  const handleGoogleSignIn = async () => {
    try {
      console.groupCollapsed("[Firebase] Google Sign-In Initiated");
      console.log("Opening Google sign-in popup...");

      // Step 1: Authenticate with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Authentication successful:", {
        uid: user.uid,
        email: user.email,
        name: user.displayName
      });

      // Step 2: Prepare user document
      const userDocRef = doc(db, "users", user.uid);
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "User",
        photoURL: user.photoURL || "",
        lastLogin: new Date(),
        provider: "google"
      };

      // Step 3: Check if user exists
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        console.log("Creating new user document...");
        userData.createdAt = new Date();
        await setDoc(userDocRef, userData);
        toast.success("Welcome! Your account has been created.");
      } else {
        console.log("Updating existing user document...");
        await setDoc(userDocRef, userData, { merge: true });
        toast.success("Welcome back!");
      }

      console.log("Firestore operation completed successfully");
      console.groupEnd();

    } catch (error) {
      console.groupCollapsed("[Firebase] Error during sign-in");
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        fullError: error
      });
      console.groupEnd();

      // Handle specific error cases
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          console.warn("User closed the sign-in popup");
          return; // Silent failure for user-cancelled actions
          
        case 'auth/network-request-failed':
          toast.error("Network error. Please check your internet connection.");
          break;
          
        case 'auth/cancelled-popup-request':
          toast.warning("Sign-in process cancelled");
          break;
          
        case 'firestore/permission-denied':
          toast.error("Database permissions issue. Please try again later.");
          console.error("Firestore rules may need updating");
          break;
          
        default:
          toast.error(`Sign-in failed: ${error.message}`);
      }
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









