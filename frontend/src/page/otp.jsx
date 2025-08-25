import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../configure/axios';

const Otp = ({ otp_val,Email }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(300);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);



  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("otp=",otp)
    const otpCode = otp.join('');
    console.log("new otpcode=",otpCode);
    
    
    if (otpCode.length !== 4) {
      toast.error('Please enter a complete 4-digit OTP');
      return;
    }
    
    otp_val(otpCode);
  };

  const handleResend = async () => {
    // Add your resend OTP logic here
    try {
      console.log("inside the =",Email);
      
      const response=await axiosInstance.post('/auth/resendotp',{Email})
      console.log(response)
    if(response){
    toast.success('New OTP sent to your email');
    setTimer(300);
    setIsResendDisabled(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);}
    } catch (error) {
      toast.error(error?.response?.data?.message||"something wrong")
      
    }
    
    
    
    
  };
  function formatTime(seconds) {
    return new Date(seconds * 1000).toISOString().slice(14, 19);
}


  return (
    <div className="bg-white max-w-[95%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%] h-auto md:min-h-60 flex flex-col justify-center items-center px-5 py-4 gap-4 border border-gray-500 rounded-2xl space-y-4">
      <h2 className="font-bold text-lg sm:text-xl">OTP Verification</h2>
      
      <p className="text-gray-400 text-center text-xs sm:text-base">
        We've sent a 4-digit verification code to your email. Please enter it below.
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-gray-300 rounded-lg text-center text-xl focus:outline-none focus:border-blue-500"
            />
          ))}
        </div>

        <div className="text-center text-sm text-gray-500">
          {timer > 0 && (
            <p>Resend OTP in <span className='text-red-600 font-medium'> {formatTime(timer)}</span> seconds</p>

            
          ) }
        </div>

        {
          timer>0?(
             <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 w-full rounded-md hover:bg-blue-600 transition"
        >
          Verify OTP
        </button>
          ):(
             <button
             onClick={handleResend}
          type="button"
          className="bg-blue-500 text-white px-4 py-2 w-full rounded-md hover:bg-blue-600 transition"
        >
          resent OTP
        </button>

          )
        }

        

       
      </form>
    </div>
  );
};

export default Otp;