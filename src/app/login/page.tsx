"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { setUserData } from "@/redux/features/auth/userDataCatchSlice";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { useSignInMutation } from "@/redux/features/auth/auth";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signIn, { isLoading, error }] = useSignInMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await signIn({ email, password }).unwrap();
      console.log(response);
      
      if (response.success) {
        localStorage.setItem("token", response.data.accessToken);
        dispatch(setUserData(response.user));
        router.push("/admin-dashboard/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 ">
        <div className="w-full max-w-md">

          {/* Logo/Title Section */}
          <div className="mb-5">
                      <Image src="/logo-image/logo_image.png" alt="Logo" height={250} width={250} />
                    </div>
          <div className="text-center mb-10">
           
          </div>
          
          {/* Welcome Section */}
          <div className=" mb-8">
            <h2 className="text-3xl font-semibold text-gray-900">Welcome Back, Gabe!</h2>
            <p className="mt-2 text-gray-600 text-sm">
              Please enter your username and password to log in.
            </p>
          </div>
          
          {/* Form Section */}
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Your Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Forgot Password Link */}
              <div className="mt-2 text-right">
                <Link 
                  href="/forgot-password" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {("data" in error) 
                    ? (error as any).data.message 
                    : "An error occurred during login"}
                </div>
              </div>
            )}
            
            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
            
            {/* Sign Up Link */}
            {/* <div className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <Link 
                href="/signup" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign Up
              </Link>
            </div> */}
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