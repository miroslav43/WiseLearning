import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const CourseLoadingState = () => {
  return (
    <div className="container mx-auto py-6 sm:py-8 px-4">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-3/4 mb-2" />
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          {/* Course image skeleton */}
          <Skeleton className="aspect-video w-full mb-6 lg:mb-8" />

          <div className="space-y-6 lg:space-y-8">
            {/* Learning points skeleton */}
            <div>
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>

            <Separator />

            {/* Topics skeleton */}
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-6 w-5/6 mb-3" />
                    <div className="pl-4 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-3/5" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Reviews skeleton */}
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Skeleton key={star} className="h-4 w-4 mr-1" />
                      ))}
                    </div>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-5/6 mb-1" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="lg:col-span-1 order-1 lg:order-2 mb-6 lg:mb-0">
          <Card className="p-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="pt-4 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-4/6" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseLoadingState;
