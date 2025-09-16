"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, Search } from "lucide-react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Dummy data (added more for demo)
const users = Array.from({ length: 20 }, (_, i) => ({
  name: `User ${i + 1}`,
  email: `user${i + 1}@gmail.com`,
  type: i % 2 === 0 ? "Subscribed" : "Free Users",
  date: "22/08/2025",
  phase: i % 2 === 0 ? "Phase 2" : "Phase 1",
  image: "/avatar1.png",
}))

const ROWS_PER_PAGE = 6

export default function UsersPage() {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(users.length / ROWS_PER_PAGE)

  const startIndex = (page - 1) * ROWS_PER_PAGE
  const paginatedUsers = users.slice(startIndex, startIndex + ROWS_PER_PAGE)

  return (
    <div className="p-6">
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-left">Users & Account</h1>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0066FF] h-4 w-4" />
            <Input
              placeholder="Search By User ID or Email"
              className="pl-10 w-full sm:w-64 border-[#0066FF]"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-[#0066FF] border-[#0066FF] justify-between w-full sm:w-auto bg-transparent"
              >
                Phase <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Phase 1</DropdownMenuItem>
              <DropdownMenuItem>Phase 2</DropdownMenuItem>
              <DropdownMenuItem>Phase 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border rounded-md overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-left">
            <tr className="border-b">
              <th className="px-4 py-3 font-medium">User Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">User Type</th>
              <th className="px-4 py-3 font-medium">Joining Date</th>
              <th className="px-4 py-3 font-medium">Phase Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="px-4 py-5 flex items-center gap-3">
                  <img src={u.image} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                  <span>{u.name}</span>
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td
                  className={`px-4 py-3 font-medium ${
                    u.type === "Subscribed" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {u.type}
                </td>
                <td className="px-4 py-3">{u.date}</td>
                <td
                  className={`px-4 py-3 font-medium ${
                    u.phase === "Phase 2" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {u.phase}
                </td>
                <td className="px-4 py-3 text-blue-600 cursor-pointer">
  <Link href={`/user-information/${i+1}`}>Profile</Link>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <p>
          Showing page {page} of {totalPages}
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
  )
}
