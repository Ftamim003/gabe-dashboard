import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { baseUrlApi } from "../../api/baseUrlApi";

export interface AdminInfo {
  id: string;
  fullName: string;
  email: string;
  profilePic: string;
  role: string;
  isVerified: boolean;
  subscribed?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Mission {
  squad: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// export interface User {
//   id: string;
//   profilePic: string;
//   fullName: string;
//   email: string;
//   gender: string;
//   age: number;
//   height: number;
//   weight: number;
//   level: string;
//   status: "ACTIVE" | "INACTIVE";
//   subscribed: "FREE_USER" | "SUBSCRIBED";
//   createdAt: string;
//   phase?: string | number | null;
// }

interface AdminState {
  adminInfo: AdminInfo | null;
}

const initialState: AdminState = {
  adminInfo: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminInfo: (state, action: PayloadAction<AdminInfo>) => {
      state.adminInfo = action.payload;
    },
  },
});

export const { setAdminInfo } = adminSlice.actions;
export default adminSlice.reducer;

// 🔹 RTK Query endpoints for admin
export const adminApi = baseUrlApi.injectEndpoints({
  endpoints: (build) => ({
    fetchAdminInfo: build.query({
      query: () => ({
        url: `/auth/me`,
        method: "GET",
      }),
    }),

    updateAdminInfo: build.mutation<AdminInfo, FormData>({
      query: (formData) => ({
        url: "/admin/update-admin",
        method: "PUT",
        body: formData,
      }),
    }),

    fetchAdminStats: build.query({
      query: () => ({
        url: "/admin/getTotal",
        method: "GET",
      }),
    }),

    getAllUsers: build.query({
      query: () => ({
        url: "/admin/getAllUser",
        method: "GET",
      }),
    }),

    getSingleUser: build.query({
      query: ({ userId }) => ({
        url: `/admin/getSingleUser/${userId}`,
        method: "GET",
      }),
    }),

    getNotifications: build.query({
      query: () => ({
        url: "/admin/getAllNotifications",
        method: "GET",
      }),
    }),

    suspendUser: build.mutation({
      query: (userId) => ({
        url: `/admin/suspend/${userId}`,
        method: "PATCH",
      }),
    }),

    markAllAsRead: build.mutation({
      query: () => ({
        url: `/admin/markAllRead`,
        method: "PATCH",
      }),
    }),

    deleteAllNotifications: build.mutation({
      query: () => ({
        url: `/admin/deleteAllNotifications`,
        method: "DELETE",
      }),
    }),

    markBYIdAsRead: build.mutation({
      query: (notificationId) => ({
        url: `/admin/readNotification/${notificationId}`,
        method: "PATCH",
      }),
    }),

    changePassword: build.mutation({
      query: ({ body, token }) => ({
        url: "/auth/change-password",
        method: "put",
        body,
        headers: {
          Authorization: `${token}`,
        },
      }),
    }),
  }),
});

export const {
  useFetchAdminInfoQuery,
  useUpdateAdminInfoMutation,
  useChangePasswordMutation,
  useFetchAdminStatsQuery,
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useSuspendUserMutation,
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkBYIdAsReadMutation,
  useDeleteAllNotificationsMutation,
} = adminApi;
