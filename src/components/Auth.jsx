import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { ReactComponent as PhoneIcon } from '../icons/phone.svg'; // Make sure this path is correct
import { FcGoogle } from 'react-icons/fc';

const AuthPage = () => {
  const navigate = useNavigate();

  const handlePhoneLogin = () => {
    navigate('/phone-login');
  };

  return (
    <div className="auth-container">
  <div className="auth-box">
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

      
      {/* Google Login Button */}
      <button className="google-login-btn">
        <FcGoogle className="button-icon" />
        <span>Login with Google</span>
      </button>

      
    </div>
    </div>
  );
};

export default AuthPage;





