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
import { Search, ChevronDown } from "lucide-react";
import { useGetSubscribersPerMonthQuery } from "@/redux/features/subscriber/subscriberApiSlice";
import {
  useFetchAdminStatsQuery,
  useGetAllUsersQuery,
} from "@/redux/features/auth/adminSlice";

// ✅ Define User type
interface User {
  _id: string;
  fullName: string;
  email: string;
  subscribed: "SUBSCRIBED" | "FREE_USER";
  createdAt: string;
  phase?: number | null;
  profilePic?: string;
}

interface SubscriberData {
  month: string;
  subscribers: number;
}

interface CountryData {
  country: string;
  percent: number;
}

export default function Dashboard() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>(
    null
  );

  const { data, isLoading } = useGetSubscribersPerMonthQuery("");
  const { data: stats, isLoading: statsLoading } = useFetchAdminStatsQuery("");
  const { data: usersResponse } = useGetAllUsersQuery("");

  const allUsers: User[] = usersResponse?.data || [];

  // ✅ Filtering logic
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPhase = selectedPhase
        ? `Phase ${user.phase}` === selectedPhase
        : true;

      let matchesDate = true;
      if (selectedDateRange === "Last 7 days") {
        const diff =
          (Date.now() - new Date(user.createdAt).getTime()) /
          (1000 * 60 * 60 * 24);
        matchesDate = diff <= 7;
      }
      if (selectedDateRange === "Last 30 days") {
        const diff =
          (Date.now() - new Date(user.createdAt).getTime()) /
          (1000 * 60 * 60 * 24);
        matchesDate = diff <= 30;
      }

      return matchesSearch && matchesPhase && matchesDate;
    });
  }, [allUsers, searchTerm, selectedPhase, selectedDateRange]);

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

  // ✅ Merge API data with base months
  const chartData = allMonths.map((month) => {
    const found = data?.data?.find(
      (item: SubscriberData) => item.month === month
    );
    return { month, subscribers: found ? found.subscribers : 0 };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-4 md:mb-6">
          Hello Gabe, Welcome Back
        </h2>

        {/* ✅ Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {statsLoading ? "Loading..." : stats?.data?.totalUsers ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Subscriber
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {statsLoading
                  ? "Loading..."
                  : stats?.data?.totalSubscriptions ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                ${statsLoading ? "Loading..." : stats?.data?.totalRevenue ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                30 Days Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                $
                {statsLoading
                  ? "Loading..."
                  : stats?.data?.total_30_Revenue ?? 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ✅ Users Table */}
        <Card className="mb-6 md:mb-8">
          <CardHeader>
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-xl md:text-2xl font-semibold">
                New Users
              </CardTitle>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0066FF] h-4 w-4" />
                  <Input
                    placeholder="Search By User ID or Email"
                    className="pl-10 w-full sm:w-48 md:w-64 border-[#0066FF]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Phase Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-[#0066FF] border-[#0066FF] w-full sm:w-auto"
                    >
                      {selectedPhase || "Phase"}{" "}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedPhase(null)}>
                      All Phases
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedPhase("Phase 1")}
                    >
                      Phase 1
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedPhase("Phase 2")}
                    >
                      Phase 2
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedPhase("Phase 3")}
                    >
                      Phase 3
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Date Range Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-[#0066FF] border-[#0066FF] w-full sm:w-auto"
                    >
                      Date Range <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setSelectedDateRange("Last 7 days")}
                    >
                      Last 7 days
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedDateRange("Last 30 days")}
                    >
                      Last 30 days
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Name</TableHead>
                    <TableHead>Subscription Type</TableHead>
                    <TableHead>Joining Date</TableHead>
                    <TableHead>Phase Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.slice(-6).map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {user.fullName}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            user.subscribed === "SUBSCRIBED"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {user.subscribed === "SUBSCRIBED"
                            ? "Subscribed"
                            : "Free User"}
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* ✅ Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 md:gap-6">
          {/* User By Country */}
          <Card className="lg:col-span-4 xl:col-span-3">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                User By Country
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                {stats?.data.countryPercent
                  ?.slice(0, 6)
                  .map((item: CountryData, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 md:space-x-4"
                    >
                      <Avatar className="h-7 w-7 md:h-8 md:w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>
                          {item.country.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm md:text-base truncate">
                            {item.country || "Unknown"}
                          </span>
                          <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap ml-2">
                            {item.percent}%
                          </span>
                        </div>
                        <div
                          className={`w-full ${
                            item.percent < 30
                              ? "bg-[#FF24241A]"
                              : "bg-[#0E73001A]"
                          } h-2 rounded-full mt-1`}
                        >
                          <div
                            className={`${
                              item.percent < 30
                                ? "bg-[#FF2424]"
                                : "bg-[#0E7300]"
                            } h-2 rounded-full`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Subscriber Per Month */}
          <Card className="lg:col-span-6 xl:col-span-7">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                Subscriber Per Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading chart...</p>
              ) : (
                <div className="w-full h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#666" }}
                        interval={0}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#666" }}
                        domain={[0, 40]}
                        ticks={[0, 10, 20, 30, 40]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          fontSize: "12px",
                        }}
                        formatter={(value) => [value, "Subscribers"]}
                      />
                      <Bar
                        dataKey="subscribers"
                        fill="#2563eb"
                        radius={[6, 6, 0, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
