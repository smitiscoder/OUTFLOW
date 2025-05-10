import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../components/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function SetBudget() {
  const [budget, setBudget] = useState("");  // Local state for budget
  const [currentBudget, setCurrentBudget] = useState(null); // State to track if a budget exists
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch budget from Firestore when the component mounts
  useEffect(() => {
    const fetchBudget = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "budgets", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBudget(docSnap.data().amount);  // Set the fetched budget to state
          setCurrentBudget(docSnap.data().amount); // Set current budget
        } else {
          setCurrentBudget(null); // No budget exists
        }
      } catch (err) {
        console.error("Error fetching budget:", err);
      }
    };

    fetchBudget(); // Call function to fetch budget
  }, [user]); // Dependency on `user` to run when user is available

  const handleSaveBudget = async () => {
    if (!user || !budget) return;

    setLoading(true);
    try {
      await setDoc(doc(db, "budgets", user.uid), {
        amount: Number(budget),
        updatedAt: new Date(),
      });
      console.log("Budget saved:", budget);
      setCurrentBudget(Number(budget)); // Update current budget state
      navigate("/");  // Navigate to home after saving the budget
    } catch (err) {
      console.error("Error saving budget:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBudget = async () => {
    if (!user) return;

    setRemoveLoading(true);
    try {
      await deleteDoc(doc(db, "budgets", user.uid));
      console.log("Budget removed");
      setBudget(""); // Clear the input field
      setCurrentBudget(null); // Update current budget state
      navigate("/"); // Navigate to home after removing the budget
    } catch (err) {
      console.error("Error removing budget:", err);
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-6 flex justify-center items-center">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold">Set Your Budget</h2>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Enter budget amount"
          className="w-full p-3 rounded bg-[#1A1A1A] border border-[#333333] text-white"
        />
        <button
          onClick={handleSaveBudget}
          disabled={loading || !budget}
          className={`w-full py-2 rounded font-semibold ${
            loading || !budget
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-500"
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        
        {currentBudget !== null && (
          <button
            onClick={handleRemoveBudget}
            disabled={removeLoading}
            className={`w-full py-2 rounded font-semibold ${
              removeLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-500"
            }`}
          >
            {removeLoading ? "Removing..." : "Remove Budget"}
          </button>
        )}
      </div>
    </div>
  );
}
