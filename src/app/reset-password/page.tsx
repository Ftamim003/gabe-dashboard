"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgetPasswordMutation, useVerifyOtpMutation } from "@/redux/features/auth/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
   
  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();
  const router = useRouter();
  const email = useSelector((state: RootState) => state.resetEmail.email);
  
  const [resendOtp, { isLoading: isResending }] = useForgetPasswordMutation();

const handleResend = async () => {
  try {
    if (!email) return; // safety check
    const response = await resendOtp({ email }).unwrap();
    if (response.success) {
       toast.success("OTP resent to your email");
      // optionally clear previous code inputs
      setCode(["", "", "", "", "", ""]);
    }
  } catch (err) {
    console.error("Resend OTP failed:", err);
    toast.error("Failed to resend OTP");
  }
};

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto focus next box
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

 const handleContinue = async () => {
    const otp = code.join("");

    try {
      const response = await verifyOtp({ email, otp }).unwrap();
      if (response.success) {
        // ✅ OTP verified, redirect to new password page
        router.push("/new-password");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-5">
                  <Image src="/logo-image/logo_image.png" alt="Image 1" height={250} width={250} />
                </div>
          {/* Title Section */}
          <div className=" mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="mt-2 text-gray-600 text-sm">
              Enter the 6 digit code sent to your email.
            </p>
          </div>

          {/* Verification Code Inputs */}
          <div className="flex justify-between mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div>
          {error && (
            <div className="text-red-600 text-sm mb-4">
              {"data" in error ? (error as any).data.message : "Invalid code"}
            </div>
          )}
          
          {/* Resend Link */}
          <div className="text-center text-sm text-gray-600 mb-6">
            Didn’t get it?{" "}
            <button
  type="button"
  className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
  onClick={handleResend}
  disabled={isResending}
>
  {isResending ? "Resending..." : "Resend"}
</button>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="cursor-pointer flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg text-center hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
  type="button"
  onClick={handleContinue}
  disabled={isLoading}
  className="cursor-pointer w-1/2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
>
  {isLoading ? "Verifying..." : "Continue"}
</button>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:block md:w-1/2 p-4">
              <div className="flex h-full gap-4">
                {/* First Column */}
                <div className="w-1/2 flex flex-col gap-4">
                  <div className="relative h-[200px]">
                    <Image src="/images/rectangle_38.png" alt="Image 1" fill />
                  </div>
                  <div className="relative h-[330px]">
                    <Image src="/images/rectangle_39.png" alt="Image 2" fill />
                  </div>
                  <div className="relative h-[200px]">
                    <Image src="/images/rectangle_40.png" alt="Image 3" fill />
                  </div>
                </div>
      
                {/* Second Column */}
                <div className="w-1/2 flex flex-col gap-4">
                  <div className="relative h-[330px]">
                    <Image src="/images/rectangle_43.png" alt="Image 4" fill />
                  </div>
                  <div className="relative h-[200px]">
                    <Image src="/images/rectangle_41.png" alt="Image 5" fill />
                  </div>
                  <div className="relative h-[200px]">
                    <Image src="/images/rectangle_42.png" alt="Image 6" fill />
                  </div>
                </div>
              </div>
            </div>
    </div>
  );
}
