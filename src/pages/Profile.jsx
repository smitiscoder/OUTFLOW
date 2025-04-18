import React from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate for redirection
import { auth } from "../components/firebase";  // Firebase auth
import { toast } from "react-toastify";  // For toast notifications
import './Profile.css';  // Import the profile CSS for styling

const Profile = () => {  // Corrected to Profile (based on your project structure)
  const navigate = useNavigate();  // Get navigate function

  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signOut();  // Firebase logout
      toast.success("Logged out successfully!");  // Toast success message
      navigate("/auth");  // Redirect to auth page after logout
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error during logout!");  // Toast error message if logout fails
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <p>Welcome!</p>

      {/* Logout button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;

