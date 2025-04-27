// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { auth } from "./components/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRoutes from "./AppRoutes"; // import the new routing file

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (checkingAuth) return <div>Loading...</div>;

  return (
    <Router> {/* Router wraps entire App */}
      <ToastContainer />
      <AppRoutes user={user} /> {/* Routes separated */}
    </Router>
  );
}

export default App;



