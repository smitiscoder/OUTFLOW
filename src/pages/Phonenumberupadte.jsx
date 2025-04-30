import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase"; // adjust path as needed
import { ArrowLeft, Phone, Check, X } from "lucide-react";

export default function UpdatePhone() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [phone, setPhone] = useState("");
  const [initialPhone, setInitialPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user && user.phoneNumber) {
      setPhone(user.phoneNumber);
      setInitialPhone(user.phoneNumber);
    }
  }, [user]);

  const handleSave = () => {
    // Simulated backend update
    console.log("Saving new phone number:", phone);

    // In a real app, you'd use Firebase or your backend API
    // Example (Firebase): user.updatePhoneNumber(credential).then(...).catch(...)
    
    setInitialPhone(phone);
    setIsEditing(false);
    alert("Phone number updated!");
  };

  const handleCancel = () => {
    setPhone(initialPhone);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Update Phone Number</h1>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl space-y-4 max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <Phone size={20} className="text-blue-400" />
          <div className="text-lg font-medium">Phone</div>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 w-full"
              placeholder="+91XXXXXXXXXX"
            />
            <button onClick={handleSave} className="text-green-400 hover:text-green-300">
              <Check size={20} />
            </button>
            <button onClick={handleCancel} className="text-red-400 hover:text-red-300">
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-gray-300">{phone || "No phone number linked"}</div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {phone ? "Edit" : "Add"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
