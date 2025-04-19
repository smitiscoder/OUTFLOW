import React, { useState } from "react";
import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Phone = () => {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [confirmationResult, setConfirmationResult] = useState(null);

  const navigate = useNavigate();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {
          toast.error("Recaptcha expired. Please try again.");
        },
      });
    }
  };

  const sendOTP = async () => {
    if (phone.length !== 10 || isNaN(phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    const fullPhoneNumber = "+91" + phone;
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleOTPChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const verifyOTP = async () => {
    if (!confirmationResult) {
      toast.error("Session expired. Please resend OTP.");
      setOtpSent(false);
      setOtp(new Array(6).fill(""));
      return;
    }

    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    try {
      await confirmationResult.confirm(finalOtp);
      toast.success("Login successful!");
      navigate("/home");
    } catch (error) {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0f0f0f] text-white px-4">
      {/* Phone Input */}
      <div className="flex items-center border border-gray-600 rounded-full px-4 py-3 w-full max-w-xs mb-6">
        <span className="text-gray-400 pr-2">+91</span>
        <input
          type="tel"
          placeholder="Enter your mobile number"
          className="bg-transparent outline-none text-white w-full"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={otpSent}
        />
      </div>

      {!otpSent ? (
        <button
          className="w-full max-w-xs bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold py-3 rounded-full hover:opacity-90 transition"
          onClick={sendOTP}
        >
          SEND OTP
        </button>
      ) : (
        <>
          {/* OTP Inputs */}
          <div className="flex justify-between space-x-2 mt-4 mb-6 w-full max-w-xs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                className="w-10 h-12 text-center rounded-md text-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={digit}
                onChange={(e) => handleOTPChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button
            className="w-full max-w-xs bg-gradient-to-r from-green-500 to-green-400 text-white font-semibold py-3 rounded-full hover:opacity-90 transition"
            onClick={verifyOTP}
            disabled={otp.join("").length !== 6}
          >
            VERIFY & LOGIN
          </button>
        </>
      )}

      {/* reCAPTCHA placeholder */}
      <div id="recaptcha-container" />
    </div>
  );
};

export default Phone;



