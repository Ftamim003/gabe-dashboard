
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseUrlApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    
    baseUrl: "http://206.162.244.131:5410/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});
