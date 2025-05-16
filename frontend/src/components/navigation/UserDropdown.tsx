import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import useUser from "@/hooks/useUser";
import { Loader2, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function UserDropdown() {
  const { logout } = useAuth();
  const { user, isAdmin, isTeacher, isStudent } = useUser();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If no user, don't render anything
  if (!user) return null;

  const handleLogout = () => {
    setIsLoggingOut(true);
    try {
      logout();
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user.name) return "U";
    return user.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (isAdmin) return "/admin";
    if (isTeacher) return "/teacher/courses";
    return "/my-courses";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.avatar || ""} alt={user.name} />
            <AvatarFallback className="bg-brand-500 text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
            <User className="mr-2 h-4 w-4" />
            <span>Panou personal</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/profile">
              <Settings className="mr-2 h-4 w-4" />
              <span>Setări profil</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>{isLoggingOut ? "Se deconectează..." : "Deconectare"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
