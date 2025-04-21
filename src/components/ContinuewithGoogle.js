import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";

function ContinueWithGoogle() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
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






