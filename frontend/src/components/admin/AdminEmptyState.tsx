import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RefreshCw, Search } from "lucide-react";
import React from "react";

interface AdminEmptyStateProps {
  title: string;
  description: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  title,
  description,
  showRefresh = false,
  onRefresh,
  icon,
  action,
}) => {
  return (
    <Card className="border-dashed">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-muted p-4">
            {icon || <Search className="h-8 w-8 text-muted-foreground" />}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <div className="flex gap-2">
          {showRefresh && onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reîncarcă
            </Button>
          )}
          {action}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminEmptyState;
