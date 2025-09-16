import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ResetEmailState {
  email: string;
}

const initialState: ResetEmailState = {
  email: "",
};

export const resetEmailSlice = createSlice({
  name: "resetEmail",
  initialState,
  reducers: {
    setResetEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearResetEmail: (state) => {
      state.email = "";
    },
  },
});

export const { setResetEmail, clearResetEmail } = resetEmailSlice.actions;
export default resetEmailSlice.reducer;
