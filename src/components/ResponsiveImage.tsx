import React from 'react';

export type ResponsiveImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  srcSetWebp?: string;
  srcSetAvif?: string;
};

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  sizes,
  srcSetWebp,
  srcSetAvif,
}) => {
  // If no srcset provided, fallback to simple img with lazy loading
  if (!srcSetWebp && !srcSetAvif) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
      />
    );
  }

  return (
    <picture>
      {srcSetAvif ? <source type="image/avif" srcSet={srcSetAvif} sizes={sizes} /> : null}
      {srcSetWebp ? <source type="image/webp" srcSet={srcSetWebp} sizes={sizes} /> : null}
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
      />
    </picture>
  );
};

export default ResponsiveImage;
