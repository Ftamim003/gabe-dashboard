"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  useGetSingleUserQuery,
  useSuspendUserMutation,
} from "@/redux/features/auth/adminSlice";
import { toast } from "sonner";

interface UserProfileForm {
  gender: string;
  age: string;
  status: string;
  height: string;
  weight: string;
  level: string;
  phase: string;
}

export default function UserProfile() {
  const params = useParams();
  const userId = params.id as string;

  // Fetch single user
  const {
    data: response,
    isLoading,
    isError,
  } = useGetSingleUserQuery({ userId });
  const user = response?.data;

  const [suspendUser, { isLoading: loading }] = useSuspendUserMutation();

  console.log("Fetched User:", response);
  // React Hook Form
  const { register, handleSubmit, reset } = useForm<UserProfileForm>({
    defaultValues: {
      status: "",
      gender: "",
      age: "",
      height: "",
      weight: "",
      level: "",
      phase: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        gender: user.gender || "",
        age: user.age?.toString() || "",
        height: user.height?.toString() || "",
        weight: user.weight?.toString() || "",
        status: user.status || "",
        level: user.level || "",
        phase: user.phase || "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: UserProfileForm) => {
    console.log("Form submitted:", data);
    // Handle form submission here
  };

  const handleSuspend = async () => {
    try {
      const res = await suspendUser(userId).unwrap();
      toast.success(res?.message || "User account suspended successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  if (isLoading) return <p className="p-6">Loading user data...</p>;
  if (isError)
    return <p className="p-6 text-red-600">Failed to load user data.</p>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <Button
            onClick={handleSuspend}
            disabled={loading || user?.status === "INACTIVE"}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
          >
            {user?.status === "INACTIVE" ? "Suspended" : "Suspend User"}
          </Button>
        </div>

        {/* Profile Section */}
        <div className="p-6 mb-6 flex items-center gap-6">
          {/* Profile Image */}
          <div className="relative w-40 h-40 flex-shrink-0">
            <Image
              src={user?.profilePic || "/avatar1.png"}
              alt={user?.fullName || "User"}
              fill
              className="rounded-full object-cover"
              unoptimized
            />
          </div>

          {/* User Details */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {user?.fullName}
            </h2>
            <p className="text-gray-600 mb-1">{user?.email}</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border">
            <CardContent className="p-6 flex justify-between">
              <span className="text-gray-600 font-medium">
                Subscription Type
              </span>
              <span className="text-blue-600 font-semibold">
                {user?.subscribed === "SUBSCRIBED" ? "Subscribed" : "Free User"}
              </span>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6 flex justify-between">
              <span className="text-gray-600 font-medium">Member Since</span>
              <span className="text-blue-600 font-semibold">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <Input type="text" {...register("gender")} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <Input type="text" {...register("age")} readOnly />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <Input type="text" {...register("height")} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <Input type="text" {...register("weight")} readOnly />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <Input type="text" {...register("level")} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phase
                </label>
                <Input type="text" {...register("phase")} readOnly />
              </div>
            </div>

            {/* <Button type="submit">Save Changes</Button> */}
          </form>
        </div>
      </div>
    </div>
  );
}
