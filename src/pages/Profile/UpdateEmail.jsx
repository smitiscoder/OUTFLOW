import React, { useState, useEffect } from "react";
import { auth } from "../../components/firebase";
import { useNavigate } from "react-router-dom";

export default function UpdateEmail() {
  const user = auth.currentUser;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("loading"); // loading, google, editable
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.providerData.some(p => p.providerId === "google.com")) {
        setEmail(user.email);
        setStatus("google");
      } else if (!user.email) {
        setStatus("editable");
      } else {
        setEmail(user.email);
        setStatus("editable");
      }
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      await user.updateEmail(email);
      setMessage("Email updated successfully.");
    } catch (error) {
      setMessage("Error updating email: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Update Email</h2>

        {status === "loading" ? (
          <p className="text-center text-gray-400">Checking account type...</p>
        ) : status === "google" ? (
          <div className="text-center">
            <p className="text-lg">You're signed in with Google</p>
            <p className="text-gray-400 mt-2">{email}</p>
            <p className="text-sm text-gray-500 mt-4">
              Email can't be changed as it’s managed by your Google account.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
              placeholder="Enter your email"
            />
            <button
              onClick={handleUpdate}
              className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-semibold"
            >
              Save Email
            </button>
          </div>
        )}

        {message && <p className="text-center text-sm text-green-400">{message}</p>}

        <div className="text-center">
          <button onClick={() => navigate(-1)} className="text-blue-400 hover:underline">
            ← Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
