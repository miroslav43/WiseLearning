import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const TutorCardSkeleton = () => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border border-gray-200">
      <div className="relative">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="absolute -bottom-6 left-4 h-16 w-16 rounded-full" />
        <Skeleton className="absolute top-4 right-4 h-6 w-24" />
      </div>

      <CardContent className="pt-10 pb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>

        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
};

export const TutoringSessionCardSkeleton = () => {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <div className="flex items-start gap-3 mb-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface TutoringLoadingStateProps {
  count?: number;
  type?: "tutor" | "session";
}

const TutoringLoadingState = ({
  count = 6,
  type = "tutor",
}: TutoringLoadingStateProps) => {
  const SkeletonComponent =
    type === "tutor" ? TutorCardSkeleton : TutoringSessionCardSkeleton;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <SkeletonComponent key={index} />
        ))}
    </div>
  );
};

export default TutoringLoadingState;
