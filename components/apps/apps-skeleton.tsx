import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AppsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card
          key={i}
          className="bg-gradient-to-br from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-black/50">
                <Skeleton className="h-4 w-12" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
              <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-black/50">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
