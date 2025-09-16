'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";

export default function SquadMember() {
  const userData = [
    { name: "Al Muntakim", type: "Subscribed", phase: "Phase 2", squad: "Lone Wolf" },
    { name: "Al Muntakim", type: "Free User", phase: "Phase 1", squad: "Guardian" },
    { name: "Al Muntakim", type: "Subscribed", phase: "Phase 2", squad: "Warrior" },
    { name: "Al Muntakim", type: "Subscribed", phase: "Phase 2", squad: "Rebuilder" },
    { name: "Al Muntakim", type: "Subscribed", phase: "Phase 2", squad: "Lone Wolf" },
    { name: "Al Muntakim", type: "Subscribed", phase: "Phase 3", squad: "Warrior" },
  ];

  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectedSquad, setSelectedSquad] = useState<string | null>(null);

  // Filter users based on selectedPhase and selectedSquad
  const filteredUsers = userData.filter((user) => {
    return (
      (!selectedPhase || user.phase === selectedPhase) &&
      (!selectedSquad || user.squad === selectedSquad)
    );
  });

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-2xl font-semibold">Squad Members</CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0066FF] h-4 w-4" />
              <Input
                placeholder="Search By User ID or Email"
                className="pl-10 w-full sm:w-64 border-[#0066FF]"
              />
            </div>

            {/* Phase Selection */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-[#0066FF] border-[#0066FF]">
                  {selectedPhase || "Phase"} <ChevronDown className="ml-2 h-4 w-4" />
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

            {/* Squad Selection */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-[#0066FF] border-[#0066FF]">
                  {selectedSquad || "Squad"} <ChevronDown className="ml-2 h-4 w-4" />
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
              <TableHead>User Type</TableHead>
              <TableHead>Phase Status</TableHead>
              <TableHead>Squad</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  <span
                    className={
                      user.type === "Subscribed" ? "text-red-600" : "text-green-600"
                    }
                  >
                    {user.type}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      user.phase === "Phase 2"
                        ? "text-red-600"
                        : user.phase === "Phase 3"
                        ? "text-blue-600"
                        : "text-green-600"
                    }
                  >
                    {user.phase}
                  </span>
                </TableCell>
                <TableCell>{user.squad}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
