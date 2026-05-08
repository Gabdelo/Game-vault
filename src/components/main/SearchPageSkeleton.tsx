import GameCardSkeleton from "@/components/ui/GameCardSkeleton";
import { HeroCarouselSkeleton } from "@/components/main/HeroCarouselSkeleton";

export const SearchPageFiltersLoadingSkeleton = () => {
  return (
    <div className="w-full flex flex-col px-4 md:px-6 py-6 bg-black/90">
      {/* Título Skeleton */}
      <div className="flex flex-row justify-center mb-8">
        <div className="h-12 md:h-20 bg-gray-800 rounded w-2/3 animate-pulse" />
      </div>

      {/* Hero Carousel Skeleton */}
      <div className="flex flex-row justify-center pb-16">
        <HeroCarouselSkeleton />
      </div>

      {/* Contenido Principal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar Skeleton */}
        <div className="space-y-4">
          <div className="h-10 bg-gray-800 rounded animate-pulse" />
          <div className="h-6 bg-gray-800 rounded animate-pulse" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <main className="flex flex-col gap-6">
          {/* Título Section */}
          <div>
            <div className="h-8 bg-gray-800 rounded w-1/2 animate-pulse mb-2" />
            <div className="h-4 bg-gray-800 rounded w-1/4 animate-pulse" />
          </div>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={`skeleton-card-${i}`} className="flex-shrink-0">
                <GameCardSkeleton />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
