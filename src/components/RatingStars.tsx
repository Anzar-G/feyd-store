import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number;
  className?: string;
  size?: number; // ukuran ikon dalam px, default 20 (w-5 h-5)
  label?: string; // override aria-label
}

const RatingStars: React.FC<RatingStarsProps> = ({ value, className, size = 20, label }) => {
  const clamped = Math.max(0, Math.min(5, value));
  const starClass = `text-gray-300`;
  const filledClass = `text-yellow-400 fill-yellow-400`;

  return (
    <div className={["flex", className || ""].join(" ").trim()} aria-label={label ?? `Rating ${clamped} dari 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, clamped - i));
        const isEmpty = fill <= 0;
        return (
          <div key={i} className="relative mr-1" style={{ width: size, height: size }} aria-hidden>
            <Star style={{ width: size, height: size }} className={starClass} />
            {!isEmpty && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star style={{ width: size, height: size }} className={filledClass} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RatingStars;
