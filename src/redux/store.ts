import { configureStore } from "@reduxjs/toolkit";
import { baseUrlApi } from "./api/baseUrlApi";

import userDataReducer from "./features/auth/userDataCatchSlice";
import adminReducer from "./features/auth/adminSlice"
import resetEmailReducer from "@/redux/features/auth/resetEmailSlice";
import subscriberReducer from "./features/subscriber/subscriberApiSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      // data manage
      
      user: userDataReducer,
      admin: adminReducer,
      resetEmail: resetEmailReducer,
      subscriber: subscriberReducer,
      // api call middleware
      [baseUrlApi.reducerPath]: baseUrlApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(baseUrlApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
