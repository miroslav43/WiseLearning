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
import {
  Award,
  BookOpen,
  Bookmark,
  Calendar,
  Coins,
  CreditCard,
  Gauge,
  Heart,
  Loader2,
  LogOut,
  MessageCircle,
  Settings,
  Star,
  Trophy,
  User,
  Users,
} from "lucide-react";
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

        {/* Role-specific menu items */}
        {isStudent && (
          <DropdownMenuGroup>
            <Link to="/dashboard/student">
              <DropdownMenuItem>
                <Gauge className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/my-courses">
              <DropdownMenuItem>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Cursurile mele</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/my-saved-courses">
              <DropdownMenuItem>
                <Bookmark className="mr-2 h-4 w-4" />
                <span>Cursuri salvate</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/my-points">
              <DropdownMenuItem>
                <Coins className="mr-2 h-4 w-4" />
                <span>Punctele mele</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/my-achievements">
              <DropdownMenuItem>
                <Trophy className="mr-2 h-4 w-4" />
                <span>Realizările mele</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/my-certificates">
              <DropdownMenuItem>
                <Award className="mr-2 h-4 w-4" />
                <span>Certificatele mele</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/my-tutoring">
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                <span>Meditațiile mele</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        )}

        {isTeacher && (
          <DropdownMenuGroup>
            <Link to="/dashboard/teacher">
              <DropdownMenuItem>
                <Gauge className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/teacher/profile">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profilul meu de profesor</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/my-courses/manage">
              <DropdownMenuItem>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Cursurile mele</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/my-students">
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Studenții mei</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/my-tutoring/manage">
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                <span>Meditațiile mele</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/teacher/reviews">
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" />
                <span>Recenziile mele</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        )}

        {isAdmin && (
          <DropdownMenuGroup>
            <Link to="/admin">
              <DropdownMenuItem>
                <Gauge className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        )}

        <DropdownMenuSeparator />

        {/* Common menu items for all users */}
        <DropdownMenuGroup>
          <Link to="/messaging">
            <DropdownMenuItem>
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>Mesaje</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/calendar">
            <DropdownMenuItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/subscriptions">
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Abonamente</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/profile">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profilul meu</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/settings">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Setări</span>
            </DropdownMenuItem>
          </Link>
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
