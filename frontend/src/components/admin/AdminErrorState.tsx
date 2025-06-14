import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import React, { useState } from "react";

interface AdminErrorStateProps {
  title: string;
  message: string;
  error?: string | Error;
  onRetry?: () => void;
  showDetails?: boolean;
}

const AdminErrorState: React.FC<AdminErrorStateProps> = ({
  title,
  message,
  error,
  onRetry,
  showDetails = false,
}) => {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4 pb-6">
        <div className="flex gap-2">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Încearcă din nou
            </Button>
          )}
          {error && (showDetails || errorMessage) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowErrorDetails(!showErrorDetails)}
            >
              {showErrorDetails ? "Ascunde detaliile" : "Vezi detaliile"}
            </Button>
          )}
        </div>

        {showErrorDetails && errorMessage && (
          <div className="w-full max-w-2xl">
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground font-mono break-all">
                {errorMessage}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminErrorState;
