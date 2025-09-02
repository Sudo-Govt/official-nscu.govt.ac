import React from 'react';

interface SEOOptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  title?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

const SEOOptimizedImage: React.FC<SEOOptimizedImageProps> = ({
  src,
  alt,
  className,
  title,
  loading = 'lazy',
  width,
  height,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      title={title}
      loading={loading}
      width={width}
      height={height}
      decoding="async"
    />
  );
};

export default SEOOptimizedImage;