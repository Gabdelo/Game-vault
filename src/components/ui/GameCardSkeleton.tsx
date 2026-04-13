import '../../styles/styles.css'
import { cardStyles } from '../../styles/cardStyle'

export default function GameCardSkeleton() {
  return (
    <>
      <style>{cardStyles}</style>
      <div className="cp-card">
        {/* Image Section Skeleton */}
        <div className="cp-card__img-wrap">
          <div className="cp-card__img bg-gray-700 animate-pulse" />
          <div className="cp-card__img-overlay" />
          <div className="cp-card__img-scanlines" />
          <div className="cp-card__corner-accent" />
        </div>

        {/* Body Section Skeleton */}
        <div className="cp-card__body">
          {/* Title Skeleton */}
          <div className="h-6 bg-gray-700 animate-pulse rounded mb-3" />

          {/* Genres Skeleton */}
          <div className="cp-card__genres mb-3">
            <div className="h-5 bg-gray-700 animate-pulse rounded w-16" />
            <div className="h-5 bg-gray-700 animate-pulse rounded w-16" />
          </div>

          {/* Meta Info Skeleton */}
          <div className="cp-card__meta mb-3">
            <div className="h-4 bg-gray-700 animate-pulse rounded w-24" />
            <div className="h-4 bg-gray-700 animate-pulse rounded w-20 mt-2" />
          </div>

          {/* Divider */}
          <div className="cp-card__divider" />

          {/* Button Skeleton */}
          <div className="cp-card__footer">
            <div className="h-10 bg-gray-700 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </>
  )
}
