import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-[#038f90] overflow-hidden">
      {/* Hero Skeleton */}
      <div className="h-screen w-full relative flex items-center px-12 md:px-24">
        <div className="w-full max-w-4xl space-y-8 relative z-20">
          <Skeleton className="h-20 w-3/4 md:h-32 bg-white/10" />
          <Skeleton className="h-6 w-1/2 md:h-8 bg-white/10" />
          <div className="flex gap-4">
            <Skeleton className="h-14 w-40 rounded-full bg-white/10" />
            <Skeleton className="h-14 w-40 rounded-full bg-white/10" />
          </div>
        </div>
        {/* Host Image Placeholder */}
        <div className="absolute right-0 top-0 h-full w-[60%] hidden lg:block">
           <Skeleton className="h-full w-full bg-white/5 opacity-50" />
        </div>
      </div>

      {/* Content Stack Skeletons */}
      <div className="bg-[#d4eedf] p-12 md:p-24 space-y-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
           <div className="space-y-12">
             <Skeleton className="h-24 w-1/2 bg-[#038f90]/5" />
             <Skeleton className="aspect-video w-full rounded-3xl bg-[#038f90]/5" />
           </div>
           <div className="space-y-12 pt-20">
              <Skeleton className="h-12 w-3/4 bg-[#038f90]/5" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full bg-[#038f90]/5" />
                <Skeleton className="h-4 w-5/6 bg-[#038f90]/5" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
