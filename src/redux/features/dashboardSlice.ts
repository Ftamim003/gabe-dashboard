import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { baseUrlApi } from "../api/baseUrlApi";


// User interface
export interface User {
  id: string;
  name: string;
  type: "Subscribed" | "Free User";
  date: string;
  phase: string;
}

// Stats interface
export interface DashboardStats {
  totalUsers: number;
  totalSubscribers: number;
  revenue30Days: number;
  newCustomers: number;
}

// Chart interface
export interface ChartPoint {
  month: string;
  subscribers: number;
}

// Country interface
export interface CountryData {
  country: string;
  percentage: number;
}

// State
interface DashboardState {
  stats: DashboardStats | null;
  users: User[];
  chart: ChartPoint[];
  countries: CountryData[];
}

const initialState: DashboardState = {
  stats: null,
  users: [],
  chart: [],
  countries: [],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setChart: (state, action: PayloadAction<ChartPoint[]>) => {
      state.chart = action.payload;
    },
    setCountries: (state, action: PayloadAction<CountryData[]>) => {
      state.countries = action.payload;
    },
  },
});

export const { setStats, setUsers, setChart, setCountries } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;

// 🔹 RTK Query endpoints
export const dashboardApi = baseUrlApi.injectEndpoints({
  endpoints: (build) => ({
    fetchStats: build.query<DashboardStats, void>({
      query: () => "/dashboard/stats",
    }),
    fetchUsers: build.query<User[], void>({
      query: () => "/dashboard/users",
    }),
    fetchChart: build.query<ChartPoint[], void>({
      query: () => "/dashboard/chart",
    }),
    fetchCountries: build.query<CountryData[], void>({
      query: () => "/dashboard/countries",
    }),
  }),
});

export const {
  useFetchStatsQuery,
  useFetchUsersQuery,
  useFetchChartQuery,
  useFetchCountriesQuery,
} = dashboardApi;
