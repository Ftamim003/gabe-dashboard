"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useResetPasswordMutation } from "@/redux/features/auth/auth";

export default function NewPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const email = useSelector((state: RootState) => state.resetEmail.email); // email stored from previous step
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await resetPassword({ 
      email,
      newPassword,
      confirmPassword, }).unwrap();
      if (response.success) {
        alert("Password updated successfully");
        router.push("/login");
      } else {
        alert(response.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Password update failed:", err);
      alert("An error occurred while resetting the password");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-5">
            <Image src="/logo-image/logo_image.png" alt="Logo" height={250} width={250} />
          </div>

          {/* Title */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 tracking-wide">Reset Password</h1>
          </div>

          {/* Instruction */}
          <div className="mb-8">
            <p className="mt-2 text-gray-600 text-sm">
              Enter your new password and confirm it to reset your account password.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Section - Images */}
      <div className="hidden md:block md:w-1/2 p-4">
        <div className="flex h-full gap-4">
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
