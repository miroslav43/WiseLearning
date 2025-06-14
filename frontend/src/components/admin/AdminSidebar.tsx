import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Award,
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Coins,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  School,
  Settings,
  Star,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import BrandLogo from "../navigation/BrandLogo";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      path: "/admin/courses",
      label: "Courses",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      path: "/admin/tutoring",
      label: "Tutoring",
      icon: <School className="h-5 w-5" />,
    },
    {
      path: "/admin/achievements",
      label: "Achievements",
      icon: <Award className="h-5 w-5" />,
    },
    {
      path: "/admin/reviews",
      label: "Reviews",
      icon: <Star className="h-5 w-5" />,
    },
    {
      path: "/admin/points",
      label: "Points",
      icon: <Coins className="h-5 w-5" />,
    },
    {
      path: "/admin/subscriptions",
      label: "Subscriptions",
      icon: <Package className="h-5 w-5" />,
    },
    {
      path: "/admin/blog",
      label: "Blog Posts",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      path: "/admin/announcements",
      label: "Announcements",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-border flex flex-col transition-all duration-300 relative shadow-sm",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <div
          className={cn(
            "transition-opacity duration-300",
            collapsed ? "opacity-0 w-0" : "opacity-100"
          )}
        >
          <BrandLogo />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full hover:bg-gray-100 bg-white shadow-md absolute -right-4 top-6 z-10"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <Separator className="my-2" />
      <div className="flex-1 overflow-auto py-2 scrollbar-none">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            // Check if the current path matches the item path
            const isItemActive =
              location.pathname === item.path ||
              (item.path !== "/admin" &&
                location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2.5 text-sm rounded-md transition-all duration-200",
                    "hover:bg-gray-100 group",
                    isActive
                      ? "bg-brand-800 text-white font-medium shadow-sm"
                      : "text-gray-700",
                    collapsed ? "justify-center" : "justify-start"
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <span
                  className={cn(
                    "transition-all duration-200",
                    !isItemActive && "group-hover:text-brand-800"
                  )}
                >
                  {item.icon}
                </span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className={cn("p-4", collapsed ? "px-2" : "")}>
        <Button
          variant="outline"
          className={cn(
            "w-full text-gray-700 hover:bg-gray-100 hover:text-brand-800 border-gray-200",
            collapsed ? "justify-center px-0" : "justify-start"
          )}
          title={collapsed ? "Logout" : undefined}
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
