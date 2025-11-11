"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number | null;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md"
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (value: number) => {
    if (readonly || !onRatingChange) return;
    // If clicking the same rating, clear it
    onRatingChange(rating === value ? 0 : value);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          disabled={readonly}
          className={cn(
            "transition-colors",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
          aria-label={`Rate ${value} stars`}
        >
          <Star
            className={cn(
              sizeClasses[size],
              rating && value <= rating
                ? "fill-yellow-500 text-yellow-500"
                : "fill-none text-gray-300 dark:text-gray-600"
            )}
          />
        </button>
      ))}
      {!readonly && rating !== null && rating > 0 && (
        <button
          type="button"
          onClick={() => onRatingChange?.(0)}
          className="ml-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Clear
        </button>
      )}
    </div>
  );
}
