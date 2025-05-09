import React from 'react';
import { useNavigate } from 'react-router-dom';

const BudgetInfo = ({ budget, expenses }) => {
  const navigate = useNavigate();

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const calculateBudgetSaved = () => {
    // Treat undefined, null, or 0 as no budget
    if (!budget || budget <= 0) return null;
    const spentPercentage = (totalSpent / budget) * 100;
    const savedPercentage = 100 - spentPercentage;
    return Math.max(0, Math.min(100, savedPercentage));
  };

  const formatNumber = (num) => {
    return num % 1 === 0 ? num : num.toFixed(2);
  };

  const budgetSaved = calculateBudgetSaved();
  // Determine if there's a valid budget
  const hasValidBudget = budget && budget > 0;

  return (
    <div className="mb-6">
      {hasValidBudget && (
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
          <div
            className="bg-purple-600 h-2.5 rounded-full"
            style={{ width: `${Math.min(100, (totalSpent / budget) * 100)}%` }}
          ></div>
        </div>
      )}
      {budgetSaved !== null && hasValidBudget ? (
        <div className="text-center">
          <p className="text-lg">
            {budgetSaved >= 0 ? (
              <>
                You have saved <span className="font-bold">{Math.round(budgetSaved)}%</span> of your budget
              </>
            ) : (
              <>
                You've exceeded your budget by{' '}
                <span className="font-bold text-red-400">{Math.abs(Math.round(budgetSaved))}%</span>
              </>
            )}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Spent: ₹{formatNumber(totalSpent)} / Budget: ₹{formatNumber(budget)}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-400">No budget set</p>
          <button
            onClick={() => navigate('/setbudget')}
            className="text-purple-400 hover:text-purple-300 text-sm mt-1"
          >
            Set a budget to track your savings
          </button>
        </div>
      )}
    </div>
  );
};

export default BudgetInfo;