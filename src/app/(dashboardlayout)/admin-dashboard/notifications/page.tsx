"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, Search, UserPlus, User, DollarSign, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Dummy notification data
const notifications = Array.from({ length: 203 }, (_, i) => {
  const types = [
    {
      title: "New User Registration",
      description: "Users Registered Successfully",
      icon: UserPlus,
      color: "text-blue-500 bg-blue-50",
      read: false, 
    },
    {
      title: "User Finished Phase 2",
      description: "A User Finished Phase 2 In Time",
      icon: User,
      color: "text-blue-500 bg-blue-50",
      read: true, 
    },
    {
      title: "User Profile Update",
      description: "User profile updated",
      icon: User,
      color: "text-blue-500 bg-blue-50",
      read: false, 
    },
    {
      title: "New User Subscribed",
      description: "A New User Paid For The Subscription",
      icon: DollarSign,
      color: "text-green-500 bg-green-50",
      read: false, 
    },
    {
      title: "System Alert: Payment Failure",
      description: "Payment failure detected",
      icon: AlertTriangle,
      color: "text-orange-500 bg-orange-50",
      read: false, 
    },
  ]

  const type = types[i % types.length]
  return {
    id: i + 1,
    title: type.title,
    description: type.description,
    time: "10 Minute Ago",
    icon: type.icon,
    color: type.color,
    read: true,
  }
})

const ROWS_PER_PAGE = 6

export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [notificationTitle, setNotificationTitle] = useState("")
  const [notificationContent, setNotificationContent] = useState("")

  const totalPages = Math.ceil(notifications.length / ROWS_PER_PAGE)
  const startIndex = (page - 1) * ROWS_PER_PAGE
  const paginatedNotifications = notifications.slice(startIndex, startIndex + ROWS_PER_PAGE)
  const [notificationList, setNotificationList] = useState(notifications)

  const handleSendNotification = () => {
    console.log("Sending notification:", { notificationTitle, notificationContent })
    // Reset form
    setNotificationTitle("")
    setNotificationContent("")
  }

  const handleClearAll = () => {
    console.log("Clearing all notifications")
  }

  const handleMarkAllAsRead = () => {
    console.log("Marking all as read")
  }

  const handleMarkAsRead = (id: number) => {
  setNotificationList((prev) =>
    prev.map((n) => (n.id === id ? { ...n, read: true } : n))
  )
}

  return (
    <div className="p-6  mx-auto">
      {/* Send Notifications Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-6">Send Notifications</h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title Of The Notification</label>
            <input
             
              placeholder="In this week's message"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              className="w-full border-2 p-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">The Content Of The Notification</label>
            <div className="border-2  p-1">
              <Textarea
                placeholder="In this week's message"
                value={notificationContent}
                onChange={(e) => setNotificationContent(e.target.value)}
                className="min-h-[100px] border-0 focus:ring-0 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8" onClick={handleSendNotification}>
                Send Notification To <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Users</DropdownMenuItem>
              <DropdownMenuItem>Subscribed Users</DropdownMenuItem>
              <DropdownMenuItem>Free Users</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Notifications Section */}
      <div>
        <div className="sm:flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="flex items-center gap-4 mt-3 sm:mb-0">
            <h3 className="text-lg font-medium">Actions</h3>
            <div className="flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleClearAll}>
                Clear All
              </Button>
              <Button variant="outline" onClick={handleMarkAllAsRead}>
                Mark All As Read
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search Notification by keywords or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 mb-6">
          {paginatedNotifications.map((notification) => {
  const IconComponent = notification.icon
  return (
    <div
      key={notification.id}
      className={`rounded-lg p-4 flex items-start gap-4 cursor-pointer ${
        notification.read ? "bg-white" : "bg-blue-50"
      }`}
      onClick={() => handleMarkAsRead(notification.id)}
    >
      <div className={`p-2 rounded-full ${notification.color}`}>
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{notification.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{notification.time}</p>
        <p className="text-sm text-gray-700 mt-1">{notification.description}</p>
      </div>
    </div>
  )
})}

        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>
            Showing {page} of {totalPages} pages
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

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={page === pageNum ? "bg-blue-600 text-white" : ""}
                  variant={page === pageNum ? "default" : "outline"}
                >
                  {pageNum}
                </Button>
              )
            })}

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
    </div>
  )
}
