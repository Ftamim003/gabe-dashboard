import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Your user data interface
export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
  isVerified?: boolean;
  role?: "ENGINEER" | "ADMIN" | "USER" | string;
  status?: "ACTIVE" | "INACTIVE" | "PENDING" | string;
  teeRegistration?: string;
  vatNumber?: string;
  hexToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface InitialState {
  userData: UserData | {};
}

const initialState: InitialState = {
  userData: {},
};

const userDataCatach = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    clearUser: () => initialState,
  },
});

export const { setUserData,clearUser } = userDataCatach.actions;

export default userDataCatach.reducer;
