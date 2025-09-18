"use client";

import { useState, useEffect } from "react";
import { Camera, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  useFetchAdminInfoQuery,
  useUpdateAdminInfoMutation,
  useChangePasswordMutation,
  setAdminInfo,
} from "@/redux/features/auth/adminSlice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import Image from "next/image";

interface AdminInfoForm {
  fullName: string;
  email: string;
  phone: string;
  profile?: FileList;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface AdminInfoData {
  data: {
    fullName: string;
    email: string;
    phone: string;
    profilePic?: string;
  };
}

export default function AdminInformation() {
  const { data: fetchedAdminInfo } = useFetchAdminInfoQuery("");
  const [updateAdminInfo, { isLoading: isUpdating }] =
    useUpdateAdminInfoMutation();
  const [changePasswordApi, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [preview, setPreview] = useState<string | null>(null);
  const [updateImage, setUpdateImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminInfoForm>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      profile: undefined,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>();

  const newPassword = watch("newPassword");

  // Populate form when fetchedAdminInfo arrives
  useEffect(() => {
    if (fetchedAdminInfo) {
      const adminData = fetchedAdminInfo as AdminInfoData;
      reset({
        fullName: adminData.data.fullName || "",
        email: adminData.data.email || "",
        phone: adminData.data.phone || "",
        profile: undefined,
      });
      setPreview(adminData.data.profilePic || null);
    }
  }, [fetchedAdminInfo, reset]);

  // Save Admin Info
  const dispatch = useDispatch();
  const onSubmitAdmin = async (data: AdminInfoForm) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone || "");

      if (updateImage) {
        formData.append("file", updateImage);
      }

      const response = await updateAdminInfo(formData).unwrap();

      dispatch(setAdminInfo(response));

      toast.success("Information Updated successfully");
    } catch (error) {
      console.error("Failed to update Information:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Information update failed";
      toast.error(errorMessage);
    }
  };

  // Change Password
  const onSubmitPassword = async (data: PasswordForm) => {
    console.log("password: ", data);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const payload = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };

      const res = await changePasswordApi({
        body: payload,
        token,
      }).unwrap();

      console.log(res);
      if (res?.success) {
        toast.success(res?.message);
        resetPassword();
        reset();
      }
    } catch (error) {
      console.error("Password update error:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Password update failed";
      toast.error(errorMessage);
    }
  };

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Admin Info Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Admin Information
          </h1>

          {/* Profile Image */}
          <form onSubmit={handleSubmit(onSubmitAdmin)} className="space-y-4">
            <div className="flex mb-6">
              <div className="relative">
                {preview ? (
                  <div className="relative w-40 h-40">
                    <Image
                      src={preview}
                      alt="Profile"
                      className="rounded-full object-cover border"
                      fill
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-600">
                      {(fetchedAdminInfo as AdminInfoData)?.data
                        .fullName?.[0] || "A"}
                    </span>
                  </div>
                )}
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700 cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                </label>
                <Input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("profile")}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      setUpdateImage(e.target.files[0]);
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name:
              </label>
              <Input
                type="text"
                {...register("fullName", { required: "Name is required" })}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address:
                </label>
                <Input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number:
                </label>
                <Input type="tel" {...register("phone")} />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Change Password:
          </h2>
          <p className="text-gray-600 mb-6">
            If you wish to update your password, enter a new one below.
          </p>

          <form onSubmit={handlePasswordSubmit(onSubmitPassword)}>
            {/* Current Password */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password:
              </label>
              <Input
                type={showCurrent ? "text" : "password"}
                {...registerPassword("currentPassword", {
                  required: "Current password is required",
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-sm">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password:
              </label>
              <Input
                type={showNew ? "text" : "password"}
                {...registerPassword("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-sm">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password:
              </label>
              <Input
                type={showConfirm ? "text" : "password"}
                {...registerPassword("confirmPassword", {
                  required: "Please confirm password",
                  validate: (val) =>
                    val === newPassword || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "Saving..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
