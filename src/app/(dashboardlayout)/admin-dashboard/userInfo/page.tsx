"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

import { useGetAllUsersQuery } from "@/redux/features/auth/adminSlice";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ROWS_PER_PAGE = 6;

// Define types for the user data
interface User {
  id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  subscribed: string;
  phase: number;
  createdAt: string;
}

interface UsersResponse {
  data: User[];
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data: usersResponse, isLoading: loading } = useGetAllUsersQuery("");

  // Cast the response to our expected type and provide fallback
  const users = (usersResponse as UsersResponse)?.data || [];

  console.log("Fetched Users:", users);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>(
    null
  );

  // ✅ Filtering Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
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
  }, [users, searchTerm, selectedPhase, selectedDateRange]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  );

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <div className="p-6">
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-left">Users & Account</h1>

        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0066FF] h-4 w-4" />
            <Input
              placeholder="Search By User ID or Email"
              className="pl-10 w-full sm:w-64 border-[#0066FF]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
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

          {/* Date Filter */}
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

      {/* Table */}
      <Card className="w-full">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subscription Type</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Phase Status</TableHead>
                <TableHead>View Profile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user: User, index: number) => (
                  <TableRow key={index}>
                    {/* User avatar + name */}
                    <TableCell className="w-30 mx-auto font-medium flex items-center gap-2">
                      <Image
                        src={user.profilePic || "/avatar1.png"}
                        alt={user.fullName}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                        unoptimized
                      />
                      <span>{user.fullName}</span>
                    </TableCell>

                    {/* Email */}
                    <TableCell>{user.email}</TableCell>

                    {/* User Type */}
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

                    {/* Joining Date */}
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* Phase Status */}
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

                    {/* Actions */}
                    <TableCell className="text-blue-600 cursor-pointer">
                      <Link
                        href={`/admin-dashboard/user-information/${user.id}`}
                      >
                        Profile
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <p>
          Showing page {page} of {totalPages || 1}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              size="sm"
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? "bg-[#0066FF] text-white" : ""}
              variant={page === i + 1 ? "default" : "outline"}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
