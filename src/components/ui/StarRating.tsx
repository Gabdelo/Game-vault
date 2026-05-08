import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  interactive?: boolean;
  size?: number;
}

export const StarRating = ({
  value = 0,
  onChange,
  interactive = true,
  size = 20
}: StarRatingProps) => {
  const [hover, setHover] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    if (interactive) {
      const newRating = rating === value ? 0 : rating;
      onChange?.(newRating);
    }
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = (hover ?? value) >= star;

        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(null)}
            disabled={!interactive}
            className={`transition-transform ${interactive ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
          >
            <Star
              size={size}
              className={`${
                isActive
                  ? "fill-cy text-cy"
                  : "text-white/15"
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};
