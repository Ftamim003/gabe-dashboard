"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Search, ChevronDown, MoreHorizontal } from "lucide-react";
import { useGetSubscribersPerMonthQuery } from "@/redux/features/subscriber/subscriberApiSlice";
import {
  useFetchAdminStatsQuery,
  useGetAllUsersQuery,
} from "@/redux/features/auth/adminSlice";
import moment from "moment";

const userData = [
  {
    name: "Al Muntakim",
    type: "Subscribed",
    date: "22/08/2025",
    phase: "Phase 2",
  },
  {
    name: "Al Muntakim",
    type: "Free User",
    date: "22/08/2025",
    phase: "Phase 1",
  },
  {
    name: "Al Muntakim",
    type: "Subscribed",
    date: "22/08/2025",
    phase: "Phase 2",
  },
  {
    name: "Al Muntakim",
    type: "Subscribed",
    date: "22/08/2025",
    phase: "Phase 2",
  },
  {
    name: "Al Muntakim",
    type: "Subscribed",
    date: "22/08/2025",
    phase: "Phase 2",
  },
  {
    name: "Al Muntakim",
    type: "Subscribed",
    date: "22/08/2025",
    phase: "Phase 2",
  },
];

const countryData = [
  { country: "USA", percentage: 40 },
  { country: "USA", percentage: 20 },
  { country: "USA", percentage: 70 },
  { country: "USA", percentage: 20 },
  { country: "USA", percentage: 70 },
  { country: "USA", percentage: 70 },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const { data, isLoading } = useGetSubscribersPerMonthQuery("");
  const { data: stats, isLoading: statsLoading } = useFetchAdminStatsQuery("");
  const { data: usersResponse, isLoading : loading } = useGetAllUsersQuery();
  const allUsers = usersResponse?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>(null);

  // ✅ Filtering logic
  
 const filteredUsers = useMemo(() => {
    return allUsers.filter((user: any) => {
      // Search filter (by email or name)
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Phase filter
      const matchesPhase = selectedPhase
        ? `Phase ${user.phase}` === selectedPhase
        : true;

      // Date filter
      let matchesDate = true;
      if (selectedDateRange === "Last 7 days") {
        const diff =
          (new Date().getTime() - new Date(user.createdAt).getTime()) /
          (1000 * 60 * 60 * 24);
        matchesDate = diff <= 7;
      }
      if (selectedDateRange === "Last 30 days") {
        const diff =
          (new Date().getTime() - new Date(user.createdAt).getTime()) /
          (1000 * 60 * 60 * 24);
        matchesDate = diff <= 30;
      }

      return matchesSearch && matchesPhase && matchesDate;
    });
  }, [allUsers, searchTerm, selectedPhase, selectedDateRange]);

  console.log(stats);
  //const chartData = data?.data || [];
  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  interface SubscriberData {
    month: string;
    subscribers: number;
  }

  // Merge API data with base months
  const chartData = allMonths.map((month) => {
    const found = data?.data?.find(
      (item: SubscriberData) => item.month === month
    );
    return {
      month,
      subscribers: found ? found.subscribers : 0,
    };
  });
  // Filter users based on selectedPhase
  // const filteredUsers = selectedPhase
  //   ? userData.filter((user) => user.phase === selectedPhase)
  //   : userData;
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-white/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">
            Hello Gabe, Welcome Back
          </h2>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? "Loading..." : stats?.data?.totalUsers ?? 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Subscriber
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {" "}
                  {statsLoading
                    ? "Loading..."
                    : stats?.data?.totalSubscriptions ?? 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? "Loading..." : stats?.data?.totalRevenue ?? 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  30 Days Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading
                    ? "Loading..."
                    : stats?.data?.total_30_Revenue ?? 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* New Users Table */}
          <Card className="mb-8">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-2xl font-semibold">New Users</CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0066FF] h-4 w-4" />
              <Input
                placeholder="Search By User ID or Email"
                className="pl-10 w-full sm:w-64 border-[#0066FF]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Phase Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-[#0066FF] border-[#0066FF]"
                >
                  {selectedPhase || "Phase"}{" "}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedPhase(null)}>
                  All Phases
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPhase("Phase 1")}>
                  Phase 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPhase("Phase 2")}>
                  Phase 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPhase("Phase 3")}>
                  Phase 3
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Range Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-[#0066FF] border-[#0066FF] justify-between w-full sm:w-auto bg-transparent"
                >
                  Date Range <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedDateRange("Last 7 days")}>
                  Last 7 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedDateRange("Last 30 days")}>
                  Last 30 days
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {/* Table */}
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Subscription Type</TableHead>
              <TableHead>Joining Date</TableHead>
              <TableHead>Phase Status</TableHead>
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
  {filteredUsers
    .slice(-6) // ✅ only take the first 6 users
    .map((user: any, index: number) => (
      <TableRow key={index}>
        <TableCell className="font-medium">{user.fullName}</TableCell>
        <TableCell>
          <span
            className={
              user.subscribed === "SUBSCRIBED"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {user.subscribed === "SUBSCRIBED" ? "Subscribed" : "Free User"}
          </span>
        </TableCell>
        <TableCell>
          {new Date(user.createdAt).toLocaleDateString()}
        </TableCell>
        <TableCell>
  <span
    className={
      user.phase === 3
        ? "text-blue-600"
        : user.phase === 2
        ? "text-red-600"
        : "text-green-600"
    }
  >
    {user.phase ? `Phase ${user.phase}` : "No Phase"}
  </span>
</TableCell>
        {/* <TableCell>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </TableCell> */}
      </TableRow>
    ))}
</TableBody>
        </Table>
      </CardContent>
    </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* User By Country */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-2xl">User By Country</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {countryData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>US</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.country}</span>
                          <span className="text-sm text-gray-600">
                            {item.percentage}%
                          </span>
                        </div>
                        <div
                          className={`w-full ${
                            item.percentage < 30
                              ? "bg-[#FF24241A]"
                              : "bg-[#0E73001A]"
                          } h-2 rounded-full`}
                        >
                          <div
                            className={`${
                              item.percentage < 30
                                ? "bg-[#FF2424]"
                                : "bg-[#0E7300]"
                            } h-2 rounded-full`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subscriber Per Month */}
            <Card className="lg:col-span-7">
              <CardHeader>
                <CardTitle className="text-2xl">Subscriber Per Month</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading chart...</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#666" }}
                        interval={0} // ✅ Show all months
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#666" }}
                        domain={[0, 40]}
                        ticks={[0, 10, 20, 30, 40]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value) => [value, "Subscribers"]}
                      />
                      <Bar
                        dataKey="subscribers"
                        fill="#2563eb"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
