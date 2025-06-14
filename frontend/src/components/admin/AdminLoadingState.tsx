import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const AdminStatsSkeleton = () => {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="h-80">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="h-80">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const AdminTableSkeleton = ({ rowCount = 5, columnCount = 4 }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array(columnCount)
              .fill(0)
              .map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-5 w-24" />
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(rowCount)
            .fill(0)
            .map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array(columnCount)
                  .fill(0)
                  .map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      {colIndex === 0 ? (
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      ) : colIndex === columnCount - 1 ? (
                        <div className="flex justify-end space-x-2">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      ) : (
                        <Skeleton className="h-4 w-full max-w-[120px]" />
                      )}
                    </TableCell>
                  ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const AdminFormSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>

      <div className="flex justify-end space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
};

export const AdminCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </CardContent>
    </Card>
  );
};

interface AdminLoadingStateProps {
  type: "stats" | "table" | "form" | "card";
  rowCount?: number;
  columnCount?: number;
}

const AdminLoadingState = ({
  type,
  rowCount = 5,
  columnCount = 4,
}: AdminLoadingStateProps) => {
  switch (type) {
    case "stats":
      return <AdminStatsSkeleton />;
    case "table":
      return (
        <AdminTableSkeleton rowCount={rowCount} columnCount={columnCount} />
      );
    case "form":
      return <AdminFormSkeleton />;
    case "card":
      return <AdminCardSkeleton />;
    default:
      return (
        <AdminTableSkeleton rowCount={rowCount} columnCount={columnCount} />
      );
  }
};

export default AdminLoadingState;
