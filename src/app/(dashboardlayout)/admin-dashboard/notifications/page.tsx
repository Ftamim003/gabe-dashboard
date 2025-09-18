"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, DollarSign, AlertTriangle } from "lucide-react";
import { useState } from "react";
import {
  useDeleteAllNotificationsMutation,
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkBYIdAsReadMutation,
} from "@/redux/features/auth/adminSlice";

const ROWS_PER_PAGE = 6;

// Define types for the notification data
interface NotificationContent {
  fullName?: string;
  email?: string;
  userName?: string;
  planName?: string;
  amount?: string | number;
}

interface Notification {
  id: string;
  type: string;
  content: NotificationContent;
  createdAt: string;
  read: boolean;
}

interface NotificationsResponse {
  data: Notification[];
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [markBYIdAsRead] = useMarkBYIdAsReadMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();

  // ✅ Fetch notifications with proper typing
  const { data: notifications, isLoading } = useGetNotificationsQuery("un", {
    pollingInterval: 100,
  });

  // Cast the response to our expected type and provide fallback
  const notificationsData =
    (notifications as NotificationsResponse)?.data || [];
  const filtered = notificationsData.filter((n: Notification) => {
    const text = JSON.stringify(n).toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const paginatedNotifications = filtered.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  );

  const handleClearAll = () => {
    console.log("Clearing all notifications");
    deleteAllNotifications({}).unwrap();
    console.log("✅ All notifications cleared");
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead({}).unwrap();
      console.log("✅ All notifications marked as read");
    } catch (error) {
      console.error("❌ Failed to mark as read", error);
    }
  };

  const handleMarkAsRead = (id: string) => {
    console.log("Mark as read:", id);
    try {
      markBYIdAsRead(id).unwrap();
      console.log("✅ Notification marked as read:", id);
    } catch (error) {
      console.error("❌ Failed to mark as read", error);
    }
  };

  if (isLoading) return <p className="p-6">Loading notifications...</p>;

  return (
    <div className="p-6 mx-auto">
      {/* Notifications Section */}
      <div>
        <div className="sm:flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="flex items-center gap-4 mt-3 sm:mb-0">
            <h3 className="text-lg font-medium">Actions</h3>
            <div className="flex gap-2">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="cursor-pointer"
              >
                Mark All As Read
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
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
          {paginatedNotifications.map((notification: Notification) => {
            // pick icon based on type
            let IconComponent = AlertTriangle;
            let color = "text-orange-500 bg-orange-50";
            let title = notification.type;

            if (notification.type === "USER REGISTERED") {
              IconComponent = UserPlus;
              color = "text-blue-500 bg-blue-50";
              title = "New User Registration";
            }
            if (notification.type === "SUBSCRIPTION SUCCESS") {
              IconComponent = DollarSign;
              color = "text-green-500 bg-green-50";
              title = "New Subscription";
            }

            return (
              <div
                key={notification.id}
                className={`rounded-lg p-4 flex items-start gap-4 cursor-pointer ${
                  notification.read ? "bg-white" : "bg-blue-50"
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className={`p-2 rounded-full ${color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {/* Show extra content dynamically */}
                    {notification.type === "USER REGISTERED" &&
                      `${notification.content.fullName || ""} (${
                        notification.content.email || ""
                      }) registered.`}

                    {notification.type === "SUBSCRIPTION SUCCESS" &&
                      `${notification.content.userName || ""} subscribed to ${
                        notification.content.planName || ""
                      } ($${notification.content.amount || ""})`}

                    {notification.type !== "USER REGISTERED" &&
                      notification.type !== "SUBSCRIPTION SUCCESS" &&
                      JSON.stringify(notification.content)}
                  </p>
                </div>
              </div>
            );
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
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
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
              );
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
  );
}
