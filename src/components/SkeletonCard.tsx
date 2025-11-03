import React from 'react';

const shimmer = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200';

export type SkeletonCardProps = {
  lines?: number;
  aspect?: 'square' | 'video' | 'banner';
  className?: string;
};

const SkeletonCard: React.FC<SkeletonCardProps> = ({ lines = 3, aspect = 'square', className }) => {
  const aspectClass = aspect === 'video' ? 'aspect-video' : aspect === 'banner' ? 'aspect-[16/6]' : 'aspect-square';
  return (
    <div className={["bg-white rounded-xl border p-3", className || ''].join(' ').trim()}>
      <div className={["rounded-lg overflow-hidden", shimmer, aspectClass].join(' ')} />
      <div className="mt-3 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={["h-3 rounded", shimmer, i === lines - 1 ? 'w-1/2' : 'w-full'].join(' ')} />
        ))}
      </div>
    </div>
  );
};

export default SkeletonCard;
