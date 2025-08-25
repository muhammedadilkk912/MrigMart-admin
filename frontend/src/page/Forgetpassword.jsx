import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../configure/axios";
import Otp from "./otp";
import Resetpassword from "./resetpassword";

const Forget = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email"); // "email", "otp", "reset"

  // Email handling
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const emailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return toast.error("Email is required");
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      return toast.error("Invalid email format");
    }

    try {
      const response = await axiosInstance.post("/auth/forgetpassword", { email });
    setStep("otp");
      if (response.status === 201) {
        setStep("otp");
        setEmail(response.data.email);
        toast.success("OTP sent successfully!");

        
      }
    } catch (error) {
      console.error("Forget email error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // OTP verification 
  const collectOtp = async (otp) => {
    try {
      const response = await axiosInstance.put("/auth/verify-otp", {
        otp,
        email,
      });

      if (response.status === 200) {
        setStep("reset");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-r from-[#483FF3] to-[#7667FF]">
      {step === "email" && (
        <div className="bg-white max-w-[95%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%] h-auto md:min-h-60 flex flex-col justify-center items-center px-5 py-4 gap-4 border border-gray-500 rounded-2xl space-y-4">
          <h2 className="font-bold text-lg sm:text-xl">Reset password</h2>

          <p className="text-gray-400 break-words text-xs sm:text-base">
            Please enter the email address that you used to register, and we
            will send you an OTP to reset your password via Email.
          </p>

          <input
            name="email"
            type="email"
            className="bg-blue-50 border border-gray-600 rounded h-10 w-full px-3"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmail}
          />

          <button
            onClick={emailSubmit}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 w-full rounded-md hover:bg-blue-600 transition"
          >
            Send Code
          </button>
        </div>
      )}

      {/* OTP verification section */}
      {step === "otp" && <Otp otp_val={collectOtp} Email={email} />}

      {/* Reset password section */}
      {step === "reset" && <Resetpassword email={email} />}
    </div>
  );
};

export default Forget;