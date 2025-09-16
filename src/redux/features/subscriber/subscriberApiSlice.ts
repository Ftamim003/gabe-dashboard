import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { baseUrlApi } from "@/redux/api/baseUrlApi";

export interface SubscriberData {
  month: string;
  subscribers: number;
}

interface SubscriberResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: SubscriberData[];
}

interface SubscriberState {
  subscribers: SubscriberData[] | null;
}

const initialState: SubscriberState = {
  subscribers: null,
};

const subscriberSlice = createSlice({
  name: "subscriber",
  initialState,
  reducers: {
    setSubscribers: (state, action: PayloadAction<SubscriberData[]>) => {
      state.subscribers = action.payload;
    },
  },
});

export const { setSubscribers } = subscriberSlice.actions;
export default subscriberSlice.reducer;

// 🔹 RTK Query endpoints
export const subscriberApi = baseUrlApi.injectEndpoints({
  endpoints: (build) => ({
    getSubscribersPerMonth: build.query({
      query: (token) => ({
        url: "admin/subscribers-per-month",
        method: "GET",
        // headers: {
        //   Authorization: token,
        // },
      }),
    }),
  }),
});

// ✅ export hook
export const { useGetSubscribersPerMonthQuery } = subscriberApi;
