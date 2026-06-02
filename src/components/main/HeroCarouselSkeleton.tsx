export const HeroCarouselSkeleton = () => {
  return (
    <div className="w-screen max-w-6xl mx-auto">
      {/* Skeleton Container */}
      <div className="relative w-full h-96 bg-gray-900overflow-hidden border border-gray-800">
        {/* Main Image Skeleton */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-pulse w-full" />
        
        {/* Overlay Dark */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {/* Title Skeleton */}
          <div className="mb-4 space-y-3">
            <div className="h-8 bg-gray-700  w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-700  w-full animate-pulse" />
            <div className="h-4 bg-gray-700  w-5/6 animate-pulse" />
          </div>

          {/* Button Skeleton */}
          <div className="flex gap-3">
            <div className="h-10 bg-gray-700  w-32 animate-pulse" />
            <div className="h-10 bg-gray-700 w-32 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Indicators Skeleton */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 bg-gray-700  animate-pulse"
          />
        ))}
      </div>

      {/* Navigation Buttons Skeleton */}
      
    </div>
  )
}
