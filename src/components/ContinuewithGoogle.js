import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactComponent as GoogleIcon } from '../icons/Google.svg';
import "./ContinuewithGoogle.css";

function ContinueWithGoogle() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success("User logged in successfully!", {
        position: "top-center",
      });
      navigate("/home");
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to log in with Google.", {
        position: "bottom-center",
      });
    }
  };

  return (
    <button onClick={handleGoogleSignIn} className="google-btn">
       <GoogleIcon style={{ marginRight: '10px', width: '20px', height: '20px' }} />
      Continue with Google
      
    </button>
  );
}

export default ContinueWithGoogle;




