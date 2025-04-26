import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TransactionForm = () => {
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const handleSave = () => {
    // Here you would usually POST the data to a server or store in context/state
    console.log({ amount, description, category, date });

    // Navigate back to Home after saving
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Add Transaction</h1>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
        />

        <button
          onClick={handleSave}
          className="w-full py-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg font-bold hover:from-orange-500 hover:to-orange-700 transition-all"
        >
          Save Transaction
        </button>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-2 text-gray-400 hover:underline text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TransactionForm;
