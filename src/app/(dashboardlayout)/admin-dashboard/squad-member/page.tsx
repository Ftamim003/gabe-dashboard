"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreHorizontal, Search } from "lucide-react";
import { useGetAllUsersQuery } from "@/redux/features/auth/adminSlice";

const ROWS_PER_PAGE = 6;

// Define types for the user data
interface Mission {
  squad?: string;
}

interface User {
  fullName: string;
  email: string;
  phase: number;
  missions?: Mission[];
  subscribed: string;
}

interface UsersResponse {
  data: User[];
}

export default function SquadMember() {
  const { data: usersResponse, isLoading } = useGetAllUsersQuery("");
  const users = (usersResponse as UsersResponse)?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectedSquad, setSelectedSquad] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // ✅ Filtering Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
      const squad = user.missions?.[0]?.squad || null;

      // search by name or email
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      // phase filter
      const matchesPhase = selectedPhase
        ? `Phase ${user.phase}` === selectedPhase
        : true;

      // squad filter
      const matchesSquad = selectedSquad ? squad === selectedSquad : true;

      return matchesSearch && matchesPhase && matchesSquad;
    });
  }, [users, searchTerm, selectedPhase, selectedSquad]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  );

  if (isLoading) return <p className="p-6">Loading squad members...</p>;

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-2xl font-semibold">
            Squad Members
          </CardTitle>

          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0066FF] h-4 w-4" />
              <Input
                placeholder="Search By Name or Email"
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

            {/* Squad Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-[#0066FF] border-[#0066FF]"
                >
                  {selectedSquad || "Squad"}{" "}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedSquad(null)}>
                  All Squads
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSquad("Lone Wolf")}>
                  Lone Wolf (Solo)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSquad("Guardian")}>
                  Guardian (Parents)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSquad("Warrior")}>
                  Warrior (Tactical)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSquad("Rebuilder")}>
                  Rebuilder (Injury Recovery)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>User Type</TableHead>
              <TableHead>Phase Status</TableHead>
              <TableHead>Squad</TableHead>
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  No squad members found
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user: User, index: number) => {
                const squad = user.missions?.[0]?.squad || "N/A";
                return (
                  <TableRow key={index} className="py-1">
                    <TableCell className="font-medium">
                      {user.fullName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
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
                    <TableCell>{squad}</TableCell>
                    {/* <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell> */}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

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
      </CardContent>
    </Card>
  );
}
