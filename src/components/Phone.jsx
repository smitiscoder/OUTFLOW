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
  const [verifying, setVerifying] = useState(false);

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

    const finalOtp = newOtp.join("");
    if (finalOtp.length === 6) {
      verifyOTP(finalOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      if (i < 6 && !isNaN(char)) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);

    const filledLength = pasteData.length;
    setTimeout(() => {
      if (filledLength < 6) {
        document.getElementById(`otp-${filledLength}`).focus();
      } else {
        verifyOTP(newOtp.join(""));
      }
    }, 10);
  };

  const verifyOTP = async (enteredOtp = otp.join("")) => {
    if (!confirmationResult) {
      toast.error("Session expired. Please resend OTP.");
      setOtpSent(false);
      setOtp(new Array(6).fill("")); // Reset OTP if session expired
      return;
    }

    if (enteredOtp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setVerifying(true);
      await confirmationResult.confirm(enteredOtp);
      toast.success("Login successful!");
      navigate("/home");
    } catch (error) {
      toast.error("Invalid OTP");
    } finally {
      setVerifying(false);
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
          <div className="flex justify-between tracking-widest space-x-2 mt-4 mb-6 w-full max-w-xs">
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
                onPaste={handlePaste}
                inputMode="numeric"  // Added inputMode to show numeric keyboard
              />
            ))}
          </div>
          <button
            className={`w-full max-w-xs bg-gradient-to-r from-green-500 to-green-400 text-white font-semibold py-3 rounded-full hover:opacity-90 transition ${verifying ? "opacity-60 cursor-not-allowed" : ""}`}
            onClick={() => verifyOTP()}
            disabled={verifying || otp.join("").length !== 6}
          >
            {verifying ? "Verifying..." : "VERIFY & LOGIN"}
          </button>
        </>
      )}

      {/* reCAPTCHA placeholder */}
      <div id="recaptcha-container" />
    </div>
  );
};

export default Phone;




