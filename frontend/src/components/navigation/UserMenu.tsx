import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import PointsDisplay from "../points/PointsDisplay";
import UserDropdown from "./UserDropdown";

export default function UserMenu() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex gap-2">
        <Link to="/login">
          <Button variant="outline">Conectare</Button>
        </Link>
        <Link to="/register">
          <Button>Înregistrare</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <PointsDisplay variant="compact" />
      <UserDropdown />
    </div>
  );
}
