import PointsManagement from "@/components/admin/points/PointsManagement";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, Navigate } from "react-router-dom";

const PointsPage: React.FC = () => {
  const { user } = useAuth();

  // Redirect non-admin users
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestionare puncte
        </h1>
        <Button variant="outline" asChild className="self-start sm:self-auto">
          <Link to="/admin" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Înapoi la panou
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl">12,580</CardTitle>
            <CardDescription>Total puncte emise</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              +15% față de luna trecută
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl">8,350</CardTitle>
            <CardDescription>Puncte cheltuite</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              +23% față de luna trecută
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl">4,230</CardTitle>
            <CardDescription>Puncte active</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              33.6% din totalul punctelor
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
          <CardTitle>Gestionare puncte</CardTitle>
          <CardDescription>
            Administrează pachetele de puncte și vizualizează tranzacțiile
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <PointsManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default PointsPage;
