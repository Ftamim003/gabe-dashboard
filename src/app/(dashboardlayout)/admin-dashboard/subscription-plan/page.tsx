"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useSavePlanMutation } from "@/redux/features/plan/planSlice"
import { toast } from "sonner"

type PlanType = "free" | "pro"

interface PlanFormData {
  planTitle: string
  planPrice: string
  supportingText: string
  facility01: string
  facility02: string
  facility03: string
  facility04: string
  facility05: string
}

export default function SubscriptionPlanPage() {
  const [activeTab, setActiveTab] = useState<PlanType>("free")
  const [savePlan, { isLoading }] = useSavePlanMutation();
  const { register, handleSubmit, reset, watch } = useForm<PlanFormData>({
    defaultValues: {
      planTitle: activeTab === "free" ? "Free Plan" : "Pro Plan",
      planPrice: activeTab === "free" ? "0.00" : "29.99",
      supportingText: activeTab === "free" ? "Start your fitness journey for free" : "Unlock premium features",
      facility01: activeTab === "free" ? "AI generated workout" : "Advanced AI workouts",
      facility02: activeTab === "free" ? "Full access to the phase 1" : "Full access to all phases",
      facility03: "Basic audio coaching",
      facility04: "Basic audio coaching",
      facility05: "Basic audio coaching",
    },
  })

  const supportingText = watch("supportingText")

  const handleTabChange = (tab: PlanType) => {
    setActiveTab(tab)
    // Reset form with default values for the selected tab
    reset({
      planTitle: tab === "free" ? "Free Plan" : "Pro Plan",
      planPrice: tab === "free" ? "0.00" : "29.99",
      supportingText: tab === "free" ? "Start your fitness journey for free" : "Unlock premium features",
      facility01: tab === "free" ? "AI generated workout" : "Advanced AI workouts",
      facility02: tab === "free" ? "Full access to the phase 1" : "Full access to all phases",
      facility03: "Basic audio coaching",
      facility04: "Basic audio coaching",
      facility05: "Basic audio coaching",
    })
  }

 const onSubmit = async (data: PlanFormData) => {
  try {
    // Transform form data to match backend structure
    const payload = {
      planName: data.planTitle,
      amount: parseFloat(data.planPrice),
      currency: "usd",
      description: data.supportingText,
      facilities: [
        data.facility01,
        data.facility02,
        data.facility03,
        data.facility04,
        data.facility05,
      ],
      allowedPhases: activeTab === "free" ? 1 : 3, // example mapping
      active: true,
    };

    // Call RTK Query mutation
    const result = await savePlan(payload).unwrap();

    console.log(`${activeTab} plan saved successfully`, result);
    // Optionally, reset the form or show a toast notification here
    if(result){
      toast.success("Plan updated successfully!")
    }
    
  } catch (error: any) {
    console.error("Error saving plan:", error.data?.message || error.message);
  }
};

  const handleCancel = () => {
    // Reset form to default values
    handleTabChange(activeTab)
  }

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Subscription plan</h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => handleTabChange("free")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "free"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Free Plan
        </button>
        <button
          onClick={() => handleTabChange("pro")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ml-8 ${
            activeTab === "pro"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Pro Plan
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Plan Title and Price Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="planTitle" className="text-sm font-medium text-gray-700">
              Plan Title
            </Label>
            <Input id="planTitle" {...register("planTitle", { required: true })} className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="planPrice" className="text-sm font-medium text-gray-700">
              Plan Price
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <span className="bg-blue-600 text-white px-3 py-2 text-sm font-medium rounded-l-md border border-blue-600">
                  $
                </span>
              </div>
              <Input
                id="planPrice"
                type="number"
                step="0.01"
                {...register("planPrice", { required: true })}
                className="pl-12"
              />
            </div>
          </div>
        </div>

        {/* Supporting Text */}
        <div className="space-y-2">
          <Label htmlFor="supportingText" className="text-sm font-medium text-gray-700">
            Supporting Text
            <span className="text-gray-500 text-xs ml-1">(No more than 50 characters)</span>
          </Label>
          <Textarea
            id="supportingText"
            {...register("supportingText", {
              required: true,
              maxLength: 50,
            })}
            className="w-full h-20 resize-none"
            maxLength={50}
          />
          <div className="text-xs text-gray-500 text-right">{supportingText?.length || 0}/50</div>
        </div>

        {/* Plan Facilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="facility01" className="text-sm font-medium text-gray-700">
              Plan Facilities 01
            </Label>
            <Input id="facility01" {...register("facility01")} className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facility02" className="text-sm font-medium text-gray-700">
              Plan Facilities 02
            </Label>
            <Input id="facility02" {...register("facility02")} className="w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="facility03" className="text-sm font-medium text-gray-700">
              Plan Facilities 03
            </Label>
            <Input id="facility03" {...register("facility03")} className="w-full" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facility04" className="text-sm font-medium text-gray-700">
              Plan Facilities 04
            </Label>
            <Input id="facility04" {...register("facility04")} className="w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="facility05" className="text-sm font-medium text-gray-700">
              Plan Facilities 05
            </Label>
            <Input id="facility05" {...register("facility05")} className="w-full" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={handleCancel} className="px-6 bg-transparent">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
        </div>
      </form>
    </div>
  )
}
