"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useForm } from "react-hook-form"

interface UserProfileForm {
  gender: string
  age: string
  height: string
  weight: string
  level: string
  phase: string
}

export default function UserProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileForm>({
    defaultValues: {
      gender: "Male",
      age: "24",
      height: "5.6 inches",
      weight: "5.6 inches",
      level: "Beginner",
      phase: "Phase 3",
    },
  })

  const onSubmit = (data: UserProfileForm) => {
    console.log("Form data:", data)
    // Handle form submission here
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent">
            Suspend User
          </Button>
        </div>

        {/* Profile Section */}
        <div className="p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img
                src="/professional-headshot-of-brooklyn-simmons--young-m.jpg"
                alt="Brooklyn Simmons"
                className="w-40 h-40 rounded-full object-cover"
              />
            </div>

            {/* User Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Brooklyn Simmons</h2>
              <p className="text-gray-600 mb-1">brooklynsimmons007@gmail.com</p>
              <p className="text-gray-600">Roma,Italy</p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Subscription Type</span>
                <span className="text-blue-600 font-semibold">Subscribed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Member Since</span>
                <span className="text-blue-600 font-semibold">24 Aug 2024</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Row - Gender and Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <Input type="text" {...register("gender")} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <Input type="text" {...register("age")} className="w-full" />
              </div>
            </div>

            {/* Second Row - Height and Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <Input type="text" {...register("height")} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <Input type="text" {...register("weight")} className="w-full" />
              </div>
            </div>

            {/* Third Row - Level and Phase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <Input type="text" {...register("level")} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phase</label>
                <Input type="text" {...register("phase")} className="w-full" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
