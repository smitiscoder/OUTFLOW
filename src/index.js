import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ExpenseProvider } from './ExpenseContext'; // ✅ import the provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ExpenseProvider> {/* ✅ wrap App with ExpenseProvider */}
      <App />
    </ExpenseProvider>
  </React.StrictMode>
);

// Optional: Measure performance
reportWebVitals();
