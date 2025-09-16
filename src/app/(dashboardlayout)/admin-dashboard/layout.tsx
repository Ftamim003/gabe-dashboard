"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // <-- get current path
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Menu, X, LogOut, Bell, LayoutDashboard, Users, CreditCard, Upload, Video, Settings } from "lucide-react";
import { useDispatch } from "react-redux";

import { clearUser } from "@/redux/features/auth/userDataCatchSlice";
import { useFetchAdminInfoQuery } from "@/redux/features/auth/adminSlice";



const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin-dashboard/dashboard" },
  { icon: Users, label: "Users And Account", href: "/admin-dashboard/userInfo" },
  { icon: Users, label: "Squad Members", href: "/admin-dashboard/squad-member" },
  { icon: CreditCard, label: "Subscription Plan", href: "/admin-dashboard/subscription-plan" },
  { icon: Upload, label: "Upload Audio", href: "/admin-dashboard/upload-audio" },
  { icon: Video, label: "Upload Video", href: "/admin-dashboard/upload-video" },
  { icon: Settings, label: "Settings", href: "/admin-dashboard/admin-information" },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: adminInfo } = useFetchAdminInfoQuery(""); 

  //const adminInfo = useSelector((state: any) => state.admin.adminInfo);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname(); // get current route

  const dispatch = useDispatch();
  const router = useRouter();

    const handleLogout = () => {
    // 1. Clear redux user state
    dispatch(clearUser());

    // 2. Clear tokens if stored in localStorage
    localStorage.removeItem("accessToken");

    // 3. Redirect to login page
    router.push("/login");
  };


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 text-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ backgroundColor: "rgba(242, 242, 242, 1)" }}
      >
        <div className="flex items-center justify-between p-4 border-gray-300">
          <h1 className="text-xl font-bold text-gray-800">Pr3detor Fitness</h1>
          <Button variant="ghost" size="sm" className="lg:hidden text-gray-800 hover:bg-gray-300" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href; // check if current route matches href
            return (
              <Link 
              key={index} 
              href={item.href || "#"}
              onClick={() => setSidebarOpen(false)}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`cursor-pointer w-full justify-start text-left ${isActive ? "bg-[#FFFFFF] text-blue-600 " : "text-gray-700 hover:bg-gray-300 hover:text-gray-800"}`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-300">
           <Button
        onClick={handleLogout}
        variant="ghost"
        className="cursor-pointer w-full justify-start text-gray-700 hover:bg-gray-300 hover:text-gray-800"
      >
        <LogOut className="mr-3 h-5 w-5" />
        Log Out
      </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                <Link href='/admin-dashboard/notifications'><Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">4</Badge></Link>
              </div>
              <Avatar>
                 <AvatarImage src={adminInfo?.data.profilePic || "/placeholder.svg?height=40&width=40"} />
                 <AvatarFallback>{adminInfo?.data.fullName?.[0] || "A"}</AvatarFallback>
               </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
