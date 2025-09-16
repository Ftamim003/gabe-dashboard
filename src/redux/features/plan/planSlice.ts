// src/redux/features/subscriptionPlan/planSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { baseUrlApi } from "../../api/baseUrlApi";

export interface Plan {
  id: string;
  planName: string;
  amount: number;
  currency: string;
  productId: string;
  priceId: string | null;
  active: boolean;
  allowedPhases: number;
  description: string;
  facilities: string[];
  features: string[] | null;
  totalSubscribers: number;
  createdAt: string;
  updatedAt: string;
}

interface PlanState {
  plans: Plan[];
  selectedPlan?: Plan | null;
}

const initialState: PlanState = {
  plans: [],
  selectedPlan: null,
};

const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<Plan[]>) => {
      state.plans = action.payload;
    },
    setSelectedPlan: (state, action: PayloadAction<Plan | null>) => {
      state.selectedPlan = action.payload;
    },
  },
});

export const { setPlans, setSelectedPlan } = planSlice.actions;
export default planSlice.reducer;

// 🔹 RTK Query endpoints for subscription plans
export const planApi = baseUrlApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlans: build.query<Plan[], void>({
      query: () => ({
        url: "/plans",
        method: "GET",
      }),
    }),

    savePlan: build.mutation<Plan, any>({
      query: (planData) => ({
          url: '/plans/create-plan',
          method: "POST",
          body: planData,
        
      }),
    }),

    updatePlan: build.mutation<Plan, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/plans/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchPlansQuery,
  useSavePlanMutation,
  useUpdatePlanMutation,
} = planApi;
