"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForgetPasswordMutation } from "@/redux/features/auth/auth";
import Image from "next/image";
import { setResetEmail } from "@/redux/features/auth/resetEmailSlice";
import { useDispatch } from "react-redux";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [forgetPassword, { isLoading, error }] = useForgetPasswordMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await forgetPassword({ email }).unwrap();
      if (response.success) {

        

// When sending OTP
            dispatch(setResetEmail(email));
        // redirect to reset-password page
        router.push("/reset-password");
      }
    } catch (err) {
      console.error("Forgot password failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className=" mb-8">
            <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
              Forget Your Password?
            </h1>
            <p className="mt-3 text-gray-600 text-sm">
              Enter your email and we will send you six digit code.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Your Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {"data" in error
                    ? (error as any).data.message
                    : "An error occurred"}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <Link
                href="/login"
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg text-center hover:bg-gray-50 transition"
              >
                Back
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Email"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:block md:w-1/2 p-4">
        <div className="flex h-full gap-4">
          {/* First Column */}
          <div className="w-1/2 flex flex-col gap-4">
            {/* Image 1 */}
            <div className="relative h-[200px]">
              <Image
                src="/images/rectangle_38.png" // put your image path in public/images
                alt="Image 1"
                fill
                className=""
              />
            </div>
      
            {/* Image 2 */}
            <div className="relative h-[330px]">
              <Image
                src="/images/rectangle_39.png"
                alt="Image 2"
                fill
                className=""
              />
            </div>
      
            {/* Image 3 */}
            <div className="relative h-[200px]">
              <Image
                src="/images/rectangle_40.png"
                alt="Image 3"
                fill
                className=" "
              />
            </div>
          </div>
      
          {/* Second Column */}
          <div className="w-1/2 flex flex-col gap-4">
            {/* Image 1 */}
            <div className="relative h-[330px]">
              <Image
                src="/images/rectangle_43.png" // put your image path in public/images
                alt="Image 1"
                fill
                className=" "
              />
            </div>
      
            {/* Image 2 */}
            <div className="relative h-[200px]">
              <Image
                src="/images/rectangle_41.png"
                alt="Image 2"
                fill
                className=""
              />
            </div>
      
            {/* Image 3 */}
            <div className="relative h-[200px]">
              <Image
                src="/images/rectangle_42.png"
                alt="Image 3"
                fill
                className=" "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
