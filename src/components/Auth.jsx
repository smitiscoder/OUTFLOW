import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { ReactComponent as PhoneIcon } from '../icons/phone.svg'; // Make sure this path is correct
import ContinueWithGoogle from '../components/ContinuewithGoogle';

const AuthPage = () => {
  const navigate = useNavigate();

  const handlePhoneLogin = () => {
    navigate('/phone-login');
  };

  return (
    <div className="auth-container">
      <h1 className="welcome-text">
        WELCOME TO <br /> <span className="brand-name">TRACKIT</span>
      </h1>

      {/* Login with Phone Number Button */}
      <button className="phone-login-btn" onClick={handlePhoneLogin}>
        <PhoneIcon className="button-icon" />
        <span>Login with Phone Number</span>
      </button>

      {/* OR separator */}
      <div className="or-text">OR</div>

      {/* Google Sign-In Button */}
      <ContinueWithGoogle />
    </div>
  );
};

export default AuthPage;





